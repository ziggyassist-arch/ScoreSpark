"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Match, Sport } from "@/lib/types";

interface UseLiveScoresOptions {
  initialMatches: Match[];
  sport?: Sport;
  enabled?: boolean;
}

/** Check notification preferences from localStorage and fire browser notifications */
function fireMatchNotifications(prevMatches: Match[], newMatches: Match[]) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  let prefs: { enabled?: boolean; goals?: boolean; matchStart?: boolean; finalScore?: boolean; redCards?: boolean } = {};
  try {
    const stored = localStorage.getItem("scorespark-notifications");
    if (stored) prefs = JSON.parse(stored);
  } catch { return; }

  if (!prefs.enabled) return;

  const prevMap = new Map(prevMatches.map((m) => [m.id, m]));

  for (const m of newMatches) {
    const prev = prevMap.get(m.id);
    if (!prev) continue;

    // Match just started (was upcoming → now live)
    if (prefs.matchStart && prev.status === "upcoming" && m.status === "live") {
      try {
        new Notification(`${m.homeTeam.shortName} vs ${m.awayTeam.shortName}`, {
          body: `Match has kicked off! ${m.league}`,
          icon: "/icon-192.png",
          tag: `start-${m.id}`,
        });
      } catch {}
    }

    // Match just finished
    if (prefs.finalScore && prev.status === "live" && m.status === "finished") {
      try {
        new Notification("Full Time", {
          body: `${m.homeTeam.shortName} ${m.homeScore} - ${m.awayScore} ${m.awayTeam.shortName}`,
          icon: "/icon-192.png",
          tag: `ft-${m.id}`,
        });
      } catch {}
    }

    // New goal scored
    if (prefs.goals && m.events.length > prev.events.length) {
      const newEvents = m.events.slice(prev.events.length);
      for (const ev of newEvents) {
        if (ev.type === "goal" || ev.type === "penalty") {
          const team = ev.team === "home" ? m.homeTeam.shortName : m.awayTeam.shortName;
          try {
            new Notification(`GOAL! ${team}`, {
              body: `${ev.player} ${ev.minute}' — ${m.homeTeam.shortName} ${m.homeScore} - ${m.awayScore} ${m.awayTeam.shortName}`,
              icon: "/icon-192.png",
              tag: `goal-${m.id}-${ev.minute}`,
            });
          } catch {}
        }
        if (prefs.redCards && ev.type === "red-card") {
          const team = ev.team === "home" ? m.homeTeam.shortName : m.awayTeam.shortName;
          try {
            new Notification(`Red Card — ${team}`, {
              body: `${ev.player} sent off at ${ev.minute}'`,
              icon: "/icon-192.png",
              tag: `red-${m.id}-${ev.minute}`,
            });
          } catch {}
        }
      }
    }
  }
}

export function useLiveScores({ initialMatches, sport, enabled = true }: UseLiveScoresOptions) {
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isPolling, setIsPolling] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const prevMatchesRef = useRef<Match[]>(initialMatches);

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
        fireMatchNotifications(prevMatchesRef.current, data.matches);
        prevMatchesRef.current = data.matches;
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
    prevMatchesRef.current = initialMatches;
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
          fireMatchNotifications(prevMatchesRef.current, data.matches);
          prevMatchesRef.current = data.matches;
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
