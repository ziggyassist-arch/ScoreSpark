"use client";

import { Match } from "@/lib/types";
import { groupMatchesByLeague } from "@/lib/mock-data";
import { useFavorites } from "@/lib/favorites";
import MatchCard from "./MatchCard";

function sortMatches(matches: Match[], favorites: string[]): Match[] {
  const statusOrder: Record<string, number> = { live: 0, upcoming: 1, finished: 2 };
  return [...matches].sort((a, b) => {
    // Favorite teams first
    const aFav =
      favorites.includes(a.homeTeam.id) || favorites.includes(a.awayTeam.id)
        ? 0
        : 1;
    const bFav =
      favorites.includes(b.homeTeam.id) || favorites.includes(b.awayTeam.id)
        ? 0
        : 1;
    if (aFav !== bFav) return aFav - bFav;
    // Then by status
    return statusOrder[a.status] - statusOrder[b.status];
  });
}

export default function MatchList({ matches }: { matches: Match[] }) {
  const { favorites } = useFavorites();
  const sorted = sortMatches(matches, favorites);
  const grouped = groupMatchesByLeague(sorted);

  // Order leagues: live matches first
  const leagueOrder = Object.entries(grouped).sort(([, aMatches], [, bMatches]) => {
    const aHasLive = aMatches.some((m) => m.status === "live") ? 0 : 1;
    const bHasLive = bMatches.some((m) => m.status === "live") ? 0 : 1;
    return aHasLive - bHasLive;
  });

  if (matches.length === 0) {
    return (
      <div className="text-center py-16 text-white/30">
        <p className="text-lg">No matches found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {leagueOrder.map(([league, leagueMatches]) => (
        <div key={league}>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              {league}
            </h3>
            {leagueMatches.some((m) => m.status === "live") && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-live-green/15 text-live-green rounded-full">
                LIVE
              </span>
            )}
          </div>
          <div className="space-y-2">
            {leagueMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
