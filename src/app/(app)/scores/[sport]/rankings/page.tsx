"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import type { ESPNPowerIndexTeam } from "@/lib/api/types/espn";

interface RankingsData {
  teams: ESPNPowerIndexTeam[];
}

function getRankingLabel(sport: string): string {
  switch (sport) {
    case "nfl": return "Football Power Index (FPI)";
    case "nba": return "Basketball Power Index (BPI)";
    case "nhl": return "Power Rankings";
    case "mlb": return "Power Rankings";
    default: return "Power Rankings";
  }
}

function getIndexField(sport: string): string {
  switch (sport) {
    case "nfl": return "fpi";
    case "nba": return "bpi";
    default: return "record";
  }
}

function getTeamIndex(team: ESPNPowerIndexTeam, sport: string): number | null {
  const field = getIndexField(sport);
  const cat = team.categories?.find((c) => c.name === field);
  if (!cat) return null;
  return cat.values?.[field] ?? cat.values?.wins ?? null;
}

function getTeamProjections(team: ESPNPowerIndexTeam): { projW?: number; projL?: number; playoffProb?: number } {
  const proj = team.categories?.find((c) => c.name === "projections");
  if (!proj) return {};
  return {
    projW: proj.values?.projW,
    projL: proj.values?.projL,
    playoffProb: proj.values?.playoffProb,
  };
}

export default function PowerRankingsPage() {
  const { sport } = useParams<{ sport: string }>();
  const [data, setData] = useState<RankingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sport === "soccer") return;
    setLoading(true);
    setError(null);
    fetch(`/api/v1/rankings?sport=${sport}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((d) => setData(d))
      .catch(() => setError("Failed to load power rankings"))
      .finally(() => setLoading(false));
  }, [sport]);

  if (sport === "soccer") {
    return (
      <div className="py-16 text-center">
        <p className="text-white/30">Power rankings are for American sports</p>
        <p className="text-white/20 text-sm mt-2">Check the Leagues tab for soccer standings</p>
      </div>
    );
  }

  const teams = data?.teams ?? [];

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-1">{getRankingLabel(sport)}</h1>
      <p className="text-xs text-white/30 mb-6">Powered by ESPN analytics</p>

      {loading && (
        <div className="flex justify-center py-12">
          <Image src="/scorespark_white_transparent_bg.png" alt="" width={40} height={40} className="h-10 w-10 object-contain animate-pulse-glow opacity-40" />
        </div>
      )}

      {error && <p className="text-red-400 text-sm text-center py-8">{error}</p>}

      {!loading && teams.length > 0 && (
        <div className="bg-card rounded-xl border border-white/5 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-2 px-4 py-2 text-[10px] font-bold text-white/20 uppercase tracking-wider border-b border-white/5">
            <span className="w-6 text-center">#</span>
            <span>Team</span>
            <span className="w-14 text-center">{sport === "nfl" ? "FPI" : sport === "nba" ? "BPI" : "W"}</span>
            <span className="w-16 text-center">Proj.</span>
            <span className="w-14 text-center">PO%</span>
          </div>

          {teams.map((team, i) => {
            const idx = getTeamIndex(team, sport);
            const { projW, projL, playoffProb } = getTeamProjections(team);
            const logo = team.logos?.[0]?.href;

            return (
              <div
                key={team.id}
                className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-2 px-4 py-2.5 items-center ${
                  i < 3 ? "bg-gold-spark/5" : ""
                } ${i !== teams.length - 1 ? "border-b border-white/5" : ""}`}
              >
                <span className={`w-6 text-center text-sm font-bold ${i < 3 ? "text-gold-spark" : "text-white/30"}`}>
                  {i + 1}
                </span>
                <div className="flex items-center gap-2 min-w-0">
                  {logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logo} alt="" className="w-6 h-6 object-contain flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white/90 truncate">{team.displayName}</p>
                  </div>
                </div>
                <span className="w-14 text-center text-sm font-bold text-white tabular-nums">
                  {idx !== null ? (typeof idx === "number" ? idx.toFixed(1) : idx) : "-"}
                </span>
                <span className="w-16 text-center text-xs text-white/40 tabular-nums">
                  {projW != null && projL != null ? `${Math.round(projW)}-${Math.round(projL)}` : "-"}
                </span>
                <span className={`w-14 text-center text-xs tabular-nums ${
                  playoffProb != null && playoffProb > 90 ? "text-green-400" :
                  playoffProb != null && playoffProb < 20 ? "text-red-400/60" :
                  "text-white/40"
                }`}>
                  {playoffProb != null ? `${playoffProb.toFixed(0)}%` : "-"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
