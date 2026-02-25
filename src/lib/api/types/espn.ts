/**
 * ESPN API v2 response types
 * Used for NFL, NBA, NHL, and MLB
 * Endpoint: https://site.api.espn.com/apis/site/v2/sports/{sport}/{league}/scoreboard
 */

export interface ESPNScoreboardResponse {
  leagues: ESPNLeague[];
  events: ESPNEvent[];
}

export interface ESPNLeague {
  id: string;
  name: string;
  abbreviation: string;
  season: {
    year: number;
    type: { name: string; abbreviation: string };
  };
}

export interface ESPNEvent {
  id: string;
  date: string;
  name: string;
  shortName: string;
  competitions: ESPNCompetition[];
  status: ESPNStatus;
}

export interface ESPNCompetition {
  id: string;
  date: string;
  venue: ESPNVenue;
  competitors: ESPNCompetitor[];
  status: ESPNStatus;
  odds?: ESPNOdds[];
  situation?: ESPNSituation;
  leaders?: ESPNLeaderCategory[];
}

export interface ESPNLeaderCategory {
  name: string;
  displayName: string;
  shortDisplayName: string;
  abbreviation: string;
  leaders: {
    displayValue: string;
    value: number;
    athlete: {
      id: string;
      fullName: string;
      displayName: string;
      shortName: string;
      team: { id: string };
    };
    team: { id: string };
  }[];
}

export interface ESPNVenue {
  id: string;
  fullName: string;
  address?: {
    city: string;
    state?: string;
    country?: string;
  };
}

export interface ESPNCompetitor {
  id: string;
  homeAway: "home" | "away";
  winner?: boolean;
  team: ESPNTeam;
  score: string;
  linescores?: ESPNLinescore[];
  records?: ESPNRecord[];
  statistics?: ESPNStatistic[];
}

export interface ESPNTeam {
  id: string;
  location: string;
  name: string;
  abbreviation: string;
  displayName: string;
  shortDisplayName: string;
  color?: string;
  alternateColor?: string;
  logo?: string;
  links?: { href: string; text: string }[];
}

export interface ESPNLinescore {
  value: number;
}

export interface ESPNRecord {
  name: string;
  abbreviation: string;
  type: string;
  summary: string;
}

export interface ESPNStatistic {
  name: string;
  abbreviation: string;
  displayValue: string;
}

export interface ESPNStatus {
  clock: number;
  displayClock: string;
  period: number;
  type: {
    id: string;
    name: string;
    state: "pre" | "in" | "post";
    completed: boolean;
    description: string;
    detail: string;
    shortDetail: string;
  };
}

export interface ESPNOdds {
  provider: { name: string };
  details: string;
  overUnder: number;
}

/** NFL-specific: down, distance, possession, etc. */
export interface ESPNSituation {
  $ref?: string;
  lastPlay?: {
    id: string;
    type: { id: string; text: string };
    text: string;
    scoreValue: number;
  };
  down?: number;
  distance?: number;
  yardLine?: number;
  isRedZone?: boolean;
  possession?: string; // team ID
  homeTimeouts?: number;
  awayTimeouts?: number;
}

// Injury types
export interface ESPNInjuryResponse {
  injuries: ESPNTeamInjuries[];
}

export interface ESPNTeamInjuries {
  id: string;
  displayName: string;
  injuries: ESPNInjury[];
}

export interface ESPNInjury {
  id: string;
  athlete: {
    firstName: string;
    lastName: string;
    displayName: string;
    shortName: string;
    headshot?: string;
    position?: { abbreviation: string };
    team?: { id: string };
  };
  status: string;
  type: string;
  date: string;
  details?: {
    type: string;
    location: string;
    side?: string;
    returnDate?: string;
    fantasyStatus?: string;
  };
  shortComment?: string;
  longComment?: string;
}

// Stats Leaders types
export interface ESPNLeadersResponse {
  categories: ESPNLeaderCategoryV3[];
}

export interface ESPNLeaderCategoryV3 {
  name: string;
  displayName: string;
  shortDisplayName: string;
  abbreviation: string;
  leaders: ESPNLeaderEntry[];
}

export interface ESPNLeaderEntry {
  displayValue: string;
  value: number;
  athlete: {
    id: string;
    firstName: string;
    lastName: string;
    displayName: string;
    shortName: string;
    jersey?: string;
    headshot?: string;
    position?: { abbreviation: string };
  };
  team: {
    id: string;
    name: string;
    abbreviation: string;
    displayName: string;
    logos?: { href: string }[];
  };
}

// Power Rankings types
export interface ESPNPowerIndexResponse {
  teams: ESPNPowerIndexTeam[];
}

export interface ESPNPowerIndexTeam {
  id: string;
  name: string;
  displayName: string;
  abbreviation: string;
  logos?: { href: string }[];
  categories: ESPNPowerIndexCategory[];
}

export interface ESPNPowerIndexCategory {
  name: string;
  values: Record<string, number>;
}

// Standings types
export interface ESPNStandingsResponse {
  children: ESPNStandingsGroup[];
}

export interface ESPNStandingsGroup {
  id: string;
  name: string;
  standings: {
    entries: ESPNStandingsEntry[];
  };
  children?: ESPNStandingsGroup[]; // Divisions within conferences
}

export interface ESPNStandingsEntry {
  team: ESPNTeam;
  stats: ESPNStandingStat[];
}

export interface ESPNStandingStat {
  name: string;
  displayName: string;
  shortDisplayName: string;
  description: string;
  abbreviation: string;
  type: string;
  value?: number;
  displayValue: string;
}
