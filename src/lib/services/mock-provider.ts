/**
 * Mock data provider — drop-in replacement for real services when USE_MOCK=true.
 * Each function returns data shaped exactly like the real service/API would.
 */
import type { Sport, Match, Lineup } from "../types";
import {
  allMockTeams,
  teamById,
  getTeamsForSport as getTeamsBySport,
  type MockTeamData,
} from "../mock-data/teams";
import {
  getMatchesForSport as getMatchesForSportRaw,
  allMockMatches,
  getMatchById,
} from "../mock-data/matches";
import { getStandingsForLeague as getStandingsByLeague } from "../mock-data/standings";
import { getPlayerProfile as getPlayerById } from "../mock-data/players";
import { getNewsForSport as getNewsBySport } from "../mock-data/news";
import { getInjuriesForSport as getInjuriesBySport } from "../mock-data/injuries";
import {
  getLeadersForSport as getLeadersBySport,
  mockSoccerScorers,
} from "../mock-data/leaders";
import type { ESPNInjuryResponse, ESPNLeadersResponse, ESPNPowerIndexResponse } from "../api/types/espn";

// ═══════════════════════════════════════════════════════════════
// Helper
// ═══════════════════════════════════════════════════════════════

export function isMockMode(): boolean {
  return process.env.USE_MOCK === "true";
}

// ═══════════════════════════════════════════════════════════════
// MATCHES — mirrors match-service.ts
// ═══════════════════════════════════════════════════════════════

export async function getMatchesForSport(
  sport: Sport,
  _date?: string
): Promise<Match[]> {
  return getMatchesForSportRaw(sport);
}

export async function getAllMatches(_date?: string): Promise<Match[]> {
  return allMockMatches;
}

export async function getMatchDetailById(
  id: string
): Promise<{ match: Match; lineups: { home: Lineup; away: Lineup } | null } | null> {
  const match = getMatchById(id);
  if (!match) return null;

  // Build mock lineups from team rosters
  const homeData = teamById[match.homeTeam.id];
  const awayData = teamById[match.awayTeam.id];

  let lineups: { home: Lineup; away: Lineup } | null = null;
  if (homeData && awayData) {
    lineups = {
      home: buildLineup(homeData, match.sport),
      away: buildLineup(awayData, match.sport),
    };
  }

  return { match, lineups };
}

function buildLineup(teamData: MockTeamData, sport: Sport): Lineup {
  const squad = teamData.squad;
  const starters = squad.slice(0, sport === "soccer" ? 11 : 5).map((p) => ({
    number: p.shirtNumber ?? 0,
    name: p.name,
    position: p.position,
  }));
  const substitutes = squad.slice(sport === "soccer" ? 11 : 5).map((p) => ({
    number: p.shirtNumber ?? 0,
    name: p.name,
    position: p.position,
  }));

  const formation = sport === "soccer" ? "4-3-3" : "";
  return { formation, starters, substitutes };
}

// ═══════════════════════════════════════════════════════════════
// TEAMS — mirrors team-service.ts
// ═══════════════════════════════════════════════════════════════

export interface TeamListItem {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  sport: Sport;
}

export interface TeamDetail {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  sport: Sport;
  venue?: string;
  coach?: string;
  founded?: number;
  colors?: string;
  competitions: string[];
  squad: {
    id: string;
    name: string;
    position: string;
    shirtNumber: number | null;
    nationality?: string;
    dateOfBirth?: string;
  }[];
}

export async function getTeamsForSport(sport: Sport): Promise<TeamListItem[]> {
  return getTeamsBySport(sport).map((t) => t.team);
}

export async function getSoccerTeamsForCompetition(
  _code: string
): Promise<TeamListItem[]> {
  return getTeamsBySport("soccer").map((t) => t.team);
}

