"use client";

import type { Match, Sport } from "@/lib/types";

/** Period labels by sport */
function getPeriodLabels(sport: Sport, count: number): string[] {
  switch (sport) {
    case "nba":
      // 4 quarters + OT periods
      return Array.from({ length: count }, (_, i) =>
        i < 4 ? `Q${i + 1}` : i === 4 ? "OT" : `OT${i - 3}`
      );
    case "nfl":
      return Array.from({ length: count }, (_, i) =>
        i < 4 ? `Q${i + 1}` : i === 4 ? "OT" : `OT${i - 3}`
      );
    case "nhl":
      return Array.from({ length: count }, (_, i) =>
        i < 3 ? `P${i + 1}` : i === 3 ? "OT" : "SO"
      );
    case "mlb":
      return Array.from({ length: count }, (_, i) => `${i + 1}`);
    default:
      return Array.from({ length: count }, (_, i) => `${i + 1}`);
  }
}

export default function LinescoreTable({ match }: { match: Match }) {
  const detail = match.sportDetail;
  if (!detail?.linescores) return null;

  const { home, away } = detail.linescores;
  const maxPeriods = Math.max(home.length, away.length);
  const labels = getPeriodLabels(match.sport, maxPeriods);

  return (
    <div className="overflow-x-auto hide-scrollbar">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left text-white/40 font-medium py-2 pr-4 w-24">Team</th>
            {labels.map((label, i) => (
              <th key={i} className="text-center text-white/40 font-medium py-2 px-2 min-w-[28px]">
                {label}
              </th>
            ))}
            <th className="text-center text-white/60 font-semibold py-2 pl-3 min-w-[32px]">T</th>
          </tr>
        </thead>
        <tbody>
          {/* Home team */}
          <tr className="border-b border-white/5">
            <td className="py-2 pr-4">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={match.homeTeam.badge} alt="" className="w-4 h-4 object-contain" />
                <span className="text-white/80 font-medium">{match.homeTeam.shortName}</span>
              </div>
            </td>
            {home.map((score, i) => (
              <td key={i} className="text-center text-white/70 tabular-nums py-2 px-2">
                {score}
              </td>
            ))}
            {/* Pad if fewer periods */}
            {Array.from({ length: maxPeriods - home.length }).map((_, i) => (
              <td key={`pad-h-${i}`} className="text-center text-white/20 py-2 px-2">-</td>
            ))}
            <td className="text-center text-white font-bold tabular-nums py-2 pl-3">
              {match.homeScore}
            </td>
          </tr>
          {/* Away team */}
          <tr>
            <td className="py-2 pr-4">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={match.awayTeam.badge} alt="" className="w-4 h-4 object-contain" />
                <span className="text-white/80 font-medium">{match.awayTeam.shortName}</span>
              </div>
            </td>
            {away.map((score, i) => (
              <td key={i} className="text-center text-white/70 tabular-nums py-2 px-2">
                {score}
              </td>
            ))}
            {Array.from({ length: maxPeriods - away.length }).map((_, i) => (
              <td key={`pad-a-${i}`} className="text-center text-white/20 py-2 px-2">-</td>
            ))}
            <td className="text-center text-white font-bold tabular-nums py-2 pl-3">
              {match.awayScore}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
