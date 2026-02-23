import { config } from "@/lib/config";
import { cacheGet, cacheSet } from "./cache";
import { getStandings, type CompetitionCode } from "@/lib/api/football-data";
import { normalizeStandings } from "./soccer-normalizer";
import { getESPNStandings } from "@/lib/api/espn";
import { normalizeNBAStandings, normalizeNHLStandings } from "./espn-normalizer";
import {
  eplStandings as mockEplStandings,
  nbaEastStandings as mockNbaEast,
  nbaWestStandings as mockNbaWest,
  nhlStandings as mockNhlStandings,
  mlbALStandings as mockMlbAL,
  mlbNLStandings as mockMlbNL,
} from "@/lib/mock-data";
import type { StandingRow, NBAStandingRow, NHLStandingRow } from "@/lib/types";

type StandingsResult =
  | { type: "soccer"; rows: StandingRow[] }
  | { type: "nba"; rows: NBAStandingRow[] }
  | { type: "nhl"; rows: NHLStandingRow[] };

// Map our league IDs to football-data competition codes
const SOCCER_LEAGUE_MAP: Record<string, CompetitionCode> = {
  epl: "PL",
  laliga: "PD",
  bundesliga: "BL1",
  seriea: "SA",
  ligue1: "FL1",
  ucl: "CL",
  eredivisie: "DED",
  championship: "ELC",
  ligapt: "PPL",
};

// Europa League is not on the free tier — standings will fall back to mock data

/**
 * Fetch real soccer standings from football-data.org
 */
async function fetchSoccerStandings(leagueId: string): Promise<StandingRow[]> {
  const competitionCode = SOCCER_LEAGUE_MAP[leagueId];
  if (!competitionCode) {
    return mockEplStandings; // fallback
  }

  const cacheKey = `standings:soccer:${competitionCode}`;
  const cached = cacheGet<StandingRow[]>(cacheKey);
  if (cached) return cached;

  try {
    const resp = await getStandings(competitionCode);
    const totalTable = resp.standings.find((s) => s.type === "TOTAL");
    if (!totalTable) return mockEplStandings;

    const rows = normalizeStandings(totalTable.table);
    cacheSet(cacheKey, rows, config.cache.standingsTTL);
    return rows;
  } catch (err) {
    console.error(`[standings-service] Error fetching ${competitionCode}:`, err);
    return mockEplStandings;
  }
}

/**
 * Fetch real NBA standings from ESPN
 */
async function fetchNBAStandings(conference: "east" | "west"): Promise<NBAStandingRow[]> {
  const cacheKey = `standings:nba:${conference}`;
  const cached = cacheGet<NBAStandingRow[]>(cacheKey);
  if (cached) return cached;

  try {
    const resp = await getESPNStandings("nba");
    // ESPN NBA standings: children[0] = Eastern, children[1] = Western
    const confIndex = conference === "east" ? 0 : 1;
    const group = resp.children[confIndex];
    if (!group) throw new Error(`No ${conference} conference data`);

    const rows = normalizeNBAStandings(group.standings.entries, "nba");
    cacheSet(cacheKey, rows, config.cache.standingsTTL);
    return rows;
  } catch (err) {
    console.error(`[standings-service] ESPN NBA ${conference} error:`, err);
    return conference === "east" ? mockNbaEast : mockNbaWest;
  }
}

/**
 * Fetch real NHL standings from ESPN
 */
async function fetchNHLStandings(): Promise<NHLStandingRow[]> {
  const cacheKey = "standings:nhl";
  const cached = cacheGet<NHLStandingRow[]>(cacheKey);
  if (cached) return cached;

  try {
    const resp = await getESPNStandings("nhl");
    // Flatten all conference entries
    const allEntries = resp.children.flatMap((group) =>
      group.standings?.entries ?? group.children?.flatMap((d) => d.standings.entries) ?? []
    );
    const rows = normalizeNHLStandings(allEntries);
    cacheSet(cacheKey, rows, config.cache.standingsTTL);
    return rows;
  } catch (err) {
    console.error("[standings-service] ESPN NHL error:", err);
    return mockNhlStandings;
  }
}

/**
 * Fetch real MLB standings from ESPN
 */
async function fetchMLBStandings(league: "al" | "nl"): Promise<NBAStandingRow[]> {
  const cacheKey = `standings:mlb:${league}`;
  const cached = cacheGet<NBAStandingRow[]>(cacheKey);
  if (cached) return cached;

  try {
    const resp = await getESPNStandings("mlb");
    // ESPN MLB: children[0] = American League, children[1] = National League
    const leagueIndex = league === "al" ? 0 : 1;
    const group = resp.children[leagueIndex];
    if (!group) throw new Error(`No ${league} league data`);

    // Flatten divisions if present
    const entries = group.standings?.entries ??
      group.children?.flatMap((d) => d.standings.entries) ?? [];

    const rows = normalizeNBAStandings(entries, "mlb");
    cacheSet(cacheKey, rows, config.cache.standingsTTL);
    return rows;
  } catch (err) {
    console.error(`[standings-service] ESPN MLB ${league} error:`, err);
    return league === "al" ? mockMlbAL : mockMlbNL;
  }
}

/**
 * Fetch real NFL standings from ESPN
 */
async function fetchNFLStandings(conference: "afc" | "nfc"): Promise<NBAStandingRow[]> {
  const cacheKey = `standings:nfl:${conference}`;
  const cached = cacheGet<NBAStandingRow[]>(cacheKey);
  if (cached) return cached;

  try {
    const resp = await getESPNStandings("nfl");
    const confIndex = conference === "afc" ? 0 : 1;
    const group = resp.children[confIndex];
    if (!group) throw new Error(`No ${conference} data`);

    const entries = group.standings?.entries ??
      group.children?.flatMap((d) => d.standings.entries) ?? [];

    const rows = normalizeNBAStandings(entries, "nfl");
    cacheSet(cacheKey, rows, config.cache.standingsTTL);
    return rows;
  } catch (err) {
    console.error(`[standings-service] ESPN NFL ${conference} error:`, err);
    return [];
  }
}

/**
 * Get standings for any league.
 * Soccer → football-data.org, American sports → ESPN API
 */
export async function getStandingsForLeague(leagueId: string): Promise<StandingsResult> {
  switch (leagueId) {
    // Soccer leagues
    case "epl":
    case "laliga":
    case "bundesliga":
    case "seriea":
    case "ligue1":
    case "ucl":
    case "uel":
    case "eredivisie":
    case "championship":
    case "ligapt":
      return { type: "soccer", rows: await fetchSoccerStandings(leagueId) };

    // NBA
    case "nba-east":
      return { type: "nba", rows: await fetchNBAStandings("east") };
    case "nba-west":
      return { type: "nba", rows: await fetchNBAStandings("west") };

    // NHL
    case "nhl":
      return { type: "nhl", rows: await fetchNHLStandings() };

    // NFL
    case "nfl-afc":
      return { type: "nba", rows: await fetchNFLStandings("afc") };
    case "nfl-nfc":
      return { type: "nba", rows: await fetchNFLStandings("nfc") };

    // MLB
    case "mlb-al":
      return { type: "nba", rows: await fetchMLBStandings("al") };
    case "mlb-nl":
      return { type: "nba", rows: await fetchMLBStandings("nl") };

    default:
      return { type: "soccer", rows: await fetchSoccerStandings("epl") };
  }
}