export async function getTeamDetail(
  teamId: string
): Promise<TeamDetail | null> {
  const data = teamById[teamId];
  if (!data) return null;

  const sportLeagues: Record<Sport, string[]> = {
    soccer: ["Premier League"],
    nba: ["NBA"],
    nfl: ["NFL"],
    nhl: ["NHL"],
    mlb: ["MLB"],
  };

  return {
    id: data.team.id,
    name: data.team.name,
    shortName: data.team.shortName,
    badge: data.team.badge,
    sport: data.team.sport,
    venue: data.venue,
    coach: data.coach,
    founded: data.founded,
    competitions: sportLeagues[data.team.sport],
    squad: data.squad.map((p) => ({
      id: p.id,
      name: p.name,
      position: p.position,
      shirtNumber: p.shirtNumber,
      nationality: p.nationality,
    })),
  };
}

export async function getTeamMatches(
  teamId: string
): Promise<
  {
    id: string;
    homeTeam: { id: string; name: string; shortName: string; badge: string; sport: Sport };
    awayTeam: { id: string; name: string; shortName: string; badge: string; sport: Sport };
    homeScore: number | null;
    awayScore: number | null;
    status: string;
    date: string;
    competition: string;
  }[]
> {
  return allMockMatches
    .filter(
      (m) => m.homeTeam.id === teamId || m.awayTeam.id === teamId
    )
    .slice(0, 10)
    .map((m) => ({
      id: m.id,
      homeTeam: {
        id: m.homeTeam.id,
        name: m.homeTeam.name,
        shortName: m.homeTeam.shortName,
        badge: m.homeTeam.badge,
        sport: m.sport,
      },
      awayTeam: {
        id: m.awayTeam.id,
        name: m.awayTeam.name,
        shortName: m.awayTeam.shortName,
        badge: m.awayTeam.badge,
        sport: m.sport,
      },
      homeScore: m.homeScore,
      awayScore: m.awayScore,
      status: m.status,
      date: m.startTime,
      competition: m.league,
    }));
}

// ═══════════════════════════════════════════════════════════════
// STANDINGS — mirrors standings-service.ts
// ═══════════════════════════════════════════════════════════════

export async function getStandingsForLeague(leagueId: string) {
  return getStandingsByLeague(leagueId);
}

// ═══════════════════════════════════════════════════════════════
// PLAYERS — mirrors player-service.ts
// ═══════════════════════════════════════════════════════════════

export async function getPlayerProfile(playerId: string) {
  return getPlayerById(playerId);
}

// ═══════════════════════════════════════════════════════════════
// NEWS — mirrors news-service.ts
// ═══════════════════════════════════════════════════════════════

export async function getNewsForSport(sport: Sport) {
  return getNewsBySport(sport);
}

// ═══════════════════════════════════════════════════════════════
// INJURIES — returns ESPNInjuryResponse shape
// ═══════════════════════════════════════════════════════════════

export async function getInjuries(
  sport: "nba" | "nfl" | "nhl" | "mlb"
): Promise<ESPNInjuryResponse> {
  const injuries = getInjuriesBySport(sport);

  // Group by team
  const byTeam = new Map<string, typeof injuries>();
  for (const inj of injuries) {
    const existing = byTeam.get(inj.teamName) ?? [];
    existing.push(inj);
    byTeam.set(inj.teamName, existing);
  }

  return {
    injuries: Array.from(byTeam.entries()).map(([teamName, teamInjuries]) => ({
      id: teamInjuries[0].teamId,
      displayName: teamName,
      injuries: teamInjuries.map((inj) => ({
        id: inj.id,
        athlete: {
          firstName: inj.playerName.split(" ")[0],
          lastName: inj.playerName.split(" ").slice(1).join(" "),
          displayName: inj.playerName,
          shortName: `${inj.playerName.split(" ")[0][0]}. ${inj.playerName.split(" ").slice(1).join(" ")}`,
          position: { abbreviation: inj.position.substring(0, 3).toUpperCase() },
        },
        status: inj.status,
        type: inj.injury,
        date: "2026-02-27T00:00:00Z",
        details: {
          type: inj.injury,
          location: inj.injury,
          returnDate: inj.returnDate,
        },
        shortComment: inj.injury,
        longComment: `${inj.playerName} is ${inj.status.toLowerCase()} with ${inj.injury.toLowerCase()}.`,
      })),
    })),
  };
}

