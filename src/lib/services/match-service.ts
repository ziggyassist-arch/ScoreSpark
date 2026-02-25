import { config } from "@/lib/config";
import { cacheGet, cacheSet } from "./cache";
import { getMatches, getMatchDetail, type CompetitionCode } from "@/lib/api/football-data";
import { normalizeMatch, normalizeMatchDetail, normalizeMatchLineups } from "./soccer-normalizer";
import { getScoreboard, getESPNSoccerScoreboard, ESPN_SOCCER_LEAGUES } from "@/lib/api/espn";
import { normalizeESPNMatch, normalizeESPNSoccerMatch } from "./espn-normalizer";
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
 * Fetch soccer matches from ESPN for a specific league
 */
async function fetchESPNSoccerLeague(
  leagueCode: string,
  date?: string
): Promise<Match[]> {
  const league = ESPN_SOCCER_LEAGUES[leagueCode];
  if (!league) return [];

  const espnDate = date ? date.replace(/-/g, "") : undefined;
  const cacheKey = `matches:soccer:espn:${leagueCode}:${espnDate ?? "today"}`;

  const cached = cacheGet<Match[]>(cacheKey);
  if (cached) return cached;

  try {
    const resp = await getESPNSoccerScoreboard(league.slug, espnDate);
    const matches = resp.events.map((e) =>
      normalizeESPNSoccerMatch(e, league.name, leagueCode)
    );
    cacheSet(cacheKey, matches, config.cache.matchesTTL);
    return matches;
  } catch (err) {
    console.error(`[match-service] ESPN soccer ${leagueCode} error:`, err);
    return [];
  }
}

/**
 * Fetch soccer matches from football-data.org with cache + mock fallback.
 * Also fetches from ESPN for expanded leagues (MLS, Liga MX, etc.)
 * When no specific date is given, fetches a 3-day window (yesterday → tomorrow)
 * so there's always content even on lighter match days.
 */
async function fetchSoccerMatches(date?: string): Promise<Match[]> {
  const dateFrom = date ?? dateRangeStr(-1);
  const dateTo = date ?? dateRangeStr(1);
  const cacheKey = `matches:soccer:${dateFrom}:${dateTo}`;

  const cached = cacheGet<Match[]>(cacheKey);
  if (cached) return cached;

  // Fetch from football-data.org (primary) + ESPN soccer leagues (expanded) concurrently
  const espnLeagueCodes = Object.keys(ESPN_SOCCER_LEAGUES);
  const [fdResult, ...espnResults] = await Promise.allSettled([
    getMatches({ dateFrom, dateTo }).then((resp) => resp.matches.map(normalizeMatch)),
    ...espnLeagueCodes.map((code) => fetchESPNSoccerLeague(code, date)),
  ]);

  const fdMatches = fdResult.status === "fulfilled" ? fdResult.value : [];
  if (fdResult.status === "rejected") {
    console.error("[match-service] football-data.org error:", fdResult.reason);
  }

  const espnMatches = espnResults.flatMap((r) =>
    r.status === "fulfilled" ? r.value : []
  );

  const matches = [...fdMatches, ...espnMatches];
  if (matches.length > 0) {
    cacheSet(cacheKey, matches, config.cache.matchesTTL);
  }
  return matches.length > 0 ? matches : mockMatches.filter((m) => m.sport === "soccer");
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
  // ESPN matches — fetch from scoreboard and find matching event
  if (id.startsWith("espn-")) {
    // Parse: espn-{sport}-{eventId}
    const parts = id.split("-");
    const sport = parts[1] as "nba" | "nfl" | "nhl" | "mlb" | "soccer";
    if (["nba", "nfl", "nhl", "mlb"].includes(sport)) {
      const matches = await fetchESPNMatches(sport as "nba" | "nfl" | "nhl" | "mlb");
      const match = matches.find((m) => m.id === id);
      if (match) return { match, lineups: null };
    }
    if (sport === "soccer") {
      // ESPN soccer match — search across all ESPN soccer leagues
      const allESPNSoccer = await Promise.all(
        Object.keys(ESPN_SOCCER_LEAGUES).map((code) => fetchESPNSoccerLeague(code))
      );
      const match = allESPNSoccer.flat().find((m) => m.id === id);
      if (match) return { match, lineups: null };
    }
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
