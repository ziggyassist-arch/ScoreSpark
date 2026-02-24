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
              className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={team.badge}
                alt={team.name}
                className="w-12 h-12 object-contain group-hover:scale-110 transition-transform"
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
        <div className="text-center py-16">
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
