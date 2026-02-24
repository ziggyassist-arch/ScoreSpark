"use client";

import type { Match } from "@/lib/types";

export default function NFLSituation({ match }: { match: Match }) {
  const sit = match.sportDetail?.situation;
  if (!sit || match.status !== "live") return null;

  const possTeam = sit.possession === "home" ? match.homeTeam : match.awayTeam;

  return (
    <div className="bg-surface rounded-xl p-4 space-y-2">
      {/* Down & Distance */}
      {sit.down && sit.distance && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {sit.isRedZone && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-500/15 text-red-400 rounded">
                RED ZONE
              </span>
            )}
            <span className="text-sm font-bold text-white">
              {sit.down}{sit.down === 1 ? "st" : sit.down === 2 ? "nd" : sit.down === 3 ? "rd" : "th"} & {sit.distance}
            </span>
          </div>
          {sit.yardLine && (
            <span className="text-xs text-white/40">
              at {possTeam.shortName} {sit.yardLine}
            </span>
          )}
        </div>
      )}

      {/* Possession */}
      <div className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={possTeam.badge} alt="" className="w-4 h-4 object-contain" />
        <span className="text-xs text-white/60">{possTeam.name} has possession</span>
      </div>

      {/* Last Play */}
      {sit.lastPlay && (
        <p className="text-xs text-white/40 leading-relaxed">{sit.lastPlay}</p>
      )}
    </div>
  );
}
