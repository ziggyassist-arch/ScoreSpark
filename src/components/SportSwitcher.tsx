"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sports = [
  { label: "All", href: "/scores", emoji: "", color: "bg-white/10 text-white" },
  { label: "Soccer", href: "/scores/soccer", emoji: "\u26BD", color: "bg-sport-soccer/20 text-sport-soccer" },
  { label: "NBA", href: "/scores/nba", emoji: "\uD83C\uDFC0", color: "bg-sport-nba/20 text-sport-nba" },
  { label: "NFL", href: "/scores/nfl", emoji: "\uD83C\uDFC8", color: "bg-sport-nfl/20 text-sport-nfl" },
  { label: "NHL", href: "/scores/nhl", emoji: "\uD83C\uDFD2", color: "bg-sport-nhl/20 text-sport-nhl" },
  { label: "MLB", href: "/scores/mlb", emoji: "\u26BE", color: "bg-sport-mlb/20 text-sport-mlb" },
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
            {sport.emoji && <span className="text-base">{sport.emoji}</span>}
            {sport.label}
          </Link>
        );
      })}
    </div>
  );
}
