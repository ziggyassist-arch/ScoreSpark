import type { Match, MatchEvent, MatchStatus, MatchStatusDetail, Team, StandingRow, FormResult, Lineup } from "@/lib/types";
import type {
  FDMatch,
  FDHead2HeadMatch,
  FDStandingEntry,
  FDGoal,
  FDBooking,
  FDSubstitution,
  FDMatchStatus,
} from "@/lib/api/types/football-data";
import { FREE_TIER_COMPETITIONS } from "@/lib/api/football-data";

function mapStatus(fdStatus: FDMatchStatus): MatchStatus {
  switch (fdStatus) {
    case "IN_PLAY":
    case "PAUSED":
      return "live";
    case "FINISHED":
    case "AWARDED":
      return "finished";
    case "SUSPENDED":
      return "live";
    case "POSTPONED":
    case "CANCELLED":
      return "upcoming";
    default:
      return "upcoming";
  }
}

function mapStatusDetail(fdStatus: FDMatchStatus, duration: string | undefined): MatchStatusDetail | undefined {
  switch (fdStatus) {
    case "POSTPONED":
      return "postponed";
    case "CANCELLED":
      return "cancelled";
    case "SUSPENDED":
      return "suspended";
    case "AWARDED":
      return "walkover";
    case "FINISHED":
      if (duration === "PENALTY_SHOOTOUT") return "pen";
      if (duration === "EXTRA_TIME") return "aet";
      return "ft";
    default:
      return undefined;
  }
}

function competitionShortCode(code: string): string {
  const map: Record<string, string> = {
    PL: "EPL",
    PD: "LAL",
    BL1: "BUN",
    SA: "SA",
    FL1: "L1",
    CL: "UCL",
    DED: "ERE",
    ELC: "ELC",
  };
  return map[code] ?? code;
}

function competitionFullName(code: string): string {
  const comp = FREE_TIER_COMPETITIONS.find((c) => c.code === code);
  if (comp) return comp.name;

  // Extra names for competitions returned by the API but not in FREE_TIER list
  const extraNames: Record<string, string> = {
    CLI: "Copa Libertadores",
    BSA: "Brasileirão Série A",
    WC: "World Cup",
    EC: "European Championship",
  };
  return extraNames[code] ?? code;
}

function normalizeTeam(fdTeam: { id: number; name: string; shortName: string; tla: string; crest: string }): Team {
  return {
    id: `fd-${fdTeam.id}`,
    name: fdTeam.shortName || fdTeam.name,
    shortName: fdTeam.tla || fdTeam.shortName?.slice(0, 3).toUpperCase() || "???",
    badge: fdTeam.crest || `https://placehold.co/40x40/1E1B3A/7EB6E6?text=${fdTeam.tla}`,
    sport: "soccer",
  };
}

function normalizeGoals(goals: FDGoal[], homeTeamId: number): MatchEvent[] {
  return goals.map((g) => ({
    minute: g.minute,
    type: g.type === "OWN" ? "own-goal" : g.type === "PENALTY" ? "penalty" : "goal",
    player: g.scorer?.name ?? "Unknown",
    team: g.team.id === homeTeamId ? ("home" as const) : ("away" as const),
    assistedBy: g.assist?.name,
  }));
}

function normalizeBookings(bookings: FDBooking[], homeTeamId: number): MatchEvent[] {
  return bookings.map((b) => ({
    minute: b.minute,
    type: b.card === "RED" || b.card === "YELLOW_RED" ? "red-card" : "yellow-card",
    player: b.player.name,
    team: b.team.id === homeTeamId ? ("home" as const) : ("away" as const),
  }));
}

function normalizeSubstitutions(subs: FDSubstitution[], homeTeamId: number): MatchEvent[] {
  return subs.map((s) => ({
    minute: s.minute,
    type: "substitution" as const,
    player: s.playerIn.name,
    team: s.team.id === homeTeamId ? ("home" as const) : ("away" as const),
    playerOut: s.playerOut.name,
  }));
}

function computeClock(fd: FDMatch): { clock?: Match["clock"]; minute?: number } {
  if (fd.status !== "IN_PLAY" && fd.status !== "PAUSED") return {};

  if (fd.status === "PAUSED") {
    return { clock: { displayValue: "HT", value: 45 }, minute: 45 };
  }

  // Calculate elapsed minutes from kickoff
  const elapsed = Math.floor((Date.now() - new Date(fd.utcDate).getTime()) / 60000);

  // First half: 0-45 min elapsed → show as-is (capped at 45+)
  // Half-time break is ~15 min, second half starts ~60 min after kickoff
  // Second half: subtract ~15 min break to get match minute
  let matchMinute: number;
  if (elapsed <= 45) {
    matchMinute = Math.max(1, elapsed);
  } else if (elapsed <= 60) {
    // In the halftime window but status is IN_PLAY — likely 45+
    matchMinute = 45;
  } else {
    matchMinute = Math.min(90, elapsed - 15);
  }

  return {
    clock: { displayValue: `${matchMinute}'`, value: matchMinute },
    minute: matchMinute,
  };
}

