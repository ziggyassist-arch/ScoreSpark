"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import type { ESPNLeaderCategoryV3, ESPNLeaderEntry } from "@/lib/api/types/espn";

/** Fantasy-relevant category definitions per sport */
const FANTASY_CATEGORIES: Record<string, string[]> = {
  nfl: [
    "passingYards", "passingTouchdowns", "rushingYards", "rushingTouchdowns",
    "receivingYards", "receivingTouchdowns", "receptions", "interceptions",
    "sacks", "fumbleRecoveries",
  ],
  nba: [
    "points", "rebounds", "assists", "steals", "blocks",
    "threePointFieldGoalsMade", "doubleDoubles", "tripleDoubles",
    "fieldGoalPct", "freeThrowPct",
  ],
  nhl: [
    "goals", "assists", "points", "plusMinus", "powerPlayGoals",
    "saves", "savePct", "goalsAgainstAverage", "shutouts", "wins",
  ],
  mlb: [
    "homeRuns", "RBIs", "battingAverage", "stolenBases", "hits",
    "wins", "ERA", "strikeouts", "saves", "WHIP",
  ],
};

/** Position groups for fantasy filtering */
const POSITION_FILTERS: Record<string, { label: string; positions: string[] }[]> = {
  nfl: [
    { label: "All", positions: [] },
    { label: "QB", positions: ["QB"] },
    { label: "RB", positions: ["RB"] },
    { label: "WR", positions: ["WR"] },
    { label: "TE", positions: ["TE"] },
    { label: "K", positions: ["K", "PK"] },
    { label: "DEF", positions: ["LB", "CB", "S", "DE", "DT", "SS", "FS"] },
  ],
  nba: [
    { label: "All", positions: [] },
    { label: "PG", positions: ["PG"] },
    { label: "SG", positions: ["SG"] },
    { label: "SF", positions: ["SF"] },
    { label: "PF", positions: ["PF"] },
    { label: "C", positions: ["C"] },
  ],
  nhl: [
    { label: "All", positions: [] },
    { label: "C", positions: ["C"] },
    { label: "W", positions: ["LW", "RW", "W"] },
    { label: "D", positions: ["D"] },
    { label: "G", positions: ["G"] },
  ],
  mlb: [
    { label: "All", positions: [] },
    { label: "P", positions: ["SP", "RP", "P"] },
    { label: "C", positions: ["C"] },
    { label: "IF", positions: ["1B", "2B", "3B", "SS"] },
    { label: "OF", positions: ["LF", "CF", "RF", "OF"] },
    { label: "DH", positions: ["DH"] },
  ],
};

/** Estimate fantasy points per sport based on stat name and value */
function estimateFantasyPoints(sport: string, leaders: ESPNLeaderEntry[], catName: string): Map<string, number> {
  const points = new Map<string, number>();

  for (const leader of leaders) {
    const id = leader.athlete?.id;
    if (!id) continue;
    const val = leader.value;
    let pts = 0;

    if (sport === "nfl") {
      switch (catName) {
        case "passingYards": pts = val * 0.04; break;
        case "passingTouchdowns": pts = val * 4; break;
        case "rushingYards": pts = val * 0.1; break;
        case "rushingTouchdowns": pts = val * 6; break;
        case "receivingYards": pts = val * 0.1; break;
        case "receivingTouchdowns": pts = val * 6; break;
        case "receptions": pts = val * 0.5; break; // half PPR
        case "interceptions": pts = val * -2; break;
        default: pts = val;
      }
    } else if (sport === "nba") {
      switch (catName) {
        case "points": pts = val * 1; break;
        case "rebounds": pts = val * 1.2; break;
        case "assists": pts = val * 1.5; break;
        case "steals": pts = val * 3; break;
        case "blocks": pts = val * 3; break;
        case "threePointFieldGoalsMade": pts = val * 0.5; break;
        default: pts = val;
      }
    } else if (sport === "nhl") {
      switch (catName) {
        case "goals": pts = val * 3; break;
        case "assists": pts = val * 2; break;
        case "points": pts = val * 1; break;
        case "plusMinus": pts = val * 0.5; break;
        case "powerPlayGoals": pts = val * 1; break;
        case "saves": pts = val * 0.2; break;
        case "wins": pts = val * 4; break;
        case "shutouts": pts = val * 3; break;
        default: pts = val;
      }
    } else {
      pts = val;
    }

    points.set(id, (points.get(id) ?? 0) + pts);
  }

  return points;
}

interface LeadersData {
  categories: ESPNLeaderCategoryV3[];
}

