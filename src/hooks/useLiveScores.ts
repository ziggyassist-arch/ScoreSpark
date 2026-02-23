"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Match, Sport } from "@/lib/types";
import { config } from "@/lib/config";

interface UseLiveScoresOptions {
  initialMatches: Match[];
  sport?: Sport;
  enabled?: boolean;
}

export function useLiveScores({ initialMatches, sport, enabled = true }: UseLiveScoresOptions) {
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if any matches are live (only poll if there are live matches)
  const hasLiveMatches = matches.some((m) => m.status === "live");

  const fetchMatches = useCallback(async () => {
    try {
      setIsPolling(true);
      const params = new URLSearchParams();
      if (sport) params.set("sport", sport);

      const res = await fetch(`/api/v1/matches?${params.toString()}`);
      if (!res.ok) return;

      const data = await res.json();
      if (data.matches) {
        setMatches(data.matches);
        setLastUpdated(new Date());
      }
    } catch {
      // Silently fail on poll errors — keep showing last known data
    } finally {
      setIsPolling(false);
    }
  }, [sport]);

  useEffect(() => {
    // Update matches when initialMatches prop changes (e.g., route change)
    setMatches(initialMatches);
  }, [initialMatches]);

  useEffect(() => {
    if (!enabled || !hasLiveMatches) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(fetchMatches, config.polling.intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, hasLiveMatches, fetchMatches]);

  return { matches, lastUpdated, isPolling, hasLiveMatches, refetch: fetchMatches };
}