export function normalizeMatch(fd: FDMatch): Match {
  // Extract main referee
  const mainRef = fd.referees?.find((r) => r.type === "REFEREE");
  let { clock: resolvedClock, minute: resolvedMinute } = computeClock(fd);

  let resolvedStatus = mapStatus(fd.status);
  let resolvedStatusDetail = mapStatusDetail(fd.status, fd.score.duration);

  // If FD says upcoming (TIMED/SCHEDULED) but kickoff was >15 min ago, override status
  if (resolvedStatus === "upcoming" && (fd.status === "TIMED" || fd.status === "SCHEDULED")) {
    const elapsedMin = (Date.now() - new Date(fd.utcDate).getTime()) / 60000;
    if (elapsedMin > 15) {
      // More than ~130 min since kickoff → match is almost certainly finished
      if (elapsedMin > 130) {
        resolvedStatus = "finished";
        resolvedStatusDetail = "ft";
        resolvedClock = undefined;
        resolvedMinute = undefined;
      } else {
        resolvedStatus = "live";
        // Approximate match minute accounting for ~15 min halftime break
        let matchMinute: number;
        if (elapsedMin <= 45) {
          matchMinute = Math.max(1, Math.floor(elapsedMin));
        } else if (elapsedMin <= 60) {
          matchMinute = 45;
        } else {
          matchMinute = Math.min(90, Math.floor(elapsedMin - 15));
        }
        resolvedClock = { displayValue: `${matchMinute}'`, value: matchMinute };
        resolvedMinute = matchMinute;
      }
    }
  }

  const htHome = fd.score.halfTime.home;
  const htAway = fd.score.halfTime.away;
  const htScore = htHome != null && htAway != null ? { home: htHome, away: htAway } : null;

  // Extract aggregate score for knockout ties (UCL/EL)
  let aggregate: { home: number; away: number } | null = null;
  const isKnockout = fd.stage && fd.stage !== "GROUP_STAGE" && fd.stage !== "LEAGUE_STAGE";
  if (isKnockout) {
    const aggScore = fd.score.aggregateScore;
    if (aggScore && aggScore.home != null && aggScore.away != null) {
      aggregate = { home: aggScore.home, away: aggScore.away };
    }
  }

  const sportDetail: import("@/lib/types").SportDetail = {};
  if (htScore) sportDetail.htScore = htScore;
  if (aggregate) sportDetail.aggregate = aggregate;

  return {
    id: `fd-${fd.id}`,
    sport: "soccer",
    league: competitionFullName(fd.competition.code),
    leagueShort: competitionShortCode(fd.competition.code),
    homeTeam: normalizeTeam(fd.homeTeam),
    awayTeam: normalizeTeam(fd.awayTeam),
    homeScore: fd.score.fullTime.home,
    awayScore: fd.score.fullTime.away,
    status: resolvedStatus,
    statusDetail: resolvedStatusDetail,
    minute: resolvedMinute ?? fd.minute ?? undefined,
    clock: resolvedClock,
    startTime: fd.utcDate,
    events: [],
    venue: fd.venue ?? undefined,
    referee: mainRef ? { name: mainRef.name, nationality: mainRef.nationality } : undefined,
    matchday: fd.matchday ?? undefined,
    sportDetail: Object.keys(sportDetail).length > 0 ? sportDetail : undefined,
  };
}

export function normalizeMatchDetail(fd: FDHead2HeadMatch): Match {
  const base = normalizeMatch(fd);
  const events: MatchEvent[] = [
    ...normalizeGoals(fd.goals ?? [], fd.homeTeam.id),
    ...normalizeBookings(fd.bookings ?? [], fd.homeTeam.id),
    ...normalizeSubstitutions(fd.substitutions ?? [], fd.homeTeam.id),
  ].sort((a, b) => a.minute - b.minute);

  // Also check fd.aggregates field for knockout tie aggregate (detail response)
  if (!base.sportDetail?.aggregate && fd.aggregates) {
    const agg = fd.aggregates;
    if (agg.homeTeam != null && agg.awayTeam != null) {
      base.sportDetail = {
        ...base.sportDetail,
        aggregate: { home: agg.homeTeam, away: agg.awayTeam },
      };
    }
  }

  // Map league positions from match detail (football-data.org includes position on teams)
  const homePos = fd.homeTeam.position;
  const awayPos = fd.awayTeam.position;

  return {
    ...base,
    events,
    ...(homePos ? { homeLeaguePosition: homePos } : {}),
    ...(awayPos ? { awayLeaguePosition: awayPos } : {}),
  };
}

export function normalizeMatchLineups(
  fd: FDHead2HeadMatch
): { home: Lineup; away: Lineup } | null {
  const homeLineup = fd.homeTeam.lineups;
  const awayLineup = fd.awayTeam.lineups;
  if (!homeLineup || !awayLineup) return null;

  function mapLineup(l: NonNullable<typeof homeLineup>): Lineup {
    return {
      formation: l.formation ?? "Unknown",
      starters: l.lineup.map((p) => ({
        number: p.shirtNumber ?? 0,
        name: p.name,
        position: p.position ?? "",
      })),
      substitutes: l.bench.map((p) => ({
        number: p.shirtNumber ?? 0,
        name: p.name,
        position: p.position ?? "",
      })),
    };
  }

  return {
    home: mapLineup(homeLineup),
    away: mapLineup(awayLineup),
  };
}

export function normalizeStandings(entries: FDStandingEntry[]): StandingRow[] {
  return entries.map((e) => ({
    position: e.position,
    team: normalizeTeam(e.team),
    played: e.playedGames,
    won: e.won,
    drawn: e.draw,
    lost: e.lost,
    goalsFor: e.goalsFor,
    goalsAgainst: e.goalsAgainst,
    goalDifference: e.goalDifference,
    points: e.points,
    form: parseForm(e.form),
  }));
}

function parseForm(form: string | null): FormResult[] {
  if (!form) return [];
  return form
    .split(",")
    .filter((c) => c === "W" || c === "D" || c === "L")
    .slice(-5) as FormResult[];
}
