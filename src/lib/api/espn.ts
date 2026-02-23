/**
 * Unified ESPN API client for NFL, NBA, NHL, and MLB
 * Uses the free, unofficial ESPN site API (no key needed)
 */

import type {
  ESPNScoreboardResponse,
  ESPNStandingsResponse,
} from "./types/espn";

const BASE_URL = "https://site.api.espn.com/apis";

/** ESPN sport/league path mapping */
const SPORT_PATHS: Record<string, { sport: string; league: string }> = {
  nfl: { sport: "football", league: "nfl" },
  nba: { sport: "basketball", league: "nba" },
  nhl: { sport: "hockey", league: "nhl" },
  mlb: { sport: "baseball", league: "mlb" },
};

async function fetchESPN<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    throw new Error(`ESPN API error: ${res.status} ${res.statusText} for ${url}`);
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
