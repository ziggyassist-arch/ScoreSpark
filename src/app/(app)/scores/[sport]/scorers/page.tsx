"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import type { FDScorer } from "@/lib/api/football-data";

const LEAGUE_OPTIONS = [
  { code: "PL", name: "Premier League", logo: "/leagues/pl.png" },
  { code: "PD", name: "La Liga", logo: "/leagues/laliga.png" },
  { code: "BL1", name: "Bundesliga", logo: "/leagues/bundesliga.png" },
  { code: "SA", name: "Serie A", logo: "/leagues/seriea.png" },
  { code: "FL1", name: "Ligue 1", logo: "/leagues/ligue1.png" },
  { code: "CL", name: "Champions League", logo: "/leagues/ucl.png" },
  { code: "DED", name: "Eredivisie", logo: "/leagues/eredivisie.png" },
  { code: "ELC", name: "Championship", logo: "/leagues/championship.png" },
  { code: "PPL", name: "Primeira Liga", logo: "/leagues/ligapt.png" },
];

type SortMode = "goals" | "assists";

interface ScorersData {
  competition: { name: string; code: string };
  season: { currentMatchday: number };
  scorers: FDScorer[];
}

export default function TopScorersPage() {
  const { sport } = useParams<{ sport: string }>();
  const [league, setLeague] = useState("PL");
  const [data, setData] = useState<ScorersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("goals");

  useEffect(() => {
    if (sport !== "soccer") return;
    setLoading(true);
    setError(null);
    fetch(`/api/v1/scorers?competition=${league}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((d) => setData(d))
      .catch(() => setError("Failed to load top scorers"))
      .finally(() => setLoading(false));
  }, [league, sport]);

  if (sport !== "soccer") {
    return (
      <div className="py-16 text-center">
        <p className="text-white/30">Top scorers are available for soccer leagues</p>
        <p className="text-white/20 text-sm mt-2">For other sports, check the Stats Leaders tab</p>
      </div>
    );
  }

  // Sort scorers by selected mode
  const sortedScorers = data?.scorers
    ? [...data.scorers].sort((a, b) => {
        if (sortMode === "assists") {
          return (b.assists ?? 0) - (a.assists ?? 0);
        }
        return b.goals - a.goals;
      })
    : [];

  return (
    <div>
      {/* Title + sort toggle */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-white">
          {sortMode === "goals" ? "Top Scorers" : "Assist Leaders"}
        </h1>
        <div className="flex gap-1 bg-surface rounded-lg p-0.5">
          <button
            onClick={() => setSortMode("goals")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              sortMode === "goals"
                ? "bg-card text-white shadow-sm"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            Goals
          </button>
          <button
            onClick={() => setSortMode("assists")}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              sortMode === "assists"
                ? "bg-card text-white shadow-sm"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            Assists
          </button>
        </div>
      </div>

      {/* League selector */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6 pb-1">
        {LEAGUE_OPTIONS.map((opt) => (
          <button
            key={opt.code}
            onClick={() => setLeague(opt.code)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              league === opt.code
                ? "bg-white/10 text-white ring-1 ring-white/10"
                : "text-white/40 hover:text-white/60 hover:bg-white/5"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={opt.logo} alt="" className="w-4 h-4 object-contain" />
            {opt.name}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <Image src="/scorespark_white_transparent_bg.png" alt="" width={40} height={40} className="h-10 w-10 object-contain animate-pulse-glow opacity-40" />
        </div>
      )}

      {error && <p className="text-red-400 text-sm text-center py-8">{error}</p>}

      {!loading && data && (
        <div className="bg-card rounded-xl border border-white/5 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <span className="text-sm font-semibold text-white/60">{data.competition.name}</span>
            <span className="text-[10px] text-white/20">Matchday {data.season.currentMatchday}</span>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-2 px-4 py-2 text-[10px] font-bold text-white/20 uppercase tracking-wider border-b border-white/5">
            <span className="w-6 text-center">#</span>
            <span>Player</span>
            <span className="w-10 text-center">GP</span>
            <span className={`w-10 text-center ${sortMode === "goals" ? "text-gold-spark/60" : ""}`}>G</span>
            <span className={`w-10 text-center ${sortMode === "assists" ? "text-gold-spark/60" : ""}`}>A</span>
          </div>

          {/* Scorers rows */}
          {sortedScorers.map((scorer, i) => (
            <div
              key={`${scorer.player.id}-${i}`}
              className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-2 px-4 py-2.5 items-center ${
                i < 3 ? "bg-gold-spark/5" : ""
              } ${i !== sortedScorers.length - 1 ? "border-b border-white/5" : ""}`}
            >
              <span className={`w-6 text-center text-sm font-bold ${i < 3 ? "text-gold-spark" : "text-white/30"}`}>
                {i + 1}
              </span>
              <div className="flex items-center gap-2 min-w-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={scorer.team.crest} alt="" className="w-5 h-5 object-contain flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white/90 truncate">{scorer.player.name}</p>
                  <p className="text-[10px] text-white/30 truncate">{scorer.team.name}</p>
                </div>
              </div>
              <span className="w-10 text-center text-xs text-white/40 tabular-nums">{scorer.playedMatches}</span>
              <span className={`w-10 text-center tabular-nums ${
                sortMode === "goals" ? "text-sm font-bold text-white" : "text-xs text-white/40"
              }`}>{scorer.goals}</span>
              <span className={`w-10 text-center tabular-nums ${
                sortMode === "assists" ? "text-sm font-bold text-white" : "text-xs text-white/40"
              }`}>{scorer.assists ?? "-"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
