"use client";

import { allTeams } from "@/lib/mock-data";
import { useFavorites } from "@/lib/favorites";
import type { Sport } from "@/lib/types";
import { useState } from "react";

const sportFilters: { label: string; value: Sport | "all"; emoji: string }[] = [
  { label: "All", value: "all", emoji: "" },
  { label: "Soccer", value: "soccer", emoji: "\u26BD" },
  { label: "NBA", value: "nba", emoji: "\uD83C\uDFC0" },
  { label: "NFL", value: "nfl", emoji: "\uD83C\uDFC8" },
  { label: "NHL", value: "nhl", emoji: "\uD83C\uDFD2" },
  { label: "MLB", value: "mlb", emoji: "\u26BE" },
];

export default function FavoritesView() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [sportFilter, setSportFilter] = useState<Sport | "all">("all");

  const filteredTeams =
    sportFilter === "all"
      ? allTeams
      : allTeams.filter((t) => t.sport === sportFilter);

  // Sort: favorites first
  const sortedTeams = [...filteredTeams].sort((a, b) => {
    const aFav = isFavorite(a.id) ? 0 : 1;
    const bFav = isFavorite(b.id) ? 0 : 1;
    if (aFav !== bFav) return aFav - bFav;
    return a.name.localeCompare(b.name);
  });

  const sportColor: Record<Sport, string> = {
    soccer: "ring-sport-soccer/30",
    nba: "ring-sport-nba/30",
    nfl: "ring-sport-nfl/30",
    nhl: "ring-sport-nhl/30",
    mlb: "ring-sport-mlb/30",
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white">Favorites</h1>
        <p className="text-sm text-white/40 mt-1">
          {favorites.length > 0
            ? `${favorites.length} team${favorites.length === 1 ? "" : "s"} followed`
            : "Tap teams to follow them"}
        </p>
      </div>

      {/* Sport filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {sportFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setSportFilter(filter.value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              sportFilter === filter.value
                ? "bg-white/10 text-white ring-1 ring-white/10"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
            }`}
          >
            {filter.emoji && <span>{filter.emoji}</span>}
            {filter.label}
          </button>
        ))}
      </div>

      {/* Team grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {sortedTeams.map((team) => {
          const fav = isFavorite(team.id);
          return (
            <button
              key={team.id}
              onClick={() => toggleFavorite(team.id)}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95 ${
                fav
                  ? `bg-gold-spark/10 border-gold-spark/30 ring-2 ring-gold-spark/20`
                  : `bg-card border-white/5 hover:border-white/10 ${sportColor[team.sport]}`
              }`}
            >
              {/* Favorite star */}
              {fav && (
                <div className="absolute top-1.5 right-1.5">
                  <svg
                    className="w-4 h-4 text-gold-spark"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </div>
              )}

              {/* Badge */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={team.badge}
                alt={team.shortName}
                width={40}
                height={40}
                className="w-10 h-10 rounded-lg"
              />

              {/* Name */}
              <span className="text-[11px] text-white/70 text-center leading-tight truncate w-full">
                {team.shortName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