export default function FantasyStatsPage() {
  const { sport } = useParams<{ sport: string }>();
  const [data, setData] = useState<LeadersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const [activePosition, setActivePosition] = useState(0);

  useEffect(() => {
    if (sport === "soccer") return;
    setLoading(true);
    setError(null);
    fetch(`/api/v1/leaders?sport=${sport}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((d) => {
        setData(d);
        setActiveCategory(0);
        setActivePosition(0);
      })
      .catch(() => setError("Failed to load fantasy stats"))
      .finally(() => setLoading(false));
  }, [sport]);

  if (sport === "soccer") {
    return (
      <div className="py-16 text-center">
        <p className="text-white/30">Fantasy stats are available for NFL, NBA, NHL, and MLB</p>
      </div>
    );
  }

  // Filter to fantasy-relevant categories and sort them by priority
  const fantasyPriority = FANTASY_CATEGORIES[sport] ?? [];
  const allCategories = data?.categories ?? [];
  const sortedCategories = [...allCategories].sort((a, b) => {
    const aIdx = fantasyPriority.indexOf(a.name);
    const bIdx = fantasyPriority.indexOf(b.name);
    if (aIdx === -1 && bIdx === -1) return 0;
    if (aIdx === -1) return 1;
    if (bIdx === -1) return -1;
    return aIdx - bIdx;
  });

  const currentCategory = sortedCategories[activeCategory];
  const positionFilters = POSITION_FILTERS[sport] ?? [];
  const currentFilter = positionFilters[activePosition];

  // Filter leaders by position
  const filteredLeaders = currentCategory?.leaders?.filter((leader) => {
    if (!currentFilter || currentFilter.positions.length === 0) return true;
    const pos = leader.athlete?.position?.abbreviation;
    return pos && currentFilter.positions.includes(pos);
  }) ?? [];

  // Calculate fantasy point estimates for the current category
  const fantasyPointsMap = currentCategory
    ? estimateFantasyPoints(sport, currentCategory.leaders ?? [], currentCategory.name)
    : new Map<string, number>();

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl font-bold text-white">Fantasy Stats</h1>
        <span className="px-2 py-0.5 bg-gold-spark/15 text-gold-spark text-[10px] font-bold rounded-full uppercase tracking-wider">
          Beta
        </span>
      </div>

      {/* Scoring format note */}
      <div className="bg-white/[0.03] rounded-lg px-3 py-2 mb-4 border border-white/5">
        <p className="text-[11px] text-white/30">
          {sport === "nfl" && "Half-PPR scoring: Pass 0.04/yd, Rush/Rec 0.1/yd, Pass TD 4pts, Rush/Rec TD 6pts, Rec 0.5pts"}
          {sport === "nba" && "Standard scoring: PTS 1, REB 1.2, AST 1.5, STL/BLK 3, 3PM 0.5"}
          {sport === "nhl" && "Standard scoring: G 3pts, A 2pts, +/- 0.5, SV 0.2, W 4pts, SO 3pts"}
          {sport === "mlb" && "Standard season totals"}
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <Image src="/scorespark_white_transparent_bg.png" alt="" width={40} height={40} className="h-10 w-10 object-contain animate-pulse-glow opacity-40" />
        </div>
      )}

      {error && <p className="text-red-400 text-sm text-center py-8">{error}</p>}

      {!loading && sortedCategories.length > 0 && (
        <>
          {/* Position filter */}
          {positionFilters.length > 1 && (
            <div className="flex gap-1 mb-3 overflow-x-auto hide-scrollbar pb-1">
              {positionFilters.map((filter, i) => (
                <button
                  key={filter.label}
                  onClick={() => setActivePosition(i)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activePosition === i
                      ? "bg-gold-spark/15 text-gold-spark ring-1 ring-gold-spark/30"
                      : "text-white/30 hover:text-white/50 hover:bg-white/5"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          )}

          {/* Category selector */}
          <div className="flex gap-1.5 overflow-x-auto hide-scrollbar mb-5 pb-1">
            {sortedCategories.map((cat, i) => {
              const isFantasyKey = fantasyPriority.includes(cat.name);
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(i)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === i
                      ? "bg-white/10 text-white ring-1 ring-white/10"
                      : isFantasyKey
                        ? "text-gold-spark/50 hover:text-gold-spark/70 hover:bg-gold-spark/5"
                        : "text-white/30 hover:text-white/50 hover:bg-white/5"
                  }`}
                >
                  {cat.shortDisplayName || cat.abbreviation}
                </button>
              );
            })}
          </div>

          {/* Leaders list */}
          {currentCategory && (
            <div className="bg-card rounded-xl border border-white/5 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <span className="text-sm font-semibold text-white/60">{currentCategory.displayName}</span>
                {fantasyPriority.includes(currentCategory.name) && (
                  <span className="text-[10px] text-gold-spark/50 font-medium">Est. FPTS</span>
                )}
              </div>

              {filteredLeaders.length === 0 && (
                <div className="px-4 py-8 text-center text-white/30 text-sm">
                  No players found for this position filter
                </div>
              )}

              {filteredLeaders.slice(0, 25).map((leader, i) => {
                const fpts = fantasyPointsMap.get(leader.athlete?.id ?? "");
                return (
                  <div
                    key={`${leader.athlete?.id ?? i}-${i}`}
                    className={`flex items-center gap-3 px-4 py-3 ${
                      i < 3 ? "bg-gold-spark/5" : ""
                    } ${i !== Math.min(24, filteredLeaders.length - 1) ? "border-b border-white/5" : ""}`}
                  >
                    <span className={`w-6 text-center text-sm font-bold flex-shrink-0 ${i < 3 ? "text-gold-spark" : "text-white/30"}`}>
                      {i + 1}
                    </span>
                    {leader.athlete?.headshot ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={leader.athlete.headshot} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white/90 truncate">{leader.athlete?.displayName ?? "Unknown"}</p>
                      <div className="flex items-center gap-2">
                        {leader.team?.logos?.[0]?.href && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={leader.team.logos[0].href} alt="" className="w-3.5 h-3.5 object-contain" />
                        )}
                        <span className="text-[10px] text-white/30">{leader.team?.abbreviation ?? ""}</span>
                        {leader.athlete?.position && (
                          <span className="text-[10px] text-gold-spark/40 font-medium">{leader.athlete.position.abbreviation}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-lg font-bold text-white tabular-nums">{leader.displayValue}</span>
                      {fpts !== undefined && fantasyPriority.includes(currentCategory.name) && (
                        <span className="text-xs text-gold-spark/60 tabular-nums w-14 text-right font-medium">
                          {fpts.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