// ═══════════════════════════════════════════════════════════════
// LEADERS — returns ESPNLeadersResponse shape
// ═══════════════════════════════════════════════════════════════

export async function getLeaders(
  sport: "nba" | "nfl" | "nhl" | "mlb"
): Promise<ESPNLeadersResponse> {
  const data = getLeadersBySport(sport);
  if (!data) return { categories: [] };

  return {
    categories: data.categories.map((cat) => ({
      name: cat.name,
      displayName: cat.name,
      shortDisplayName: cat.abbreviation,
      abbreviation: cat.abbreviation,
      leaders: cat.entries.map((e) => ({
        displayValue: e.displayValue,
        value: parseFloat(e.value) || 0,
        athlete: {
          id: `mock-${sport}-leader-${e.rank}`,
          firstName: e.playerName.split(" ")[0],
          lastName: e.playerName.split(" ").slice(1).join(" "),
          displayName: e.playerName,
          shortName: `${e.playerName.split(" ")[0][0]}. ${e.playerName.split(" ").slice(1).join(" ")}`,
        },
        team: {
          id: e.teamId,
          name: e.teamName,
          abbreviation: e.teamName.substring(0, 3).toUpperCase(),
          displayName: e.teamName,
        },
      })),
    })),
  };
}

// ═══════════════════════════════════════════════════════════════
// RANKINGS — returns ESPNPowerIndexResponse shape
// ═══════════════════════════════════════════════════════════════

export async function getPowerIndex(
  sport: "nba" | "nfl" | "nhl" | "mlb"
): Promise<ESPNPowerIndexResponse> {
  const teams = getTeamsBySport(sport);

  return {
    teams: teams.map((t, i) => ({
      id: t.team.id,
      name: t.team.shortName,
      displayName: t.team.name,
      abbreviation: t.team.shortName,
      logos: [{ href: t.team.badge }],
      categories: [
        {
          name: sport === "nfl" ? "fpi" : sport === "nba" ? "bpi" : "powerIndex",
          values: {
            [sport === "nfl" ? "fpi" : sport === "nba" ? "bpi" : "wins"]:
              25 - i * 3 + Math.random() * 2,
            wins: 35 - i * 3,
            losses: 15 + i * 2,
            playoffPct: 95 - i * 10,
          },
        },
      ],
    })),
  };
}

// ═══════════════════════════════════════════════════════════════
// SCORERS — returns FDScorersResponse shape
// ═══════════════════════════════════════════════════════════════

export async function getTopScorers(_competition: string) {
  return {
    count: mockSoccerScorers.length,
    competition: {
      id: 2021,
      name: "Premier League",
      code: "PL",
      emblem: "https://crests.football-data.org/PL.png",
    },
    season: {
      id: 2025,
      startDate: "2025-08-01",
      endDate: "2026-05-30",
      currentMatchday: 27,
    },
    scorers: mockSoccerScorers.map((s) => ({
      player: {
        id: parseInt(s.teamId.replace("mock-soccer-", "")) * 100 + s.rank,
        name: s.playerName,
        firstName: s.playerName.split(" ")[0],
        lastName: s.playerName.split(" ").slice(1).join(" "),
        dateOfBirth: null,
        nationality: null,
        position: null,
      },
      team: {
        id: parseInt(s.teamId.replace("mock-soccer-", "")) * 100,
        name: s.teamName,
        shortName: s.teamName.substring(0, 3).toUpperCase(),
        crest: teamById[s.teamId]?.team.badge ?? `https://placehold.co/64x64/1E1B3A/7EB6E6?text=${s.teamName.substring(0, 3).toUpperCase()}`,
      },
      playedMatches: s.playedMatches,
      goals: s.goals,
      assists: s.assists,
      penalties: null,
    })),
  };
}

