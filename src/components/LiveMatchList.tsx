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

  return (
    <div>
      {/* Date strip */}
      <DatePicker selectedDate={selectedDate} onDateChange={handleDateChange} sport={sport} />

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

      {/* Match list */}
      {!loadingDate && <MatchList matches={displayMatches} />}
    </div>
  );
}
