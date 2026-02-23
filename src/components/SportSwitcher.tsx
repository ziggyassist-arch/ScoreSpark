"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LEAGUE_LOGOS: Record<string, string> = {
  nba: "https://a.espncdn.com/i/teamlogos/leagues/500/nba.png",
  nfl: "https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png",
  nhl: "https://a.espncdn.com/i/teamlogos/leagues/500/nhl.png",
  mlb: "https://a.espncdn.com/i/teamlogos/leagues/500/mlb.png",
};

const sports = [
  { label: "All", href: "/scores", logo: "", color: "bg-white/10 text-white" },
  { label: "Soccer", href: "/scores/soccer", logo: "", emoji: "\u26BD", color: "bg-sport-soccer/20 text-sport-soccer" },
  { label: "NBA", href: "/scores/nba", logo: LEAGUE_LOGOS.nba, color: "bg-sport-nba/20 text-sport-nba" },
  { label: "NFL", href: "/scores/nfl", logo: LEAGUE_LOGOS.nfl, color: "bg-sport-nfl/20 text-sport-nfl" },
  { label: "NHL", href: "/scores/nhl", logo: LEAGUE_LOGOS.nhl, color: "bg-sport-nhl/20 text-sport-nhl" },
  { label: "MLB", href: "/scores/mlb", logo: LEAGUE_LOGOS.mlb, color: "bg-sport-mlb/20 text-sport-mlb" },
];

export default function SportSwitcher() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/scores") return pathname === "/scores";
    return pathname === href;
  };

  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
      {sports.map((sport) => {
        const active = isActive(sport.href);
        return (
          <Link
            key={sport.href}
            href={sport.href}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              active
                ? sport.color + " ring-1 ring-white/10"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
            }`}
          >
            {sport.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={sport.logo} alt={sport.label} width={18} height={18} className="w-[18px] h-[18px] object-contain" />
            ) : sport.emoji ? (
              <span className="text-base">{sport.emoji}</span>
            ) : null}
            {sport.label}
          </Link>
        );
      })}
    </div>
  );
}
