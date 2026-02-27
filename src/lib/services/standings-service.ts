import { config } from "@/lib/config";
import { cacheGet, cacheSet } from "./cache";
import { getStandings, type CompetitionCode } from "@/lib/api/football-data";
import { normalizeStandings } from "./soccer-normalizer";
import { getESPNStandings, getESPNSoccerStandings, ESPN_SOCCER_LEAGUES } from "@/lib/api/espn";
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
  | { type: "nhl"; rows: NHLStandingRow[] }
  | { type: "nfl"; rows: NBAStandingRow[] }
  | { type: "mlb"; rows: NBAStandingRow[] };

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

// Map our league IDs to ESPN soccer league codes
const ESPN_SOCCER_LEAGUE_MAP: Record<string, string> = {
  // Already had
  mls: "MLS",
  ligamx: "LMX",
  scottish: "SPL",
  superlig: "TSL",
  jupiler: "JPL",
  brasileirao: "BSA",
  argentina: "ASL",
  saudipro: "SAL",
  jleague: "JL",
  aleague: "AL",
  // New — Europe
  austrian: "AUT",
  swiss: "SUI",
  greek: "GRE",
  czech: "CZE",
  danish: "DEN",
  norwegian: "NOR",
  swedish: "SWE",
  finnish: "FIN",
  romanian: "ROU",
  russian: "RUS",
  israeli: "ISR",
  cypriot: "CYP",
  // New — Americas
  colombian: "COL",
  chilean: "CHI",
  peruvian: "PER",
  uruguayan: "URU",
  ecuadorian: "ECU",
  paraguayan: "PAR",
  // New — Asia & Africa
  indian: "IND",
  indonesian: "IDN",
  thai: "THA",
  singapore: "SGP",
  malaysian: "MYS",
  chinese: "CHN",
  nigerian: "NGA",
  ghanaian: "GHA",
  kenyan: "KEN",
  // European cups (ESPN versions)
  "ucl-espn": "UCL",
  "uel-espn": "UEL",
  // Second divisions
  "eng-championship": "ENG2",
  "esp-segunda": "ESP2",
  "ger-2bundesliga": "GER2",
  "ita-serieb": "ITA2",
  "fra-ligue2": "FRA2",
  // Domestic cups
  "fa-cup": "FA_CUP",
  "efl-cup": "LEAGUE_CUP",
  "copa-del-rey": "COPA_REY",
  "dfb-pokal": "DFB_POKAL",
  "coppa-italia": "COPPA",
  "coupe-de-france": "COUPE_FR",
  // Women's & lower
  nwsl: "NWSL",
  wsl: "WSL",
  usl: "USL1",
};

/**
 * Fetch soccer standings from ESPN for expanded leagues
 */
