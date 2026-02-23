import { config } from "@/lib/config";
import { cacheGet, cacheSet } from "./cache";
import { getMatches, getMatchDetail, type CompetitionCode } from "@/lib/api/football-data";
import { normalizeMatch, normalizeMatchDetail, normalizeMatchLineups } from "./soccer-normalizer";
import { getScoreboard } from "@/lib/api/espn";
import { normalizeESPNMatch } from "./espn-normalizer";
import { allMatches as mockMatches, sampleLineups as mockLineups } from "@/lib/mock-data";
import type { Match, Sport, Lineup } from "@/lib/types";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function dateRangeStr(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

/**
 * Fetch soccer matches from football-data.org with cache + mock fallback.
 * When no specific date is given, fetches a 3-day window (yesterday → tomorrow)
 * so there's always content even on lighter match days.
 */
async function fetchSoccerMatches(date?: string): Promise<Match[]> {
  const dateFrom = date ?? dateRangeStr(-1);
  const dateTo = date ?? dateRangeStr(1);
  const cacheKey = `matches:soccer:${dateFrom}:${dateTo}`;

  const cached = cacheGet<Match[]>(cacheKey);
  if (cached) return cached;

  try {
    const resp = await getMatches({ dateFrom, dateTo });
    const matches = resp.matches.map(normalizeMatch);
    cacheSet(cacheKey, matches, config.cache.matchesTTL);
    return matches;
  } catch (err) {
    console.error("[match-service] football-data.org error, using mock data:", err);
    return mockMatches.filter((m) => m.sport === "soccer");
  }
}

/**
 * Fetch matches from ESPN API for a given American sport
 */
async function fetchESPNMatches(
  sport: "nba" | "nfl" | "nhl" | "mlb",
  date?: string
): Promise<Match[]> {
  // ESPN date format: YYYYMMDD
  const espnDate = date ? date.replace(/-/g, "") : undefined;
  const cacheKey = `matches:${sport}:${espnDate ?? "today"}`;

  const cached = cacheGet<Match[]>(cacheKey);
  if (cached) return cached;

  try {
    const resp = await getScoreboard(sport, espnDate);
    const matches = resp.events.map((e) => normalizeESPNMatch(e, sport));
    cacheSet(cacheKey, matches, config.cache.matchesTTL);
    return matches;
  } catch (err) {
    console.error(`[match-service] ESPN ${sport} error, using mock data:`, err);
    return mockMatches
      .filter((m) => m.sport === sport)
      .map((m) => ({ ...m, league: `${m.league} (Demo)` }));
  }
}

/**
 * Get all matches for a given sport and date.
 * Soccer uses football-data.org; NFL/NBA/NHL/MLB use ESPN API.
 */
export async function getMatchesForSport(
  sport: Sport,
  date?: string
): Promise<Match[]> {
  if (sport === "soccer") {
    return fetchSoccerMatches(date);
  }
  if (sport === "nba" || sport === "nfl" || sport === "nhl" || sport === "mlb") {
    return fetchESPNMatches(sport, date);
  }
  return [];
}

/**
 * Get all matches across all sports for a date
 */
export async function getAllMatches(date?: string): Promise<Match[]> {
  const dateKey = date ?? todayStr();
  const cacheKey = `matches:all:${dateKey}`;

  const cached = cacheGet<Match[]>(cacheKey);
  if (cached) return cached;

  const [soccer, nba, nfl, nhl, mlb] = await Promise.all([
    getMatchesForSport("soccer", date),
    getMatchesForSport("nba", date),
    getMatchesForSport("nfl", date),
    getMatchesForSport("nhl", date),
    getMatchesForSport("mlb", date),
  ]);

  const all = [...soccer, ...nba, ...nfl, ...nhl, ...mlb];
  cacheSet(cacheKey, all, config.cache.matchesTTL);
  return all;
}

/**
 * Get match detail by ID.
 * For football-data IDs (fd-<number>), fetches from API.
 * For mock IDs, returns mock data.
 */
export async function getMatchDetailById(
  id: string
): Promise<{ match: Match; lineups: { home: Lineup; away: Lineup } | null } | null> {
  // ESPN matches — no detail endpoint, return basic match
  if (id.startsWith("espn-")) {
    // Try to find it in cached results or return null
    // ESPN doesn't have a free detail endpoint, so detail is limited
    return null;
  }

  // Mock data path
  if (!id.startsWith("fd-")) {
    const mockMatch = mockMatches.find((m) => m.id === id);
    if (!mockMatch) return null;
    const lineups = mockLineups[id] ?? null;
    return { match: mockMatch, lineups };
  }

  const fdId = parseInt(id.replace("fd-", ""), 10);
  if (isNaN(fdId)) return null;

  const cacheKey = `match:detail:${fdId}`;
  const cached = cacheGet<{ match: Match; lineups: { home: Lineup; away: Lineup } | null }>(cacheKey);
  if (cached) return cached;

  try {
    const detail = await getMatchDetail(fdId);
    const match = normalizeMatchDetail(detail);
    const lineups = normalizeMatchLineups(detail);
    const result = { match, lineups };
    cacheSet(cacheKey, result, config.cache.matchesTTL);
    return result;
  } catch (err) {
    console.error("[match-service] detail fetch error:", err);
    return null;
  }
}

/**
 * Get matches across a range (for the date strip / scrolling dates)
 */
export async function getMatchesForRange(
  daysBack: number,
  daysForward: number
): Promise<Match[]> {
  const dateFrom = dateRangeStr(-daysBack);
  const dateTo = dateRangeStr(daysForward);
  const cacheKey = `matches:range:${dateFrom}:${dateTo}`;

  const cached = cacheGet<Match[]>(cacheKey);
  if (cached) return cached;

  try {
    const resp = await getMatches({ dateFrom, dateTo });
    const matches = resp.matches.map(normalizeMatch);
    cacheSet(cacheKey, matches, config.cache.matchesTTL);
    return matches;
  } catch (err) {
    console.error("[match-service] range fetch error:", err);
    return mockMatches.filter((m) => m.sport === "soccer");
  }
}
