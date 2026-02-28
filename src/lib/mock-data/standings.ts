import type { StandingRow, NBAStandingRow, NHLStandingRow, FormResult } from "../types";
import { soccerTeams, nbaTeams, nflTeams, nhlTeams, mlbTeams } from "./teams";

// Helpers
const st = (idx: number) => soccerTeams[idx].team;
const nt = (idx: number) => nbaTeams[idx].team;
const ft = (idx: number) => nflTeams[idx].team;
const ht = (idx: number) => nhlTeams[idx].team;
const bt = (idx: number) => mlbTeams[idx].team;

// ═══════════════════════════════════════════════════════════════
// SOCCER — Premier League Table
// ═══════════════════════════════════════════════════════════════

export const eplStandings: StandingRow[] = [
  { position: 1, team: st(2), played: 27, won: 20, drawn: 4, lost: 3, goalsFor: 62, goalsAgainst: 22, goalDifference: 40, points: 64, form: ["W", "W", "W", "D", "W"] },
  { position: 2, team: st(0), played: 27, won: 19, drawn: 5, lost: 3, goalsFor: 58, goalsAgainst: 21, goalDifference: 37, points: 62, form: ["W", "W", "D", "W", "L"] },
  { position: 3, team: st(1), played: 27, won: 18, drawn: 5, lost: 4, goalsFor: 61, goalsAgainst: 26, goalDifference: 35, points: 59, form: ["W", "D", "W", "W", "W"] },
  { position: 4, team: st(7), played: 27, won: 16, drawn: 4, lost: 7, goalsFor: 52, goalsAgainst: 32, goalDifference: 20, points: 52, form: ["W", "W", "W", "D", "L"] },
  { position: 5, team: st(6), played: 27, won: 14, drawn: 6, lost: 7, goalsFor: 48, goalsAgainst: 30, goalDifference: 18, points: 48, form: ["W", "D", "W", "W", "L"] },
  { position: 6, team: st(5), played: 27, won: 13, drawn: 5, lost: 9, goalsFor: 47, goalsAgainst: 38, goalDifference: 9, points: 44, form: ["D", "W", "L", "W", "W"] },
  { position: 7, team: st(3), played: 27, won: 11, drawn: 7, lost: 9, goalsFor: 42, goalsAgainst: 36, goalDifference: 6, points: 40, form: ["L", "W", "D", "L", "W"] },
  { position: 8, team: st(4), played: 27, won: 10, drawn: 5, lost: 12, goalsFor: 33, goalsAgainst: 40, goalDifference: -7, points: 35, form: ["L", "L", "D", "W", "L"] },
];

// ═══════════════════════════════════════════════════════════════
// NBA STANDINGS
// ═══════════════════════════════════════════════════════════════

export const nbaStandings: NBAStandingRow[] = [
  { position: 1, team: nt(1), played: 56, won: 40, lost: 16, winPct: ".714", gamesBehind: "-", streak: "W5", last10: "8-2" },
  { position: 2, team: nt(4), played: 56, won: 36, lost: 20, winPct: ".643", gamesBehind: "4.0", streak: "W3", last10: "7-3" },
  { position: 3, team: nt(3), played: 56, won: 35, lost: 21, winPct: ".625", gamesBehind: "5.0", streak: "L1", last10: "6-4" },
  { position: 4, team: nt(7), played: 56, won: 33, lost: 23, winPct: ".589", gamesBehind: "7.0", streak: "W2", last10: "7-3" },
  { position: 5, team: nt(0), played: 56, won: 32, lost: 24, winPct: ".571", gamesBehind: "8.0", streak: "L2", last10: "5-5" },
  { position: 6, team: nt(6), played: 56, won: 30, lost: 26, winPct: ".536", gamesBehind: "10.0", streak: "L1", last10: "6-4" },
  { position: 7, team: nt(5), played: 56, won: 29, lost: 27, winPct: ".518", gamesBehind: "11.0", streak: "W1", last10: "5-5" },
  { position: 8, team: nt(2), played: 56, won: 28, lost: 28, winPct: ".500", gamesBehind: "12.0", streak: "W1", last10: "6-4" },
];

