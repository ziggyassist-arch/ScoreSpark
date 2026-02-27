"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Match } from "@/lib/types";
import { LEAGUE_LOGOS, POPULAR_LEAGUES } from "./MatchList";

interface LeagueInfo {
  name: string;
  count: number;
  logo?: string;
}

interface LeagueFilterProps {
  matches: Match[];
  selected: string | null;
  onSelect: (league: string | null) => void;
}

export default function LeagueFilter({ matches, selected, onSelect }: LeagueFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const leagues = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of matches) {
      counts[m.league] = (counts[m.league] || 0) + 1;
    }

    const entries: LeagueInfo[] = Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      logo: LEAGUE_LOGOS[name],
    }));

    // Sort: popular leagues first (by priority), then alphabetical
    entries.sort((a, b) => {
      const aIdx = POPULAR_LEAGUES.indexOf(a.name);
      const bIdx = POPULAR_LEAGUES.indexOf(b.name);
      const aPopular = aIdx !== -1;
      const bPopular = bIdx !== -1;
      if (aPopular && bPopular) return aIdx - bIdx;
      if (aPopular) return -1;
      if (bPopular) return 1;
      return a.name.localeCompare(b.name);
    });

    return entries;
  }, [matches]);

  const updateFades = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftFade(el.scrollLeft > 4);
    setShowRightFade(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    updateFades();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateFades, { passive: true });
    window.addEventListener("resize", updateFades);
    return () => {
      el.removeEventListener("scroll", updateFades);
      window.removeEventListener("resize", updateFades);
    };
  }, [leagues]);

  // Scroll selected pill into view
  useEffect(() => {
    if (!selected || !scrollRef.current) return;
    const pill = scrollRef.current.querySelector(`[data-league="${CSS.escape(selected)}"]`) as HTMLElement;
    if (pill) {
      pill.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [selected]);

  if (leagues.length <= 1) return null;

  return (
    <div className="relative mb-2">
      {/* Left fade */}
      {showLeftFade && (
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-navy-dark to-transparent z-10 pointer-events-none" />
      )}
      {/* Right fade */}
      {showRightFade && (
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-navy-dark to-transparent z-10 pointer-events-none" />
      )}

      <div
        ref={scrollRef}
        className="flex gap-1.5 overflow-x-auto hide-scrollbar py-1"
      >
        {/* All pill */}
        <button
          onClick={() => onSelect(null)}
          className={`flex-none flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-200 ${
            selected === null
              ? "bg-gold-spark text-navy-dark"
              : "bg-white/8 text-white/50 hover:bg-white/12 hover:text-white/70"
          }`}
        >
          All
          <span className={`text-[9px] ${selected === null ? "text-navy-dark/60" : "text-white/30"}`}>
            {matches.length}
          </span>
        </button>

        {leagues.map((league) => (
          <button
            key={league.name}
            data-league={league.name}
            onClick={() => onSelect(selected === league.name ? null : league.name)}
            className={`flex-none flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-200 ${
              selected === league.name
                ? "bg-gold-spark text-navy-dark"
                : "bg-white/8 text-white/50 hover:bg-white/12 hover:text-white/70"
            }`}
          >
            {league.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={league.logo}
                alt=""
                width={14}
                height={14}
                className="w-3.5 h-3.5 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            )}
            <span className="whitespace-nowrap">{league.name}</span>
            <span className={`text-[9px] ${selected === league.name ? "text-navy-dark/60" : "text-white/30"}`}>
              {league.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
