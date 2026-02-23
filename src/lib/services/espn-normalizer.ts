/**
 * Normalizes ESPN API responses into ScoreSpark unified types
 * Handles NFL, NBA, NHL, and MLB
 */

import type {
  ESPNEvent,
  ESPNCompetitor,
  ESPNStatus,
  ESPNStandingsEntry,
} from "@/lib/api/types/espn";
import type {
  Match,
  Team,
  Sport,
  MatchStatus,
  MatchClock,
  NBAStandingRow,
  NHLStandingRow,
} from "@/lib/types";

/** Map ESPN status state to ScoreSpark status */
function normalizeStatus(status: ESPNStatus): MatchStatus {
  switch (status.type.state) {
    case "in":
      return "live";
    case "pre":
      return "upcoming";
    case "post":
      return "finished";
    default:
      return "upcoming";
  }
}

/** Build sport-aware clock display */
function normalizeClock(status: ESPNStatus, sport: Sport): MatchClock {
  const state = status.type.state;

  if (state === "pre") {
    return { displayValue: status.type.shortDetail };
  }

  if (state === "post") {
    return { displayValue: "Final" };
  }

  // Live game
  const period = status.period;
  const clock = status.displayClock;

  switch (sport) {
    case "nfl":
      return {
        value: period,
        displayValue: `Q${period} ${clock}`,
      };
    case "nba":
      return {
        value: period,
        displayValue: `Q${period} ${clock}`,
      };
    case "nhl":
      return {
        value: period,
        displayValue: period > 3 ? `OT ${clock}` : `P${period} ${clock}`,
      };
    case "mlb": {
      // MLB periods: top of inning = odd numbers conceptually
      // ESPN uses period = inning number, and situation has half info
      const suffix = period === 1 ? "st" : period === 2 ? "nd" : period === 3 ? "rd" : "th";
      return {
        value: period,
        displayValue: `Inn ${period}${suffix}`,
      };
    }
    default:
      return { value: period, displayValue: clock };
  }
}

/** Normalize an ESPN team to ScoreSpark team */
function normalizeTeam(competitor: ESPNCompetitor, sport: Sport): Team {
  const t = competitor.team;
  return {
    id: `espn-${sport}-${t.id}`,
    name: t.displayName,
    shortName: t.abbreviation,
    badge: t.logo || `https://a.espncdn.com/i/teamlogos/${sport === "nfl" ? "nfl" : sport}/500/${t.abbreviation.toLowerCase()}.png`,
    sport,
  };
}

/** Get league display name for a sport */
function getLeagueName(sport: Sport): { league: string; leagueShort: string } {
  switch (sport) {
    case "nfl":
      return { league: "NFL", leagueShort: "NFL" };
    case "nba":
      return { league: "NBA", leagueShort: "NBA" };
    case "nhl":
      return { league: "NHL", leagueShort: "NHL" };
    case "mlb":
      return { league: "MLB", leagueShort: "MLB" };
    default:
      return { league: sport.toUpperCase(), leagueShort: sport.toUpperCase() };
  }
}

/**
 * Normalize an ESPN event into a ScoreSpark Match
 */
export function normalizeESPNMatch(event: ESPNEvent, sport: Sport): Match {
  const comp = event.competitions[0];
  const status = comp.status || event.status;

  const home = comp.competitors.find((c) => c.homeAway === "home")!;
  const away = comp.competitors.find((c) => c.homeAway === "away")!;

  const matchStatus = normalizeStatus(status);
  const { league, leagueShort } = getLeagueName(sport);

  return {
    id: `espn-${sport}-${event.id}`,
    sport,
    league,
    leagueShort,
    homeTeam: normalizeTeam(home, sport),
    awayTeam: normalizeTeam(away, sport),
    homeScore: matchStatus === "upcoming" ? null : parseInt(home.score) || 0,
    awayScore: matchStatus === "upcoming" ? null : parseInt(away.score) || 0,
    status: matchStatus,
    clock: normalizeClock(status, sport),
    startTime: event.date,
    events: [],
    venue: comp.venue?.fullName,
    source: "live",
  };
}

/**
 * Normalize ESPN standings for NBA
 */
export function normalizeNBAStandings(
  entries: ESPNStandingsEntry[],
  sport: Sport
): NBAStandingRow[] {
  return entries.map((entry, i) => {
    const stats = Object.fromEntries(
      entry.stats.map((s) => [s.name, s])
    );

    return {
      position: i + 1,
      team: {
        id: `espn-${sport}-${entry.team.id}`,
        name: entry.team.displayName,
        shortName: entry.team.abbreviation,
        badge: entry.team.logo || `https://a.espncdn.com/i/teamlogos/${sport}/500/${entry.team.abbreviation.toLowerCase()}.png`,
        sport,
      },
      played: (stats.wins?.value ?? 0) + (stats.losses?.value ?? 0),
      won: stats.wins?.value ?? 0,
      lost: stats.losses?.value ?? 0,
      winPct: stats.winPercent?.displayValue ?? stats.leagueWinPercent?.displayValue ?? ".000",
      gamesBehind: stats.gamesBehind?.displayValue ?? "-",
      streak: stats.streak?.displayValue ?? "-",
      last10: stats.record?.displayValue ?? "-",
    };
  });
}

/**
 * Normalize ESPN standings for NHL
 */
export function normalizeNHLStandings(
  entries: ESPNStandingsEntry[]
): NHLStandingRow[] {
  return entries.map((entry, i) => {
    const stats = Object.fromEntries(
      entry.stats.map((s) => [s.name, s])
    );

    return {
      position: i + 1,
      team: {
        id: `espn-nhl-${entry.team.id}`,
        name: entry.team.displayName,
        shortName: entry.team.abbreviation,
        badge: entry.team.logo || `https://a.espncdn.com/i/teamlogos/nhl/500/${entry.team.abbreviation.toLowerCase()}.png`,
        sport: "nhl",
      },
      played: stats.gamesPlayed?.value ?? 0,
      won: stats.wins?.value ?? 0,
      lost: stats.losses?.value ?? 0,
      otLosses: stats.OTLosses?.value ?? stats.otLosses?.value ?? 0,
      points: stats.points?.value ?? 0,
      goalsFor: stats.pointsFor?.value ?? 0,
      goalsAgainst: stats.pointsAgainst?.value ?? 0,
      streak: stats.streak?.displayValue ?? "-",
      last10: stats.record?.displayValue ?? "-",
    };
  });
}
