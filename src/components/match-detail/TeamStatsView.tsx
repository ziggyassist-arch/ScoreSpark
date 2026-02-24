"use client";

import type { Match } from "@/lib/types";

export default function TeamStatsView({ match }: { match: Match }) {
  const stats = match.sportDetail?.teamStats;

  if (!stats || stats.length === 0) {
    return (
      <div className="text-center py-12 text-white/30">
        <p>No stats available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stats.map((stat) => {
        const homeNum = parseFloat(stat.homeValue) || 0;
        const awayNum = parseFloat(stat.awayValue) || 0;
        const total = homeNum + awayNum;
        const homeWidth = total > 0 ? (homeNum / total) * 100 : 50;

        return (
          <div key={stat.name}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-white/80 tabular-nums font-medium">
                {stat.homeValue}
              </span>
              <span className="text-white/40 text-xs">{stat.name}</span>
              <span className="text-white/80 tabular-nums font-medium">
                {stat.awayValue}
              </span>
            </div>
            <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5">
              <div
                className="bg-blue-accent/60 rounded-full transition-all duration-500"
                style={{ width: `${homeWidth}%` }}
              />
              <div
                className="bg-white/20 rounded-full transition-all duration-500"
                style={{ width: `${100 - homeWidth}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
