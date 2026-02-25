/**
 * Unified ESPN API client for NFL, NBA, NHL, and MLB
 * Uses the free, unofficial ESPN site API (no key needed)
 */

import type {
  ESPNScoreboardResponse,
  ESPNStandingsResponse,
  ESPNInjuryResponse,
  ESPNLeadersResponse,
  ESPNPowerIndexResponse,
  ESPNEventSummaryResponse,
} from "./types/espn";

const BASE_URL = "https://site.api.espn.com/apis";
const WEB_BASE_URL = "https://site.web.api.espn.com/apis";

/** ESPN sport/league path mapping */
const SPORT_PATHS: Record<string, { sport: string; league: string }> = {
  nfl: { sport: "football", league: "nfl" },
  nba: { sport: "basketball", league: "nba" },
  nhl: { sport: "hockey", league: "nhl" },
  mlb: { sport: "baseball", league: "mlb" },
};

/** ESPN soccer league slugs for leagues beyond football-data.org free tier */
export const ESPN_SOCCER_LEAGUES: Record<string, { slug: string; name: string; country: string }> = {
  MLS: { slug: "usa.1", name: "MLS", country: "USA" },
  LMX: { slug: "mex.1", name: "Liga MX", country: "Mexico" },
  SPL: { slug: "sco.1", name: "Scottish Premiership", country: "Scotland" },
  TSL: { slug: "tur.1", name: "Super Lig", country: "Turkey" },
  JPL: { slug: "bel.1", name: "Jupiler Pro League", country: "Belgium" },
  BSA: { slug: "bra.1", name: "Brasileirao Serie A", country: "Brazil" },
  ASL: { slug: "arg.1", name: "Argentine Primera", country: "Argentina" },
  SAL: { slug: "sau.1", name: "Saudi Pro League", country: "Saudi Arabia" },
  JL: { slug: "jpn.1", name: "J1 League", country: "Japan" },
  AL: { slug: "aus.1", name: "A-League", country: "Australia" },
};

async function fetchESPN<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    console.warn(`[ESPN] ${res.status} ${res.statusText} for ${url}`);
    return { events: [], leagues: [], season: {} } as unknown as T;
  }

  return res.json() as Promise<T>;
}

/**
 * Get scoreboard (today's games) for a sport
 * Optionally pass a date string (YYYYMMDD) for a specific day
 */
export async function getScoreboard(
  sport: "nfl" | "nba" | "nhl" | "mlb",
  date?: string
): Promise<ESPNScoreboardResponse> {
  const paths = SPORT_PATHS[sport];
  const params = new URLSearchParams();
  if (date) params.set("dates", date);

  const url = `${BASE_URL}/site/v2/sports/${paths.sport}/${paths.league}/scoreboard${
    params.toString() ? `?${params}` : ""
  }`;

  return fetchESPN<ESPNScoreboardResponse>(url);
}

/**
 * Get standings for a sport
 */
export async function getESPNStandings(
  sport: "nfl" | "nba" | "nhl" | "mlb"
): Promise<ESPNStandingsResponse> {
  const paths = SPORT_PATHS[sport];
  const url = `${BASE_URL}/v2/sports/${paths.sport}/${paths.league}/standings`;
  return fetchESPN<ESPNStandingsResponse>(url);
}

/**
 * Get league-wide injury reports
 */
export async function getInjuries(
  sport: "nfl" | "nba" | "nhl" | "mlb"
): Promise<ESPNInjuryResponse> {
  const paths = SPORT_PATHS[sport];
  const url = `${BASE_URL}/site/v2/sports/${paths.sport}/${paths.league}/injuries`;
  return fetchESPN<ESPNInjuryResponse>(url);
}

/**
 * Get stats leaders for a sport (v3 endpoint — rich inline data)
 */
export async function getLeaders(
  sport: "nfl" | "nba" | "nhl" | "mlb"
): Promise<ESPNLeadersResponse> {
  const paths = SPORT_PATHS[sport];
  const url = `${BASE_URL}/site/v3/sports/${paths.sport}/${paths.league}/leaders`;
  return fetchESPN<ESPNLeadersResponse>(url);
}

/**
 * Get power rankings (FPI for NFL, BPI for NBA)
 * NHL and MLB use generic power index
 */
/**
 * Get soccer scoreboard from ESPN for leagues not covered by football-data.org
 */
export async function getESPNSoccerScoreboard(
  leagueSlug: string,
  date?: string
): Promise<ESPNScoreboardResponse> {
  const params = new URLSearchParams();
  if (date) params.set("dates", date);
  const url = `${BASE_URL}/site/v2/sports/soccer/${leagueSlug}/scoreboard${
    params.toString() ? `?${params}` : ""
  }`;
  return fetchESPN<ESPNScoreboardResponse>(url);
}

/**
 * Get soccer standings from ESPN
 */
export async function getESPNSoccerStandings(
  leagueSlug: string
): Promise<ESPNStandingsResponse> {
  const url = `${BASE_URL}/v2/sports/soccer/${leagueSlug}/standings`;
  return fetchESPN<ESPNStandingsResponse>(url);
}

/**
 * Get event summary (box score, play-by-play, etc.) from ESPN
 */
export async function getESPNEventSummary(
  sport: string,
  league: string,
  eventId: string
): Promise<ESPNEventSummaryResponse> {
  const url = `${BASE_URL}/site/v2/sports/${sport}/${league}/summary?event=${eventId}`;
  return fetchESPN<ESPNEventSummaryResponse>(url);
}

export async function getPowerIndex(
  sport: "nfl" | "nba" | "nhl" | "mlb"
): Promise<ESPNPowerIndexResponse> {
  const paths = SPORT_PATHS[sport];
  const year = new Date().getFullYear();
  const sortField = sport === "nfl" ? "fpi.fpi" : sport === "nba" ? "bpi.bpi" : "record.wins";
  const limit = sport === "nfl" ? 32 : 30;
  const url = `${WEB_BASE_URL}/fitt/v3/sports/${paths.sport}/${paths.league}/powerindex?region=us&lang=en&season=${year}&sort=${sortField}%3Adesc&limit=${limit}`;
  return fetchESPN<ESPNPowerIndexResponse>(url);
}
