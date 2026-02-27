/**
 * Normalizes ESPN API responses into ScoreSpark unified types
 * Handles NFL, NBA, NHL, MLB, and ESPN-sourced soccer leagues
 */

import type {
  ESPNEvent,
  ESPNCompetitor,
  ESPNStatus,
  ESPNStandingsEntry,
} from "@/lib/api/types/espn";
import type {
  Match,
  MatchStats,
  MatchStatusDetail,
  Team,
  Sport,
  SportDetail,
  MatchStatus,
  MatchClock,
  NBAStandingRow,
  NHLStandingRow,
} from "@/lib/types";

/** Safely parse a score string to a number */
function parseScore(raw: string | undefined | null): number {
  if (raw == null || raw === "") return 0;
  const n = Number(raw);
  return isNaN(n) ? 0 : n;
}

/** Look up a stat value from an ESPN statistics array by trying multiple names */
function findStat(
  stats: { name: string; displayValue: string }[],
  ...names: string[]
): number {
  for (const name of names) {
    const s = stats.find((st) => st.name === name);
    if (s) {
      const v = parseFloat(s.displayValue);
      return isNaN(v) ? 0 : v;
    }
  }
  return 0;
}

/** Extract MatchStats from ESPN competitor statistics for soccer */
function extractSoccerStats(
  home: ESPNCompetitor,
  away: ESPNCompetitor
): MatchStats | undefined {
  if (!home.statistics?.length && !away.statistics?.length) return undefined;

  const h = home.statistics ?? [];
  const a = away.statistics ?? [];

  const homeXG = findStat(h, "expectedGoals", "xG", "xGoals");
  const awayXG = findStat(a, "expectedGoals", "xG", "xGoals");

  return {
    possession: [findStat(h, "possessionPct", "possession"), findStat(a, "possessionPct", "possession")],
    shots: [findStat(h, "totalShots", "shotsTotal"), findStat(a, "totalShots", "shotsTotal")],
    shotsOnTarget: [findStat(h, "shotsOnTarget", "shotsOnGoal"), findStat(a, "shotsOnTarget", "shotsOnGoal")],
    corners: [findStat(h, "wonCorners", "cornerKicks"), findStat(a, "wonCorners", "cornerKicks")],
    fouls: [findStat(h, "foulsCommitted", "foulsConceded"), findStat(a, "foulsCommitted", "foulsConceded")],
    yellowCards: [findStat(h, "yellowCards", "yellow"), findStat(a, "yellowCards", "yellow")],
    redCards: [findStat(h, "redCards", "red"), findStat(a, "redCards", "red")],
    passes: [findStat(h, "totalPasses", "passesTotal"), findStat(a, "totalPasses", "passesTotal")],
    passAccuracy: [findStat(h, "passAccuracy", "accuratePasses"), findStat(a, "passAccuracy", "accuratePasses")],
    ...(homeXG > 0 || awayXG > 0 ? { xg: [homeXG, awayXG] as [number, number] } : {}),
  };
}

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

