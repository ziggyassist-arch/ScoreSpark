"use client";

import { useEffect, useState } from "react";
import type { Match } from "@/lib/types";

interface BoxscorePlayerStat {
  athlete: {
    displayName: string;
    shortName: string;
    jersey?: string;
    position?: { abbreviation: string };
  };
  stats: string[];
  starter: boolean;
  didNotPlay?: boolean;
}

interface BoxscoreStatCategory {
  name: string;
  labels: string[];
  athletes: BoxscorePlayerStat[];
}

interface BoxscoreTeamData {
  team: { displayName: string; abbreviation: string };
  statistics: BoxscoreStatCategory[];
}

interface SummaryData {
  boxscore?: {
    teams: { team: { displayName: string; abbreviation: string }; statistics: { name: string; displayValue: string; label: string }[] }[];
    players: BoxscoreTeamData[];
  };
}

export default function BoxScore({ match }: { match: Match }) {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTeamIdx, setActiveTeamIdx] = useState(0);
  const [activeCat, setActiveCat] = useState(0);

  useEffect(() => {
    if (!match.id.startsWith("espn-")) {
      setLoading(false);
      return;
    }
    const parts = match.id.split("-");
    const sport = parts[1];
    const eventId = parts.slice(2).join("-");

    fetch(`/api/v1/summary?sport=${sport}&eventId=${eventId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [match.id]);

  if (loading) {
    return <div className="text-center py-12 text-white/30 animate-pulse">Loading box score...</div>;
  }

  if (!data?.boxscore?.players?.length) {
    // Fallback to team-level stats from scoreboard
    const stats = match.sportDetail?.teamStats;
    if (stats && stats.length > 0) {
      return (
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Team Stats</h3>
          {stats.map((stat) => {
            const homeNum = parseFloat(stat.homeValue) || 0;
            const awayNum = parseFloat(stat.awayValue) || 0;
            const total = homeNum + awayNum;
            const homeWidth = total > 0 ? (homeNum / total) * 100 : 50;
            return (
              <div key={stat.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-white/80 tabular-nums font-medium">{stat.homeValue}</span>
                  <span className="text-white/40 text-xs">{stat.name}</span>
                  <span className="text-white/80 tabular-nums font-medium">{stat.awayValue}</span>
                </div>
                <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5">
                  <div className="bg-blue-accent/60 rounded-full" style={{ width: `${homeWidth}%` }} />
                  <div className="bg-white/20 rounded-full" style={{ width: `${100 - homeWidth}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    return <div className="text-center py-12 text-white/30">Box score not available</div>;
  }

  const players = data.boxscore.players;
  const teamData = players[activeTeamIdx];
  if (!teamData?.statistics?.length) {
    return <div className="text-center py-12 text-white/30">No player stats available</div>;
  }

  const categories = teamData.statistics;
  const cat = categories[activeCat] ?? categories[0];

  return (
    <div className="space-y-4">
      {/* Team selector */}
      <div className="flex gap-1 bg-surface rounded-lg p-0.5">
        {players.map((p, i) => (
          <button
            key={i}
            onClick={() => { setActiveTeamIdx(i); setActiveCat(0); }}
            className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${
              activeTeamIdx === i
                ? "bg-card text-white shadow-sm"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            {p.team.abbreviation}
          </button>
        ))}
      </div>

      {/* Category selector */}
      {categories.length > 1 && (
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {categories.map((c, i) => (
            <button
              key={c.name}
              onClick={() => setActiveCat(i)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                activeCat === i
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Player stats table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left py-2 px-2 text-[10px] font-bold text-white/30 uppercase sticky left-0 bg-card">Player</th>
              {cat.labels.map((label) => (
                <th key={label} className="text-center py-2 px-1.5 text-[10px] font-bold text-white/30 uppercase min-w-[36px]">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Starters */}
            {cat.athletes.filter((a) => a.starter && !a.didNotPlay).map((athlete, i) => (
              <tr key={i} className="border-b border-white/[0.03]">
                <td className="py-2 px-2 sticky left-0 bg-card">
                  <div className="flex items-center gap-1.5">
                    {athlete.athlete.jersey && (
                      <span className="text-[10px] text-white/20 w-4 tabular-nums">{athlete.athlete.jersey}</span>
                    )}
                    <span className="text-white/80 font-medium truncate max-w-[100px]">{athlete.athlete.shortName}</span>
                    {athlete.athlete.position && (
                      <span className="text-[9px] text-white/20">{athlete.athlete.position.abbreviation}</span>
                    )}
                  </div>
                </td>
                {athlete.stats.map((stat, j) => (
                  <td key={j} className="text-center py-2 px-1.5 text-white/60 tabular-nums">{stat}</td>
                ))}
              </tr>
            ))}
            {/* Bench header */}
            {cat.athletes.some((a) => !a.starter && !a.didNotPlay) && (
              <tr>
                <td colSpan={cat.labels.length + 1} className="py-1.5 px-2 text-[9px] font-bold text-white/20 uppercase bg-white/[0.02] sticky left-0">
                  Bench
                </td>
              </tr>
            )}
            {cat.athletes.filter((a) => !a.starter && !a.didNotPlay).map((athlete, i) => (
              <tr key={`bench-${i}`} className="border-b border-white/[0.03]">
                <td className="py-1.5 px-2 sticky left-0 bg-card">
                  <div className="flex items-center gap-1.5">
                    {athlete.athlete.jersey && (
                      <span className="text-[10px] text-white/15 w-4 tabular-nums">{athlete.athlete.jersey}</span>
                    )}
                    <span className="text-white/50 truncate max-w-[100px]">{athlete.athlete.shortName}</span>
                  </div>
                </td>
                {athlete.stats.map((stat, j) => (
                  <td key={j} className="text-center py-1.5 px-1.5 text-white/40 tabular-nums">{stat}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
