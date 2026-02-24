"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Match, Sport } from "@/lib/types";

interface UseLiveScoresOptions {
  initialMatches: Match[];
  sport?: Sport;
  enabled?: boolean;
}

export function useLiveScores({ initialMatches, sport, enabled = true }: UseLiveScoresOptions) {
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isPolling, setIsPolling] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Check if any matches are live
  const hasLiveMatches = matches.some((m) => m.status === "live");

  // Fallback fetch for manual refresh
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
      // Silently fail — keep showing last known data
    } finally {
      setIsPolling(false);
    }
  }, [sport]);

  // Update matches when initialMatches prop changes (route change)
  useEffect(() => {
    setMatches(initialMatches);
  }, [initialMatches]);

  // SSE connection for live updates
  useEffect(() => {
    if (!enabled || !hasLiveMatches) {
      // Close existing connection
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      return;
    }

    const params = new URLSearchParams();
    if (sport) params.set("sport", sport);

    const es = new EventSource(`/api/v1/matches/stream?${params.toString()}`);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.matches) {
          setMatches(data.matches);
          setLastUpdated(new Date());
          setIsPolling(false);
        }
      } catch {
        // Ignore parse errors
      }
    };

    es.onerror = () => {
      // SSE reconnects automatically, but close after too many failures
      // Browser will auto-reconnect with exponential backoff
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [enabled, hasLiveMatches, sport]);

  return { matches, lastUpdated, isPolling, hasLiveMatches, refetch: fetchMatches };
}
