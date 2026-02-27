"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function todayStr(): string {
  return formatDate(new Date());
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

function getDayLabel(dateStr: string): string {
  const today = todayStr();
  if (dateStr === today) return "Today";
  if (dateStr === addDays(today, -1)) return "Yesterday";
  if (dateStr === addDays(today, 1)) return "Tomorrow";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

function getDateLabel(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/** Generate 7 dates centered on the given date */
function generateDates(center: string): string[] {
  const dates: string[] = [];
  for (let i = -3; i <= 3; i++) {
    dates.push(addDays(center, i));
  }
  return dates;
}

export default function DateNav() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selected = searchParams.get("date") ?? todayStr();
  const today = todayStr();
  const isToday = selected === today;

  const dates = useMemo(() => generateDates(selected), [selected]);

  const navigate = useCallback(
    (date: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (date === today) {
        params.delete("date");
      } else {
        params.set("date", date);
      }
      const qs = params.toString();
      router.replace(qs ? `?${qs}` : "?", { scroll: false });
    },
    [router, searchParams, today]
  );

  const goLeft = () => navigate(addDays(selected, -1));
  const goRight = () => navigate(addDays(selected, 1));
  const goToday = () => navigate(today);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center w-full bg-surface/80 rounded-xl px-1 py-1 gap-0.5">
        {/* Left arrow */}
        <button
          onClick={goLeft}
          className="flex items-center justify-center w-8 h-10 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors shrink-0"
          aria-label="Previous day"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Date pills */}
        <div className="flex flex-1 gap-0.5 justify-center min-w-0">
          {dates.map((dateStr) => {
            const isSelected = dateStr === selected;
            const isTodayDate = dateStr === today;

            return (
              <button
                key={dateStr}
                onClick={() => navigate(dateStr)}
                className={`flex flex-col items-center py-1.5 px-1 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                  isSelected
                    ? "bg-white/12 ring-1 ring-white/10"
                    : "hover:bg-white/5"
                } ${isTodayDate && !isSelected ? "bg-gold-spark/5" : ""}`}
              >
                <span
                  className={`text-[10px] font-semibold leading-tight truncate ${
                    isTodayDate
                      ? "text-gold-spark"
                      : isSelected
                        ? "text-white/90"
                        : "text-white/35"
                  }`}
                >
                  {getDayLabel(dateStr)}
                </span>
                <span
                  className={`text-[11px] leading-tight tabular-nums ${
                    isSelected ? "text-white/70" : "text-white/25"
                  }`}
                >
                  {getDateLabel(dateStr)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right arrow */}
        <button
          onClick={goRight}
          className="flex items-center justify-center w-8 h-10 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors shrink-0"
          aria-label="Next day"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Jump to Today pill — only when not on today */}
      {!isToday && (
        <button
          onClick={goToday}
          className="px-3 py-0.5 bg-gold-spark/90 text-navy-dark text-[10px] font-bold rounded-full hover:bg-gold-spark transition-colors"
        >
          Jump to Today
        </button>
      )}
    </div>
  );
}
