"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Sport } from "@/lib/types";

// — News types —
interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  sport: Sport;
  imageUrl?: string;
  timeAgo: string;
}

// — Compact standing row (shared across sports) —
interface MiniStanding {
  position: number;
  teamName: string;
  teamBadge: string;
  points?: number;
  record?: string;
}

const SPORT_TABS: { sport: Sport; label: string; icon: string }[] = [
  { sport: "soccer", label: "Soccer", icon: "/leagues/pl.png" },
  { sport: "nba", label: "NBA", icon: "https://a.espncdn.com/i/teamlogos/leagues/500/nba.png" },
  { sport: "nfl", label: "NFL", icon: "https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png" },
  { sport: "nhl", label: "NHL", icon: "https://a.espncdn.com/i/teamlogos/leagues/500/nhl.png" },
  { sport: "mlb", label: "MLB", icon: "https://a.espncdn.com/i/teamlogos/leagues/500/mlb.png" },
];

const STANDINGS_LEAGUE_MAP: Record<Sport, string> = {
  soccer: "epl",
  nba: "nba-east",
  nfl: "nfl-afc",
  nhl: "nhl",
  mlb: "mlb-al",
};

const STANDINGS_LABEL_MAP: Record<Sport, string> = {
  soccer: "Premier League",
  nba: "NBA Eastern",
  nfl: "NFL AFC",
  nhl: "NHL",
  mlb: "MLB American",
};

export default function Sidebar() {
  const [activeSport, setActiveSport] = useState<Sport>("soccer");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [standings, setStandings] = useState<MiniStanding[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingStandings, setLoadingStandings] = useState(true);

  // Fetch news for the active sport
  useEffect(() => {
    setLoadingNews(true);
    fetch(`/api/v1/news?sport=${activeSport}`)
      .then((r) => r.json())
      .then((data) => setNews(data.articles ?? []))
      .catch(() => setNews([]))
      .finally(() => setLoadingNews(false));
  }, [activeSport]);

  // Fetch standings for the active sport
  useEffect(() => {
    setLoadingStandings(true);
    const league = STANDINGS_LEAGUE_MAP[activeSport];
    fetch(`/api/v1/standings/${league}`)
      .then((r) => r.json())
      .then((data) => {
        // API returns { type: "soccer"|"nba"|"nhl", rows: [...] }
        const rows = data.rows ?? [];
        const mini: MiniStanding[] = rows.slice(0, 5).map((row: Record<string, unknown>, idx: number) => {
          const team = row.team as Record<string, unknown> | undefined;
          return {
            position: (row.position as number) ?? idx + 1,
            teamName: (team?.shortName as string) ?? (team?.name as string) ?? "—",
            teamBadge: (team?.badge as string) ?? "",
            points: row.points as number | undefined,
            record: row.won !== undefined
              ? `${row.won}-${row.lost ?? row.otLosses ?? 0}`
              : row.winPct !== undefined
              ? (row.winPct as string)
              : undefined,
          };
        });
        setStandings(mini);
      })
      .catch(() => setStandings([]))
      .finally(() => setLoadingStandings(false));
  }, [activeSport]);

  return (
    <aside className="space-y-4">
      {/* Sport tabs */}
      <div className="flex gap-1 overflow-x-auto hide-scrollbar">
        {SPORT_TABS.map(({ sport, label, icon }) => (
          <button
            key={sport}
            onClick={() => setActiveSport(sport)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeSport === sport
                ? "bg-white/10 text-white ring-1 ring-white/10"
                : "text-white/40 hover:text-white/60 hover:bg-white/5"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={icon} alt={label} className="w-4 h-4 object-contain" />
            {label}
          </button>
        ))}
      </div>

      {/* News section */}
      <div className="bg-surface rounded-2xl p-4">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
          Top Stories
        </h3>
        {loadingNews ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-3 bg-white/5 rounded w-full mb-1.5" />
                <div className="h-3 bg-white/5 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <p className="text-xs text-white/20">No stories right now</p>
        ) : (
          <div className="space-y-3">
            {news.slice(0, 5).map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <p className="text-[13px] text-white/80 leading-snug group-hover:text-white transition-colors line-clamp-2">
                  {item.title}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] text-white/30">{item.source}</span>
                  <span className="text-[10px] text-white/15">·</span>
                  <span className="text-[10px] text-white/30">{item.timeAgo}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Standings widget */}
      <div className="bg-surface rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
            {STANDINGS_LABEL_MAP[activeSport]}
          </h3>
          <Link
            href={`/standings/${STANDINGS_LEAGUE_MAP[activeSport]}`}
            className="text-[10px] text-gold-spark hover:text-gold-spark/80 transition-colors"
          >
            Full Table →
          </Link>
        </div>
        {loadingStandings ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse h-6 bg-white/5 rounded" />
            ))}
          </div>
        ) : standings.length === 0 ? (
          <p className="text-xs text-white/20">No standings available</p>
        ) : (
          <div className="space-y-1">
            {standings.map((row) => (
              <div
                key={row.position}
                className="flex items-center gap-2 py-1.5 px-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <span className="text-[11px] text-white/30 w-4 text-right tabular-nums">
                  {row.position}
                </span>
                {row.teamBadge && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={row.teamBadge}
                    alt={row.teamName}
                    className="w-4 h-4 object-contain"
                  />
                )}
                <span className="text-[12px] text-white/80 flex-1 truncate">
                  {row.teamName}
                </span>
                {row.points !== undefined && (
                  <span className="text-[11px] text-white/50 tabular-nums font-semibold">
                    {row.points}
                  </span>
                )}
                {row.record && (
                  <span className="text-[11px] text-white/50 tabular-nums font-semibold">
                    {row.record}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
