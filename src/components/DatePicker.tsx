"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface DatePickerProps {
  selectedDate: string; // YYYY-MM-DD
  onDateChange: (date: string) => void;
  sport?: string;
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getDayLabel(date: Date, today: Date): string {
  const diff = Math.round((date.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === -1) return "Yesterday";
  if (diff === 1) return "Tomorrow";
  return date.toLocaleDateString(undefined, { weekday: "short" });
}

function getDayNumber(date: Date): string {
  return date.getDate().toString();
}

function getMonthLabel(date: Date): string {
  return date.toLocaleDateString(undefined, { month: "short" });
}

/** Generate an array of dates from daysBack before today to daysForward after */
function generateDays(daysBack: number, daysForward: number): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days: Date[] = [];
  for (let i = -daysBack; i <= daysForward; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function DatePicker({ selectedDate, onDateChange, sport }: DatePickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLButtonElement>(null);
  const [showJumpToToday, setShowJumpToToday] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // NFL season is over — show more past dates for browsing results
  // NBA/NHL in season — balanced range
  // MLB approaching opening day — show more future dates
  const daysBack = sport === "nfl" ? 60 : 30;
  const daysForward = sport === "mlb" ? 45 : sport === "nfl" ? 14 : 30;

  const days = generateDays(daysBack, daysForward);

  useEffect(() => {
    // Scroll to today on mount
    todayRef.current?.scrollIntoView({ inline: "center", behavior: "instant" });
  }, []);

  // Track scroll position to show "Jump to Today" button
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !todayRef.current) return;
    const container = scrollRef.current;
    const todayEl = todayRef.current;
    const containerRect = container.getBoundingClientRect();
    const todayRect = todayEl.getBoundingClientRect();
    const isVisible =
      todayRect.left >= containerRect.left - 48 &&
      todayRect.right <= containerRect.right + 48;
    setShowJumpToToday(!isVisible);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToToday = () => {
    todayRef.current?.scrollIntoView({ inline: "center", behavior: "smooth" });
    onDateChange(formatDate(today));
  };

  // Detect month boundaries for visual separators
  let lastMonth = -1;

  return (
    <div className="relative">
      {/* Jump to today pill */}
      {showJumpToToday && (
        <button
          onClick={scrollToToday}
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10 px-3 py-1 bg-gold-spark/90 text-navy-dark text-[10px] font-bold rounded-full shadow-lg hover:bg-gold-spark transition-colors"
        >
          Today
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-0.5 overflow-x-auto hide-scrollbar pb-1 -mx-1 px-1"
      >
        {days.map((day) => {
          const dateStr = formatDate(day);
          const isSelected = dateStr === selectedDate;
          const isToday = formatDate(day) === formatDate(today);
          const label = getDayLabel(day, today);
          const monthNum = day.getMonth();
          const showMonthDivider = lastMonth !== -1 && monthNum !== lastMonth;
          lastMonth = monthNum;

          return (
            <div key={dateStr} className="flex items-stretch">
              {/* Month divider */}
              {showMonthDivider && (
                <div className="flex items-center px-1">
                  <div className="w-px h-8 bg-white/10" />
                </div>
              )}
              <button
                ref={isToday ? todayRef : undefined}
                onClick={() => onDateChange(dateStr)}
                className={`flex flex-col items-center min-w-[44px] py-1.5 px-1.5 rounded-xl transition-all duration-200 ${
                  isSelected
                    ? "bg-white/10 ring-1 ring-white/10"
                    : "hover:bg-white/5"
                } ${isToday && !isSelected ? "bg-gold-spark/5" : ""}`}
              >
                <span
                  className={`text-[10px] font-medium ${
                    isToday
                      ? "text-gold-spark"
                      : isSelected
                      ? "text-white/80"
                      : "text-white/30"
                  }`}
                >
                  {label}
                </span>
                <span
                  className={`text-sm font-bold tabular-nums ${
                    isSelected ? "text-white" : "text-white/50"
                  }`}
                >
                  {getDayNumber(day)}
                </span>
                <span
                  className={`text-[9px] ${
                    isSelected ? "text-white/60" : "text-white/20"
                  }`}
                >
                  {getMonthLabel(day)}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
