"use client";

import Image from "next/image";
import { Match } from "@/lib/types";
import { groupMatchesByLeague } from "@/lib/mock-data";
import { useFavorites } from "@/lib/favorites";
import MatchCard from "./MatchCard";

const LEAGUE_LOGOS: Record<string, string> = {
  "NBA": "https://a.espncdn.com/i/teamlogos/leagues/500/nba.png",
  "NBA (Demo)": "https://a.espncdn.com/i/teamlogos/leagues/500/nba.png",
  "NFL": "https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png",
  "NFL (Demo)": "https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png",
  "NHL": "https://a.espncdn.com/i/teamlogos/leagues/500/nhl.png",
  "NHL (Demo)": "https://a.espncdn.com/i/teamlogos/leagues/500/nhl.png",
  "MLB": "https://a.espncdn.com/i/teamlogos/leagues/500/mlb.png",
  "MLB (Demo)": "https://a.espncdn.com/i/teamlogos/leagues/500/mlb.png",
  // Soccer — football-data.org leagues
  "Premier League": "https://crests.football-data.org/PL.png",
  "La Liga": "https://crests.football-data.org/PD.png",
  "Bundesliga": "https://crests.football-data.org/BL1.png",
  "Serie A": "https://crests.football-data.org/SA.png",
  "Ligue 1": "https://crests.football-data.org/FL1.png",
  "UEFA Champions League": "https://crests.football-data.org/CL.png",
  "Championship": "https://crests.football-data.org/ELC.png",
  "Eredivisie": "https://crests.football-data.org/DED.png",
  "Primeira Liga": "https://crests.football-data.org/PPL.png",
  // Soccer — ESPN leagues
  "MLS": "https://a.espncdn.com/i/teamlogos/leagues/500/mls.png",
  "Liga MX": "https://a.espncdn.com/i/teamlogos/leagues/500/mex.1.png",
  "Scottish Premiership": "https://a.espncdn.com/i/teamlogos/leagues/500/sco.1.png",
  "Brasileirao Serie A": "https://a.espncdn.com/i/teamlogos/leagues/500/bra.1.png",
  "Saudi Pro League": "https://a.espncdn.com/i/teamlogos/leagues/500/sau.1.png",
};

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
      <div className="flex flex-col items-center py-10 gap-2">
        <Image
          src="/scorespark_white_transparent_bg.png"
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 object-contain opacity-15"
        />
        <p className="text-sm text-white/30">No matches found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-slide-up">
      {leagueOrder.map(([league, leagueMatches]) => (
        <div key={league}>
          <div className="flex items-center gap-1.5 mb-1.5">
            {LEAGUE_LOGOS[league] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={LEAGUE_LOGOS[league]}
                alt={league}
                width={14}
                height={14}
                className="w-3.5 h-3.5 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            )}
            <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">
              {league}
            </h3>
            {leagueMatches.some((m) => m.status === "live") && (
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-live-green/15 text-live-green rounded-full">
                LIVE
              </span>
            )}
          </div>
          <div className="space-y-1">
            {leagueMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