// ═══════════════════════════════════════════════════════════════
// SEARCH — mirrors search route logic
// ═══════════════════════════════════════════════════════════════

const LEAGUES_SEARCHABLE = [
  { id: "epl", name: "Premier League", sport: "soccer", href: "/standings/epl" },
  { id: "laliga", name: "La Liga", sport: "soccer", href: "/standings/laliga" },
  { id: "bundesliga", name: "Bundesliga", sport: "soccer", href: "/standings/bundesliga" },
  { id: "seriea", name: "Serie A", sport: "soccer", href: "/standings/seriea" },
  { id: "ligue1", name: "Ligue 1", sport: "soccer", href: "/standings/ligue1" },
  { id: "nba", name: "NBA", sport: "nba", href: "/scores/nba" },
  { id: "nfl", name: "NFL", sport: "nfl", href: "/scores/nfl" },
  { id: "nhl", name: "NHL", sport: "nhl", href: "/scores/nhl" },
  { id: "mlb", name: "MLB", sport: "mlb", href: "/scores/mlb" },
];

export async function search(q: string) {
  const query = q.trim().toLowerCase();
  if (query.length < 2) return { results: [] };

  const allTeams = allMockTeams.map((t) => t.team);

  const matchedTeams = allTeams
    .filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.shortName.toLowerCase().includes(query)
    )
    .slice(0, 8)
    .map((t) => ({
      type: "team" as const,
      id: t.id,
      name: t.name,
      shortName: t.shortName,
      badge: t.badge,
      sport: t.sport,
      href: `/team/${t.id}`,
    }));

  const matchedLeagues = LEAGUES_SEARCHABLE.filter(
    (l) =>
      l.name.toLowerCase().includes(query) ||
      l.id.toLowerCase().includes(query)
  )
    .slice(0, 4)
    .map((l) => ({
      type: "league" as const,
      id: l.id,
      name: l.name,
      sport: l.sport,
      href: l.href,
    }));

  // Search players across all teams
  const matchedPlayers: { type: "player"; id: string; name: string; team: string; teamBadge: string; sport: string; href: string }[] = [];
  for (const td of allMockTeams) {
    for (const p of td.squad) {
      if (p.name.toLowerCase().includes(query)) {
        matchedPlayers.push({
          type: "player",
          id: p.id,
          name: p.name,
          team: td.team.name,
          teamBadge: td.team.badge,
          sport: td.team.sport,
          href: `/player/${p.id}`,
        });
        if (matchedPlayers.length >= 5) break;
      }
    }
    if (matchedPlayers.length >= 5) break;
  }

  return { results: [...matchedLeagues, ...matchedTeams, ...matchedPlayers] };
}

// ═══════════════════════════════════════════════════════════════
// TRANSFERS — returns mock transfer items
// ═══════════════════════════════════════════════════════════════

export async function getTransferNews() {
  return [
    {
      id: "mock-transfer-1",
      title: "Arsenal agree fee for top midfielder target",
      description: "Arsenal have reportedly agreed a fee in the region of £60m for their midfield target.",
      link: "https://example.com/arsenal-transfer",
      pubDate: "2026-02-27T10:00:00Z",
      source: "BBC Sport",
      category: "rumor" as const,
    },
    {
      id: "mock-transfer-2",
      title: "Chelsea complete signing of promising Brazilian forward",
      description: "Chelsea have confirmed the signing on a five-year deal.",
      link: "https://example.com/chelsea-signing",
      pubDate: "2026-02-26T14:00:00Z",
      source: "Sky Sports",
      category: "done-deal" as const,
    },
    {
      id: "mock-transfer-3",
      title: "Liverpool interested in Serie A defender",
      description: "Liverpool are monitoring the situation of the Italian international.",
      link: "https://example.com/liverpool-defender",
      pubDate: "2026-02-25T08:00:00Z",
      source: "The Guardian",
      category: "rumor" as const,
    },
  ];
}
