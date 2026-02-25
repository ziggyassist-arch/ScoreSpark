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

type ViewMode = "goals" | "assists";

interface ScorersData {
  competition: { name: string; code: string };
  season: { currentMatchday: number };
  scorers: FDScorer[];
}

function PlayerRow({ scorer, rank, stat, statLabel }: { scorer: FDScorer; rank: number; stat: number; statLabel: "G" | "A" }) {
  const isTop3 = rank <= 3;
  return (
    <div className={`flex items-center gap-2.5 px-3 py-2 ${isTop3 ? "bg-gold-spark/5" : ""}`}>
      <span className={`w-5 text-center text-xs font-bold tabular-nums ${isTop3 ? "text-gold-spark" : "text-white/25"}`}>
        {rank}
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={scorer.team.crest} alt="" className="w-5 h-5 object-contain flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white/90 truncate">{scorer.player.name}</p>
        <p className="text-[10px] text-white/30 truncate">{scorer.team.shortName}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <span className="text-sm font-bold text-white tabular-nums">{stat}</span>
        <span className="text-[9px] text-white/20 ml-0.5">{statLabel}</span>
      </div>
    </div>
  );
}

function LeaderList({ title, scorers, statKey, statLabel, icon }: {
  title: string;
  scorers: FDScorer[];
  statKey: "goals" | "assists";
  statLabel: "G" | "A";
  icon: React.ReactNode;
}) {
  const sorted = [...scorers].sort((a, b) => {
    const aVal = statKey === "assists" ? (a.assists ?? 0) : a.goals;
    const bVal = statKey === "assists" ? (b.assists ?? 0) : b.goals;
    return bVal - aVal;
  }).slice(0, 15);

  return (
    <div className="bg-card rounded-xl border border-white/5 overflow-hidden">
      <div className="px-3 py-2.5 border-b border-white/5 flex items-center gap-2">
        {icon}
        <span className="text-sm font-bold text-white/80">{title}</span>
      </div>
      <div className="divide-y divide-white/5">
        {sorted.map((scorer, i) => {
          const stat = statKey === "assists" ? (scorer.assists ?? 0) : scorer.goals;
          return (
            <PlayerRow
              key={`${scorer.player.id}-${statKey}`}
              scorer={scorer}
              rank={i + 1}
              stat={stat}
              statLabel={statLabel}
            />
          );
        })}
        {sorted.length === 0 && (
          <div className="px-3 py-6 text-center text-white/20 text-sm">No data available</div>
        )}
      </div>
    </div>
  );
}

export default function TopScorersPage() {
  const { sport } = useParams<{ sport: string }>();
  const [league, setLeague] = useState("PL");
  const [data, setData] = useState<ScorersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<ViewMode>("goals");

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

  return (
    <div className="animate-slide-up">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-white">Top Scorers & Assists</h1>
        {data && (
          <p className="text-xs text-white/30 mt-1">
            {data.competition.name} — Matchday {data.season.currentMatchday}
          </p>
        )}
      </div>

      {/* League selector */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-4 pb-1">
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
        <>
          {/* Mobile: toggle between goals / assists */}
          <div className="md:hidden flex gap-1 bg-surface rounded-lg p-0.5 mb-4">
            <button
              onClick={() => setMobileView("goals")}
              className={`flex-1 px-3 py-2 text-xs font-semibold rounded-md transition-all ${
                mobileView === "goals" ? "bg-card text-white shadow-sm" : "text-white/40"
              }`}
            >
              Top Scorers
            </button>
            <button
              onClick={() => setMobileView("assists")}
              className={`flex-1 px-3 py-2 text-xs font-semibold rounded-md transition-all ${
                mobileView === "assists" ? "bg-card text-white shadow-sm" : "text-white/40"
              }`}
            >
              Top Assists
            </button>
          </div>

          {/* Mobile: single list */}
          <div className="md:hidden">
            {mobileView === "goals" ? (
              <LeaderList
                title="Top Scorers"
                scorers={data.scorers}
                statKey="goals"
                statLabel="G"
                icon={<svg className="w-4 h-4 text-sport-soccer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M12 2 L14 8 L20 8 L15 12 L17 18 L12 14 L7 18 L9 12 L4 8 L10 8 Z" strokeWidth={1} /></svg>}
              />
            ) : (
              <LeaderList
                title="Top Assists"
                scorers={data.scorers}
                statKey="assists"
                statLabel="A"
                icon={<svg className="w-4 h-4 text-blue-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>}
              />
            )}
          </div>

          {/* Desktop: side by side */}
          <div className="hidden md:grid md:grid-cols-2 gap-4">
            <LeaderList
              title="Top Scorers"
              scorers={data.scorers}
              statKey="goals"
              statLabel="G"
              icon={<svg className="w-4 h-4 text-sport-soccer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M12 2 L14 8 L20 8 L15 12 L17 18 L12 14 L7 18 L9 12 L4 8 L10 8 Z" strokeWidth={1} /></svg>}
            />
            <LeaderList
              title="Top Assists"
              scorers={data.scorers}
              statKey="assists"
              statLabel="A"
              icon={<svg className="w-4 h-4 text-blue-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>}
            />
          </div>
        </>
      )}
    </div>
  );
}
