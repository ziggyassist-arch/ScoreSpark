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

export interface MatchClock {
  /** Raw minute/quarter/inning value */
  value?: number;
  /** Pre-formatted display string: "67'", "Q3 5:42", "Bot 6th" */
  displayValue?: string;
}

/** Sport-specific detail bag attached to Match */
export interface SportDetail {
  /** Quarter/period/inning scores: [Q1, Q2, Q3, Q4, ...OT] */
  linescores?: { home: number[]; away: number[] };
  /** Half-time score (soccer) */
  htScore?: { home: number; away: number } | null;
  /** Team records: "32-18", etc. */
  homeRecord?: string;
  awayRecord?: string;
  /** Key leaders: [{category, playerName, value}] */
  leaders?: { category: string; playerName: string; displayValue: string; teamSide: "home" | "away" }[];
  /** Team stats from scoreboard: [{name, home, away}] */
  teamStats?: { name: string; homeValue: string; awayValue: string }[];
  /** Minute-by-minute commentary from ESPN summary API */
  commentary?: { minute: string; text: string }[];
  /** NFL situation */
  situation?: {
    down?: number;
    distance?: number;
    yardLine?: number;
    possession?: "home" | "away";
    lastPlay?: string;
    isRedZone?: boolean;
  };
}

export interface Referee {
  name: string;
  nationality?: string;
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
  /** @deprecated Use clock.value instead */
  minute?: number;
  clock?: MatchClock;
  startTime: string;
  events: MatchEvent[];
  stats?: MatchStats;
  venue?: string;
  /** Source identifier: "live" for real API data, "mock" for demo data */
  source?: "live" | "mock";
  /** Sport-specific detail (linescores, leaders, etc.) */
  sportDetail?: SportDetail;
  /** Referee info (soccer) */
  referee?: Referee;
  /** Matchday number (soccer) */
  matchday?: number;
}

export interface Competition {
  code: string;
  name: string;
  country: string;
  sport: Sport;
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
