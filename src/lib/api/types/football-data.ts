// football-data.org v4 API response types

export interface FDArea {
  id: number;
  name: string;
  code: string;
  flag: string | null;
}

export interface FDCompetition {
  id: number;
  name: string;
  code: string;
  type: string;
  emblem: string | null;
  area: FDArea;
  currentSeason?: FDSeason;
}

export interface FDSeason {
  id: number;
  startDate: string;
  endDate: string;
  currentMatchday: number;
}

export interface FDTeam {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface FDScore {
  winner: "HOME_TEAM" | "AWAY_TEAM" | "DRAW" | null;
  duration: "REGULAR" | "EXTRA_TIME" | "PENALTY_SHOOTOUT";
  fullTime: { home: number | null; away: number | null };
  halfTime: { home: number | null; away: number | null };
}

export type FDMatchStatus =
  | "SCHEDULED"
  | "TIMED"
  | "IN_PLAY"
  | "PAUSED"
  | "FINISHED"
  | "SUSPENDED"
  | "POSTPONED"
  | "CANCELLED"
  | "AWARDED";

export interface FDReferee {
  id: number;
  name: string;
  type: string;
  nationality: string;
}

export interface FDMatch {
  id: number;
  utcDate: string;
  status: FDMatchStatus;
  matchday: number | null;
  stage: string;
  group: string | null;
  lastUpdated: string;
  homeTeam: FDTeam;
  awayTeam: FDTeam;
  score: FDScore;
  competition: FDCompetition;
  area: FDArea;
  season: FDSeason;
  referees: FDReferee[];
  minute?: number | null;
  venue?: string | null;
}

export interface FDMatchesResponse {
  filters: Record<string, string>;
  resultSet: { count: number; competitions: string; first: string; last: string };
  matches: FDMatch[];
}

export interface FDMatchDetailResponse extends FDMatch {
  // Extended match detail (from /matches/{id})
}

export interface FDStandingEntry {
  position: number;
  team: FDTeam;
  playedGames: number;
  form: string | null; // "W,D,L,W,W"
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface FDStandingTable {
  stage: string;
  type: string;
  group: string | null;
  table: FDStandingEntry[];
}

export interface FDStandingsResponse {
  filters: Record<string, string>;
  competition: FDCompetition;
  season: FDSeason;
  standings: FDStandingTable[];
}

export interface FDCompetitionsResponse {
  count: number;
  filters: Record<string, string>;
  competitions: FDCompetition[];
}

export interface FDLineupPlayer {
  id: number;
  name: string;
  position: string | null;
  shirtNumber: number | null;
}

export interface FDLineup {
  formation: string | null;
  lineup: FDLineupPlayer[];
  bench: FDLineupPlayer[];
}

export interface FDGoal {
  minute: number;
  injuryTime: number | null;
  type: "REGULAR" | "OWN" | "PENALTY";
  team: { id: number; name: string };
  scorer: { id: number; name: string } | null;
  assist: { id: number; name: string } | null;
}

export interface FDBooking {
  minute: number;
  team: { id: number; name: string };
  player: { id: number; name: string };
  card: "YELLOW" | "YELLOW_RED" | "RED";
}

export interface FDSubstitution {
  minute: number;
  team: { id: number; name: string };
  playerOut: { id: number; name: string };
  playerIn: { id: number; name: string };
}

export interface FDHead2HeadMatch extends FDMatch {
  homeTeam: FDTeam & { lineups?: FDLineup };
  awayTeam: FDTeam & { lineups?: FDLineup };
  goals: FDGoal[];
  bookings: FDBooking[];
  substitutions: FDSubstitution[];
}