// ═══════════════════════════════════════════════════════════════
// NFL STANDINGS (uses NBAStandingRow type per existing code)
// ═══════════════════════════════════════════════════════════════

export const nflStandings: NBAStandingRow[] = [
  { position: 1, team: ft(0), played: 17, won: 13, lost: 4, winPct: ".765", gamesBehind: "-", streak: "W4", last10: "8-2" },
  { position: 2, team: ft(5), played: 17, won: 13, lost: 4, winPct: ".765", gamesBehind: "-", streak: "W2", last10: "7-3" },
  { position: 3, team: ft(1), played: 17, won: 12, lost: 5, winPct: ".706", gamesBehind: "1.0", streak: "L1", last10: "7-3" },
  { position: 4, team: ft(6), played: 17, won: 12, lost: 5, winPct: ".706", gamesBehind: "1.0", streak: "W3", last10: "8-2" },
  { position: 5, team: ft(2), played: 17, won: 11, lost: 6, winPct: ".647", gamesBehind: "2.0", streak: "W1", last10: "6-4" },
  { position: 6, team: ft(4), played: 17, won: 11, lost: 6, winPct: ".647", gamesBehind: "2.0", streak: "L2", last10: "5-5" },
  { position: 7, team: ft(7), played: 17, won: 11, lost: 6, winPct: ".647", gamesBehind: "2.0", streak: "L1", last10: "6-4" },
  { position: 8, team: ft(3), played: 17, won: 10, lost: 7, winPct: ".588", gamesBehind: "3.0", streak: "L2", last10: "4-6" },
];

// ═══════════════════════════════════════════════════════════════
// NHL STANDINGS
// ═══════════════════════════════════════════════════════════════

export const nhlStandings: NHLStandingRow[] = [
  { position: 1, team: ht(1), played: 58, won: 37, lost: 16, otLosses: 5, points: 79, goalsFor: 198, goalsAgainst: 148, streak: "W3", last10: "7-2-1" },
  { position: 2, team: ht(3), played: 57, won: 36, lost: 17, otLosses: 4, points: 76, goalsFor: 205, goalsAgainst: 155, streak: "W2", last10: "8-2-0" },
  { position: 3, team: ht(0), played: 57, won: 35, lost: 18, otLosses: 4, points: 74, goalsFor: 210, goalsAgainst: 165, streak: "W1", last10: "6-3-1" },
  { position: 4, team: ht(7), played: 58, won: 35, lost: 18, otLosses: 5, points: 75, goalsFor: 192, goalsAgainst: 160, streak: "L1", last10: "6-3-1" },
  { position: 5, team: ht(4), played: 57, won: 34, lost: 19, otLosses: 4, points: 72, goalsFor: 188, goalsAgainst: 162, streak: "W4", last10: "7-2-1" },
  { position: 6, team: ht(2), played: 58, won: 33, lost: 20, otLosses: 5, points: 71, goalsFor: 185, goalsAgainst: 168, streak: "L2", last10: "5-4-1" },
  { position: 7, team: ht(5), played: 58, won: 32, lost: 21, otLosses: 5, points: 69, goalsFor: 178, goalsAgainst: 170, streak: "W1", last10: "6-3-1" },
  { position: 8, team: ht(6), played: 58, won: 30, lost: 22, otLosses: 6, points: 66, goalsFor: 175, goalsAgainst: 172, streak: "L1", last10: "5-4-1" },
];

// ═══════════════════════════════════════════════════════════════
// MLB STANDINGS (uses NBAStandingRow type per existing code)
// ═══════════════════════════════════════════════════════════════

