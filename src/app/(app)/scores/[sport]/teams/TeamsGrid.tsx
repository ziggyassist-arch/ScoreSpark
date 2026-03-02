"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface TeamItem {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  sport: string;
}

const SOCCER_LEAGUES = [
  { code: "CL", name: "Champions League", country: "Europe" },
  { code: "PL", name: "Premier League", country: "England" },
  { code: "PD", name: "La Liga", country: "Spain" },
  { code: "BL1", name: "Bundesliga", country: "Germany" },
  { code: "SA", name: "Serie A", country: "Italy" },
  { code: "FL1", name: "Ligue 1", country: "France" },
  { code: "DED", name: "Eredivisie", country: "Netherlands" },
  { code: "PPL", name: "Primeira Liga", country: "Portugal" },
  { code: "ELC", name: "Championship", country: "England" },
] as const;

export default function TeamsGrid({
  sport,
  initialLeague,
}: {
  sport: string;
  initialLeague?: string;
}) {
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [league, setLeague] = useState(initialLeague || "CL");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const params = new URLSearchParams({ sport });
    if (sport === "soccer") {
      params.set("league", league);
    }

    fetch(`/api/v1/teams?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setTeams(data.teams ?? []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTeams([]);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [sport, league]);

  const currentLeague = SOCCER_LEAGUES.find((l) => l.code === league) ?? SOCCER_LEAGUES[0];

  const sportLabels: Record<string, string> = {
    soccer: "Soccer",
    nba: "NBA",
    nfl: "NFL",
    nhl: "NHL",
    mlb: "MLB",
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white">
          {sportLabels[sport] ?? sport} Teams
        </h1>
        <p className="text-sm text-white/40 mt-1">
          {sport === "soccer"
            ? `${currentLeague.name} — ${loading ? "Loading..." : `${teams.length} teams`}`
            : loading
              ? "Loading..."
              : `${teams.length} teams`}
        </p>
      </div>

      {/* League selector for soccer */}
      {sport === "soccer" && (
        <div className="relative">
          <select
            value={league}
            onChange={(e) => setLeague(e.target.value)}
            className="w-full appearance-none bg-card border border-white/10 rounded-xl px-4 py-3 text-sm text-white/90 font-medium cursor-pointer hover:border-white/20 transition-colors focus:outline-none focus:border-gold-spark/50"
            style={{ colorScheme: "dark" }}
          >
            {SOCCER_LEAGUES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name} ({l.country})
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-5 h-5 text-white/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl border border-white/5 animate-pulse"
            >
              <div className="w-12 h-12 rounded-full bg-white/5" />
              <div className="w-16 h-3 rounded bg-white/5" />
            </div>
          ))}
        </div>
      )}

      {/* Team grid */}
      {!loading && teams.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {teams.map((team) => (
            <Link
              key={team.id}
              href={`/team/${team.id}`}
              className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all group hover-card-lift"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={team.badge || `https://placehold.co/48x48/1E1B3A/7EB6E6?text=${encodeURIComponent(team.shortName?.[0] ?? "?")}`}
                alt={team.name}
                className="w-12 h-12 object-contain group-hover:scale-110 transition-transform"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  if (!t.dataset.fallback) {
                    t.dataset.fallback = "1";
                    t.src = `https://placehold.co/48x48/1E1B3A/7EB6E6?text=${encodeURIComponent(team.shortName?.[0] ?? "?")}`;
                  }
                }}
              />
              <span className="text-sm text-white/80 text-center leading-tight group-hover:text-white transition-colors">
                {team.shortName}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && teams.length === 0 && (
        <div className="flex flex-col items-center py-16 gap-3">
          <svg className="w-12 h-12 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
          <p className="text-white/30 text-sm">
            {sport === "soccer"
              ? "No teams available for this league"
              : "No teams available"}
          </p>
        </div>
      )}
    </div>
  );
}
