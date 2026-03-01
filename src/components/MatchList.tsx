"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Match } from "@/lib/types";
import { groupMatchesByLeague } from "@/lib/mock-data";
import { useFavorites } from "@/lib/favorites";
import MatchRow from "./MatchRow";

const LEAGUE_URLS: Record<string, string> = {
  "Premier League": "/league/epl",
  "LaLiga": "/league/laliga",
  "Bundesliga": "/league/bundesliga",
  "Serie A": "/league/serie-a",
  "Ligue 1": "/league/ligue-1",
  "MLS": "/league/mls",
  "Liga MX": "/league/liga-mx",
  "Champions League": "/league/champions-league",
  "Europa League": "/league/europa-league",
};

export const LEAGUE_LOGOS: Record<string, string> = {
  "NBA": "https://a.espncdn.com/i/teamlogos/leagues/500/nba.png",
  "NBA (Demo)": "https://a.espncdn.com/i/teamlogos/leagues/500/nba.png",
  "NFL": "https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png",
  "NFL (Demo)": "https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png",
  "NHL": "https://a.espncdn.com/i/teamlogos/leagues/500/nhl.png",
  "NHL (Demo)": "https://a.espncdn.com/i/teamlogos/leagues/500/nhl.png",
  "MLB": "https://a.espncdn.com/i/teamlogos/leagues/500/mlb.png",
  "MLB (Demo)": "https://a.espncdn.com/i/teamlogos/leagues/500/mlb.png",
  "Premier League": "https://crests.football-data.org/PL.png",
  "La Liga": "https://crests.football-data.org/PD.png",
  "Bundesliga": "https://crests.football-data.org/BL1.png",
  "Serie A": "https://crests.football-data.org/SA.png",
  "Ligue 1": "https://crests.football-data.org/FL1.png",
  "UEFA Champions League": "https://crests.football-data.org/CL.png",
  "Championship": "https://crests.football-data.org/ELC.png",
  "Eredivisie": "https://crests.football-data.org/DED.png",
  "Primeira Liga": "https://crests.football-data.org/PPL.png",
  "MLS": "https://a.espncdn.com/i/teamlogos/leagues/500/mls.png",
  "Liga MX": "https://a.espncdn.com/i/teamlogos/leagues/500/mex.1.png",
  "Scottish Premiership": "https://a.espncdn.com/i/teamlogos/leagues/500/sco.1.png",
  "Brasileirao Serie A": "https://a.espncdn.com/i/teamlogos/leagues/500/bra.1.png",
  "Saudi Pro League": "https://a.espncdn.com/i/teamlogos/leagues/500/sau.1.png",
};

const LEAGUE_COUNTRY: Record<string, string> = {
  "Premier League": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "La Liga": "🇪🇸",
  "Bundesliga": "🇩🇪",
  "Serie A": "🇮🇹",
  "Ligue 1": "🇫🇷",
  "Championship": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Eredivisie": "🇳🇱",
  "Primeira Liga": "🇵🇹",
  "MLS": "🇺🇸",
  "Liga MX": "🇲🇽",
  "Scottish Premiership": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "Brasileirao Serie A": "🇧🇷",
  "Saudi Pro League": "🇸🇦",
  "UEFA Champions League": "🏆",
  "NBA": "🇺🇸",
  "NFL": "🇺🇸",
  "NHL": "🇺🇸",
  "MLB": "🇺🇸",
};

export const POPULAR_LEAGUES = [
  'UEFA Champions League', 'Premier League', 'La Liga', 'Bundesliga',
  'Serie A', 'Ligue 1', 'MLS', 'Championship', 'UEFA Europa League',
  'Copa Libertadores', 'Liga MX', 'NBA', 'NFL', 'NHL', 'MLB',
];

function sortMatches(matches: Match[], favorites: string[]): Match[] {
  const statusOrder: Record<string, number> = { live: 0, upcoming: 1, finished: 2 };
  return [...matches].sort((a, b) => {
    const aFav = favorites.includes(a.homeTeam.id) || favorites.includes(a.awayTeam.id) ? 0 : 1;
    const bFav = favorites.includes(b.homeTeam.id) || favorites.includes(b.awayTeam.id) ? 0 : 1;
    if (aFav !== bFav) return aFav - bFav;
    return statusOrder[a.status] - statusOrder[b.status];
  });
}

function LeagueSection({ league, matches }: { league: string; matches: Match[] }) {
  const [collapsed, setCollapsed] = useState(false);
  const hasLive = matches.some(m => m.status === "live");
  const logo = LEAGUE_LOGOS[league];
  const flag = LEAGUE_COUNTRY[league] || "";

  return (
    <div className="bg-surface rounded-lg overflow-hidden border border-white/[0.04]">
      {/* League header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center gap-2 px-2.5 py-2 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
      >
        {logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt={league}
            width={16}
            height={16}
            className="w-4 h-4 object-contain flex-shrink-0"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
        {flag && <span className="text-xs">{flag}</span>}
        {LEAGUE_URLS[league] ? (
          <Link
            href={LEAGUE_URLS[league]}
            onClick={(e) => e.stopPropagation()}
            className="text-[11px] font-semibold text-white/50 uppercase tracking-wider flex-1 text-left hover:text-white/70 transition-colors"
          >
            {league}
          </Link>
        ) : (
          <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider flex-1 text-left">
            {league}
          </span>
        )}
        {hasLive && (
          <span className="px-1.5 py-0.5 text-[8px] font-bold bg-live-green/15 text-live-green rounded-full">
            LIVE
          </span>
        )}
        <span className="text-[10px] text-white/20 tabular-nums">{matches.length}</span>
        <svg
          className={`w-3 h-3 text-white/20 transition-transform ${collapsed ? "-rotate-90" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Match rows */}
      {!collapsed && (
        <div>
          {matches.map(match => (
            <MatchRow key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MatchList({ matches }: { matches: Match[] }) {
  const { favorites } = useFavorites();
  const sorted = sortMatches(matches, favorites);
  const grouped = groupMatchesByLeague(sorted);

  const leagueOrder = Object.entries(grouped).sort(([aLeague, aMatches], [bLeague, bMatches]) => {
    const aHasLive = aMatches.some(m => m.status === "live") ? 0 : 1;
    const bHasLive = bMatches.some(m => m.status === "live") ? 0 : 1;
    if (aHasLive !== bHasLive) return aHasLive - bHasLive;

    const aPriority = POPULAR_LEAGUES.indexOf(aLeague);
    const bPriority = POPULAR_LEAGUES.indexOf(bLeague);
    if (aPriority !== -1 && bPriority !== -1) return aPriority - bPriority;
    if (aPriority !== -1) return -1;
    if (bPriority !== -1) return 1;
    return aLeague.localeCompare(bLeague);
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
    <div className="space-y-2 animate-slide-up">
      {leagueOrder.map(([league, leagueMatches]) => (
        <LeagueSection key={league} league={league} matches={leagueMatches} />
      ))}
    </div>
  );
}