/** Map ESPN status to a statusDetail */
function normalizeStatusDetail(status: ESPNStatus): MatchStatusDetail | undefined {
  const name = status.type.name;
  if (status.type.state === "post") {
    if (name === "STATUS_FINAL_OVERTIME" || name === "STATUS_FINAL_OT") return "aet";
    if (name === "STATUS_FINAL_PENALTY" || name === "STATUS_FINAL_PEN") return "pen";
    if (name === "STATUS_POSTPONED") return "postponed";
    if (name === "STATUS_CANCELED" || name === "STATUS_CANCELLED") return "cancelled";
    if (name === "STATUS_SUSPENDED") return "suspended";
    if (name === "STATUS_ABANDONED") return "abandoned";
    return "ft";
  }
  if (name === "STATUS_POSTPONED") return "postponed";
  if (name === "STATUS_CANCELED" || name === "STATUS_CANCELLED") return "cancelled";
  if (name === "STATUS_SUSPENDED") return "suspended";
  return undefined;
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

/** Extract sport-specific detail from ESPN data */
function extractSportDetail(
  home: ESPNCompetitor,
  away: ESPNCompetitor,
  comp: ESPNEvent["competitions"][0],
  sport: Sport
): SportDetail {
  const detail: SportDetail = {};

  // Linescores (quarter/period/inning scores)
  if (home.linescores?.length || away.linescores?.length) {
    detail.linescores = {
      home: (home.linescores ?? []).map((l) => Number(l.value) || 0),
      away: (away.linescores ?? []).map((l) => Number(l.value) || 0),
    };
  }

  // Records
  const homeRec = home.records?.find((r) => r.type === "total");
  const awayRec = away.records?.find((r) => r.type === "total");
  if (homeRec) detail.homeRecord = homeRec.summary;
  if (awayRec) detail.awayRecord = awayRec.summary;

  // Team stats from scoreboard
  if (home.statistics?.length && away.statistics?.length) {
    const awayMap = Object.fromEntries(
      (away.statistics ?? []).map((s) => [s.name, s.displayValue])
    );
    detail.teamStats = (home.statistics ?? [])
      .filter((s) => awayMap[s.name] !== undefined)
      .map((s) => ({
        name: s.abbreviation || s.name,
        homeValue: s.displayValue,
        awayValue: awayMap[s.name],
      }));
  }

  // NFL situation
  if (sport === "nfl" && comp.situation) {
    const sit = comp.situation;
    detail.situation = {
      down: sit.down,
      distance: sit.distance,
      yardLine: sit.yardLine,
      possession: String(sit.possession) === String(home.team.id) ? "home" : "away",
      lastPlay: sit.lastPlay?.text,
      isRedZone: sit.isRedZone,
    };
  }

  // Player leaders (from competition.leaders)
  if (comp.leaders?.length) {
    detail.leaders = [];
    for (const cat of comp.leaders) {
      for (const leader of (cat.leaders ?? []).slice(0, 1)) {
        const teamSide = String(leader.team?.id) === String(home.team.id) ? "home" as const : "away" as const;
        detail.leaders.push({
          category: cat.shortDisplayName || cat.displayName || cat.name,
          playerName: leader.athlete?.displayName ?? leader.athlete?.fullName ?? "Unknown",
          displayValue: leader.displayValue,
          teamSide,
        });
      }
    }
  }

  return detail;
}

/**
 * Normalize an ESPN event into a ScoreSpark Match
 */
export function normalizeESPNMatch(
  event: ESPNEvent,
  sport: Sport,
  leagueOverride?: { league: string; leagueShort: string }
): Match {
  const comp = event.competitions[0];
  const status = comp.status || event.status;

  const home = comp.competitors.find((c) => c.homeAway === "home")!;
  const away = comp.competitors.find((c) => c.homeAway === "away")!;

  const matchStatus = normalizeStatus(status);
  const statusDetail = normalizeStatusDetail(status);
  const { league, leagueShort } = leagueOverride ?? getLeagueName(sport);

  return {
    id: `espn-${sport}-${event.id}`,
    sport,
    league,
    leagueShort,
    homeTeam: normalizeTeam(home, sport),
    awayTeam: normalizeTeam(away, sport),
    homeScore: matchStatus === "upcoming" ? null : parseScore(home.score),
    awayScore: matchStatus === "upcoming" ? null : parseScore(away.score),
    status: matchStatus,
    statusDetail,
    clock: normalizeClock(status, sport),
    startTime: event.date,
    events: [],
    venue: comp.venue?.fullName,
    source: "live",
    sportDetail: extractSportDetail(home, away, comp, sport),
  };
}

/**
 * Normalize an ESPN soccer event into a ScoreSpark Match.
 * ESPN soccer matches use sport="soccer" but come from ESPN instead of football-data.org.
 */
export function normalizeESPNSoccerMatch(
  event: ESPNEvent,
  leagueName: string,
  leagueShort: string
): Match {
  const comp = event.competitions[0];
  const status = comp.status || event.status;

  const home = comp.competitors.find((c) => c.homeAway === "home")!;
  const away = comp.competitors.find((c) => c.homeAway === "away")!;

  const matchStatus = normalizeStatus(status);
  const statusDetail = normalizeStatusDetail(status);

  // Soccer-specific clock display
  const clock: MatchClock = status.type.state === "in"
    ? { value: status.period, displayValue: status.displayClock ? `${status.displayClock}'` : `${status.period}'` }
    : status.type.state === "post"
    ? { displayValue: "FT" }
    : { displayValue: status.type.shortDetail };

  // Extract half-time score from linescores (index 0 = first half)
  const htScore = home.linescores?.[0] != null && away.linescores?.[0] != null
    ? { home: Number(home.linescores[0].value) || 0, away: Number(away.linescores[0].value) || 0 }
    : null;

  return {
    id: `espn-soccer-${event.id}`,
    sport: "soccer",
    league: leagueName,
    leagueShort,
    homeTeam: {
      id: `espn-soccer-${home.team.id}`,
      name: home.team.displayName,
      shortName: home.team.abbreviation,
      badge: home.team.logo || `https://a.espncdn.com/i/teamlogos/soccer/500/${home.team.id}.png`,
      sport: "soccer",
    },
    awayTeam: {
      id: `espn-soccer-${away.team.id}`,
      name: away.team.displayName,
      shortName: away.team.abbreviation,
      badge: away.team.logo || `https://a.espncdn.com/i/teamlogos/soccer/500/${away.team.id}.png`,
      sport: "soccer",
    },
    homeScore: matchStatus === "upcoming" ? null : parseScore(home.score),
    awayScore: matchStatus === "upcoming" ? null : parseScore(away.score),
    status: matchStatus,
    statusDetail,
    clock,
    startTime: event.date,
    events: [],
    venue: comp.venue?.fullName,
    source: "live",
    stats: extractSoccerStats(home, away),
    sportDetail: htScore ? { htScore } : undefined,
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
