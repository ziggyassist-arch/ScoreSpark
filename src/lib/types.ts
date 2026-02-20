export type Sport = "soccer" | "nba" | "nfl" | "nhl" | "mlb";

export type MatchStatus = "live" | "upcoming" | "finished";

export interface Team {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  sport: Sport;
}

export interface MatchEvent {
  minute: number;
  type: "goal" | "yellow-card" | "red-card" | "substitution" | "penalty" | "own-goal";
  player: string;
  team: "home" | "away";
  assistedBy?: string;
  playerOut?: string;
}

export interface MatchStats {
  possession: [number, number];
  shots: [number, number];
  shotsOnTarget: [number, number];
  corners: [number, number];
  fouls: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
  passes: [number, number];
  passAccuracy: [number, number];
}

export interface Match {
  id: string;
  sport: Sport;
  league: string;
  leagueShort: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  minute?: number;
  startTime: string;
  events: MatchEvent[];
  stats?: MatchStats;
  venue?: string;
}

export type FormResult = "W" | "D" | "L";

export interface StandingRow {
  position: number;
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: FormResult[];
}

export interface NBAStandingRow {
  position: number;
  team: Team;
  played: number;
  won: number;
  lost: number;
  winPct: string;
  gamesBehind: string;
  streak: string;
  last10: string;
}

export interface NHLStandingRow {
  position: number;
  team: Team;
  played: number;
  won: number;
  lost: number;
  otLosses: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  streak: string;
  last10: string;
}

export interface League {
  id: string;
  name: string;
  sport: Sport;
  country?: string;
}

export interface LineupPlayer {
  number: number;
  name: string;
  position: string;
}

export interface Lineup {
  formation: string;
  starters: LineupPlayer[];
  substitutes: LineupPlayer[];
}
