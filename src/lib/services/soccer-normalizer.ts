import type { Match, MatchEvent, MatchStatus, Team, StandingRow, FormResult, Lineup } from "@/lib/types";
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
    default:
      return "upcoming";
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
  return comp?.name ?? code;
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

export function normalizeMatch(fd: FDMatch): Match {
  // Extract main referee
  const mainRef = fd.referees?.find((r) => r.type === "REFEREE");

  return {
    id: `fd-${fd.id}`,
    sport: "soccer",
    league: competitionFullName(fd.competition.code),
    leagueShort: competitionShortCode(fd.competition.code),
    homeTeam: normalizeTeam(fd.homeTeam),
    awayTeam: normalizeTeam(fd.awayTeam),
    homeScore: fd.score.fullTime.home,
    awayScore: fd.score.fullTime.away,
    status: mapStatus(fd.status),
    minute: fd.minute ?? undefined,
    startTime: fd.utcDate,
    events: [],
    venue: fd.venue ?? undefined,
    referee: mainRef ? { name: mainRef.name, nationality: mainRef.nationality } : undefined,
    matchday: fd.matchday ?? undefined,
  };
}

export function normalizeMatchDetail(fd: FDHead2HeadMatch): Match {
  const base = normalizeMatch(fd);
  const events: MatchEvent[] = [
    ...normalizeGoals(fd.goals ?? [], fd.homeTeam.id),
    ...normalizeBookings(fd.bookings ?? [], fd.homeTeam.id),
    ...normalizeSubstitutions(fd.substitutions ?? [], fd.homeTeam.id),
  ].sort((a, b) => a.minute - b.minute);

  return { ...base, events };
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