export const mlbStandings: NBAStandingRow[] = [
  { position: 1, team: bt(0), played: 100, won: 62, lost: 38, winPct: ".620", gamesBehind: "-", streak: "W3", last10: "7-3" },
  { position: 2, team: bt(3), played: 100, won: 58, lost: 42, winPct: ".580", gamesBehind: "4.0", streak: "W2", last10: "6-4" },
  { position: 3, team: bt(4), played: 100, won: 57, lost: 43, winPct: ".570", gamesBehind: "5.0", streak: "W1", last10: "5-5" },
  { position: 4, team: bt(2), played: 100, won: 56, lost: 44, winPct: ".560", gamesBehind: "6.0", streak: "L1", last10: "6-4" },
  { position: 5, team: bt(1), played: 100, won: 55, lost: 45, winPct: ".550", gamesBehind: "7.0", streak: "L2", last10: "4-6" },
  { position: 6, team: bt(6), played: 100, won: 54, lost: 46, winPct: ".540", gamesBehind: "8.0", streak: "W1", last10: "7-3" },
  { position: 7, team: bt(5), played: 100, won: 52, lost: 48, winPct: ".520", gamesBehind: "10.0", streak: "L1", last10: "5-5" },
  { position: 8, team: bt(7), played: 100, won: 48, lost: 52, winPct: ".480", gamesBehind: "14.0", streak: "L3", last10: "3-7" },
];

// ═══════════════════════════════════════════════════════════════
// Lookup by league ID (matches standings-service.ts league IDs)
// ═══════════════════════════════════════════════════════════════

export type StandingsResult =
  | { type: "soccer"; rows: StandingRow[] }
  | { type: "nba"; rows: NBAStandingRow[] }
  | { type: "nhl"; rows: NHLStandingRow[] }
  | { type: "nfl"; rows: NBAStandingRow[] }
  | { type: "mlb"; rows: NBAStandingRow[] };

export function getStandingsForLeague(leagueId: string): StandingsResult | null {
  switch (leagueId) {
    case "epl":
    case "PL":
    case "eng.1":
      return { type: "soccer", rows: eplStandings };
    // Map other soccer leagues to same mock data
    case "laliga":
    case "PD":
    case "esp.1":
    case "bundesliga":
    case "BL1":
    case "ger.1":
    case "seriea":
    case "SA":
    case "ita.1":
    case "ligue1":
    case "FL1":
    case "fra.1":
    // All other soccer leagues → reuse EPL mock data
    case "ucl":
    case "uel":
    case "uel-espn":
    case "eredivisie":
    case "DED":
    case "championship":
    case "eng-championship":
    case "ELC":
    case "ligapt":
    case "PPL":
    case "mls":
    case "ligamx":
    case "brasileirao":
    case "aleague":
    case "scottish":
    case "superlig":
    case "jupiler":
    case "russian":
    case "greek":
    case "swedish":
    case "danish":
    case "norwegian":
    case "austrian":
    case "swiss":
    case "czech":
    case "finnish":
    case "romanian":
    case "israeli":
    case "cypriot":
    case "argentina":
    case "colombian":
    case "chilean":
    case "peruvian":
    case "uruguayan":
    case "ecuadorian":
    case "paraguayan":
    case "jleague":
    case "chinese":
    case "indian":
    case "saudipro":
    case "thai":
    case "indonesian":
    case "malaysian":
    case "singapore":
    case "nigerian":
    case "ghanaian":
    case "kenyan":
    case "nwsl":
    case "usl":
    case "wsl":
    case "fa-cup":
    case "efl-cup":
    case "esp-segunda":
    case "copa-del-rey":
    case "ger-2bundesliga":
    case "dfb-pokal":
    case "ita-serieb":
    case "coppa-italia":
    case "fra-ligue2":
    case "coupe-de-france":
      return { type: "soccer", rows: eplStandings };
    case "nba":
    case "nba-east":
    case "nba-west":
      return { type: "nba", rows: nbaStandings };
    case "nfl":
    case "nfl-afc":
    case "nfl-nfc":
      return { type: "nfl", rows: nflStandings };
    case "nhl":
      return { type: "nhl", rows: nhlStandings };
    case "mlb":
    case "mlb-al":
    case "mlb-nl":
      return { type: "mlb", rows: mlbStandings };
    default:
      return null;
  }
}