async function fetchESPNSoccerStandings(leagueId: string): Promise<StandingRow[]> {
  const espnCode = ESPN_SOCCER_LEAGUE_MAP[leagueId];
  const league = espnCode ? ESPN_SOCCER_LEAGUES[espnCode] : null;
  if (!league) return [];

  const cacheKey = `standings:soccer:espn:${espnCode}`;
  const cached = cacheGet<StandingRow[]>(cacheKey);
  if (cached) return cached;

  try {
    const resp = await getESPNSoccerStandings(league.slug);
    // ESPN soccer standings: flatten all groups/conferences
    const allEntries = resp.children?.flatMap((group) =>
      group.standings?.entries ?? group.children?.flatMap((d) => d.standings.entries) ?? []
    ) ?? [];

    const rows: StandingRow[] = allEntries.map((entry, i) => {
      const stats = Object.fromEntries(entry.stats.map((s) => [s.name, s]));
      return {
        position: i + 1,
        team: {
          id: `espn-soccer-${entry.team.id}`,
          name: entry.team.displayName,
          shortName: entry.team.abbreviation,
          badge: entry.team.logo || "",
          sport: "soccer" as const,
        },
        played: stats.gamesPlayed?.value ?? 0,
        won: stats.wins?.value ?? 0,
        drawn: stats.ties?.value ?? stats.draws?.value ?? 0,
        lost: stats.losses?.value ?? 0,
        goalsFor: stats.pointsFor?.value ?? 0,
        goalsAgainst: stats.pointsAgainst?.value ?? 0,
        goalDifference: (stats.pointsFor?.value ?? 0) - (stats.pointsAgainst?.value ?? 0),
        points: stats.points?.value ?? 0,
        form: [],
      };
    });

    cacheSet(cacheKey, rows, config.cache.standingsTTL);
    return rows;
  } catch (err) {
    console.error(`[standings-service] ESPN soccer ${leagueId} error:`, err);
    return [];
  }
}

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

    // Raw football-data.org competition code aliases
    case "PL": return { type: "soccer", rows: await fetchSoccerStandings("epl") };
    case "PD": return { type: "soccer", rows: await fetchSoccerStandings("laliga") };
    case "BL1": return { type: "soccer", rows: await fetchSoccerStandings("bundesliga") };
    case "SA": return { type: "soccer", rows: await fetchSoccerStandings("seriea") };
    case "FL1": return { type: "soccer", rows: await fetchSoccerStandings("ligue1") };
    case "CL": return { type: "soccer", rows: await fetchSoccerStandings("ucl") };
    case "DED": return { type: "soccer", rows: await fetchSoccerStandings("eredivisie") };
    case "ELC": return { type: "soccer", rows: await fetchSoccerStandings("championship") };
    case "PPL": return { type: "soccer", rows: await fetchSoccerStandings("ligapt") };

    // ESPN soccer leagues (expanded — 50+ leagues)
    case "mls": case "ligamx": case "scottish": case "superlig": case "jupiler":
    case "brasileirao": case "argentina": case "saudipro": case "jleague": case "aleague":
    case "austrian": case "swiss": case "greek": case "czech": case "danish":
    case "norwegian": case "swedish": case "finnish": case "romanian": case "russian":
    case "israeli": case "cypriot":
    case "colombian": case "chilean": case "peruvian": case "uruguayan":
    case "ecuadorian": case "paraguayan":
    case "indian": case "indonesian": case "thai": case "singapore":
    case "malaysian": case "chinese": case "nigerian": case "ghanaian": case "kenyan":
    case "ucl-espn": case "uel-espn":
    case "eng-championship": case "esp-segunda": case "ger-2bundesliga":
    case "ita-serieb": case "fra-ligue2":
    case "fa-cup": case "efl-cup": case "copa-del-rey":
    case "dfb-pokal": case "coppa-italia": case "coupe-de-france":
    case "nwsl": case "wsl": case "usl":
      return { type: "soccer", rows: await fetchESPNSoccerStandings(leagueId) };

    // NBA
    case "nba":
      return { type: "nba", rows: [...await fetchNBAStandings("east"), ...await fetchNBAStandings("west")] };
    case "nba-east":
      return { type: "nba", rows: await fetchNBAStandings("east") };
    case "nba-west":
      return { type: "nba", rows: await fetchNBAStandings("west") };

    // NHL
    case "nhl":
      return { type: "nhl", rows: await fetchNHLStandings() };

    // NFL
    case "nfl":
      return { type: "nfl", rows: [...await fetchNFLStandings("afc"), ...await fetchNFLStandings("nfc")] };
    case "nfl-afc":
      return { type: "nfl", rows: await fetchNFLStandings("afc") };
    case "nfl-nfc":
      return { type: "nfl", rows: await fetchNFLStandings("nfc") };

    // MLB
    case "mlb":
      return { type: "mlb", rows: [...await fetchMLBStandings("al"), ...await fetchMLBStandings("nl")] };
    case "mlb-al":
      return { type: "mlb", rows: await fetchMLBStandings("al") };
    case "mlb-nl":
      return { type: "mlb", rows: await fetchMLBStandings("nl") };

    default:
      return { type: "soccer", rows: await fetchSoccerStandings("epl") };
  }
}
