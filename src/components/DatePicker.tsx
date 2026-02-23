"use client";

import { useRef, useEffect } from "react";

interface DatePickerProps {
  selectedDate: string; // YYYY-MM-DD
  onDateChange: (date: string) => void;
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

export default function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLButtonElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate 15 days: 7 back, today, 7 forward
  const days: Date[] = [];
  for (let i = -7; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    days.push(d);
  }

  useEffect(() => {
    // Scroll to today on mount
    todayRef.current?.scrollIntoView({ inline: "center", behavior: "instant" });
  }, []);

  return (
    <div
      ref={scrollRef}
      className="flex gap-1 overflow-x-auto hide-scrollbar pb-1 -mx-1 px-1"
    >
      {days.map((day) => {
        const dateStr = formatDate(day);
        const isSelected = dateStr === selectedDate;
        const isToday = formatDate(day) === formatDate(today);
        const label = getDayLabel(day, today);

        return (
          <button
            key={dateStr}
            ref={isToday ? todayRef : undefined}
            onClick={() => onDateChange(dateStr)}
            className={`flex flex-col items-center min-w-[48px] py-1.5 px-2 rounded-xl transition-all duration-200 ${
              isSelected
                ? "bg-white/10 ring-1 ring-white/10"
                : "hover:bg-white/5"
            }`}
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
        );
      })}
    </div>
  );
}
