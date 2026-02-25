"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Match, Sport } from "@/lib/types";
import { useLiveScores } from "@/hooks/useLiveScores";
import DatePicker from "./DatePicker";
import MatchList from "./MatchList";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDateHeader(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const diff = Math.round((date.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return "";
  if (diff === -1) return "Yesterday";
  if (diff === 1) return "Tomorrow";
  return date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}

function getEmptyDateMessage(sport: Sport | undefined, dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const isPast = date < today;
  const isFuture = date > today;

  if (sport === "nfl") {
    if (isFuture) return "NFL offseason — next season starts September 2025";
    if (isPast) return "No NFL games on this date";
  }
  if (sport === "mlb") {
    const month = date.getMonth();
    if (month < 2 || (month === 2 && date.getDate() < 20)) {
      return isFuture
        ? "MLB Spring Training begins late February"
        : "No MLB games on this date";
    }
  }
  if (isFuture) return "No games scheduled for this date";
  if (isPast) return "No results found for this date";
  return "No games found";
}

interface LiveMatchListProps {
  initialMatches: Match[];
  sport?: Sport;
}

export default function LiveMatchList({ initialMatches, sport }: LiveMatchListProps) {
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [dateMatches, setDateMatches] = useState<Match[] | null>(null);
  const [loadingDate, setLoadingDate] = useState(false);

  const isToday = selectedDate === todayStr();

  // Live polling only active for today's matches
  const { matches: liveMatches, hasLiveMatches, isPolling } = useLiveScores({
    initialMatches,
    sport,
    enabled: isToday,
  });

  const handleDateChange = useCallback(
    async (date: string) => {
      setSelectedDate(date);
      const today = todayStr();

      if (date === today) {
        // Switch back to live data
        setDateMatches(null);
        return;
      }

      // Fetch matches for the selected date
      setLoadingDate(true);
      try {
        const params = new URLSearchParams({ date });
        if (sport) params.set("sport", sport);
        const res = await fetch(`/api/v1/matches?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setDateMatches(data.matches ?? []);
        }
      } catch {
        setDateMatches([]);
      } finally {
        setLoadingDate(false);
      }
    },
    [sport]
  );

  const displayMatches = isToday ? liveMatches : (dateMatches ?? []);
  const dateHeader = formatDateHeader(selectedDate);
  const isPast = new Date(selectedDate + "T12:00:00") < new Date(todayStr() + "T12:00:00");
  const isFuture = new Date(selectedDate + "T12:00:00") > new Date(todayStr() + "T12:00:00");

  return (
    <div>
      {/* Date strip */}
      <DatePicker selectedDate={selectedDate} onDateChange={handleDateChange} sport={sport} />

      {/* Date context header for non-today */}
      {dateHeader && !loadingDate && (
        <div className="flex items-center gap-2 mt-3 mb-1">
          <span className="text-xs font-semibold text-white/50">{dateHeader}</span>
          <span className="text-[10px] text-white/20 px-1.5 py-0.5 bg-white/5 rounded-full">
            {isPast ? "Results" : isFuture ? "Schedule" : ""}
          </span>
          {displayMatches.length > 0 && (
            <span className="text-[10px] text-white/20 ml-auto">
              {displayMatches.length} game{displayMatches.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      {/* Live indicator */}
      {isToday && hasLiveMatches && (
        <div className="flex items-center gap-2 mt-3 mb-4">
          <div
            className={`w-2 h-2 rounded-full ${isPolling ? "bg-gold-spark" : "bg-live-green"} transition-colors`}
          />
          <span className="text-[11px] text-white/30">
            {isPolling ? "Updating..." : "Auto-updating every 30s"}
          </span>
        </div>
      )}

      {/* Loading state for non-today dates */}
      {loadingDate && (
        <div className="flex flex-col items-center justify-center py-12">
          <Image
            src="/scorespark_white_transparent_bg.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 object-contain animate-pulse-glow opacity-40"
          />
        </div>
      )}

      {/* Match list or contextual empty state */}
      {!loadingDate && displayMatches.length > 0 && <MatchList matches={displayMatches} />}
      {!loadingDate && displayMatches.length === 0 && !isToday && (
        <div className="flex flex-col items-center py-16 gap-3">
          <Image
            src="/scorespark_white_transparent_bg.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 object-contain opacity-15"
          />
          <p className="text-sm text-white/30 text-center max-w-[280px]">
            {getEmptyDateMessage(sport, selectedDate)}
          </p>
        </div>
      )}
      {!loadingDate && displayMatches.length === 0 && isToday && (
        <MatchList matches={[]} />
      )}
    </div>
  );
}
