import { config } from "@/lib/config";
import { cacheGet, cacheSet } from "./cache";
import { getMatches, getMatchDetail, type CompetitionCode } from "@/lib/api/football-data";
import { normalizeMatch, normalizeMatchDetail, normalizeMatchLineups } from "./soccer-normalizer";
import { getScoreboard, getESPNSoccerScoreboard, getESPNEventSummary, ESPN_SOCCER_LEAGUES } from "@/lib/api/espn";
import { normalizeESPNMatch, normalizeESPNSoccerMatch } from "./espn-normalizer";
import { allMatches as mockMatches, sampleLineups as mockLineups } from "@/lib/mock-data";
import type { Match, MatchEvent, Sport, Lineup } from "@/lib/types";
import type { ESPNKeyEvent } from "@/lib/api/types/espn";

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dateRangeStr(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

/** Map ESPN event type text to our MatchEvent type */
function mapESPNEventType(typeText: string): MatchEvent["type"] | null {
  const lower = typeText.toLowerCase();
  if (lower.includes("goal") && lower.includes("own")) return "own-goal";
  if (lower.includes("penalty") && lower.includes("goal")) return "penalty";
  if (lower.includes("goal")) return "goal";
  if (lower.includes("yellow")) return "yellow-card";
  if (lower.includes("red")) return "red-card";
  if (lower.includes("substitution")) return "substitution";
  return null;
}

/** Convert ESPN keyEvents array to MatchEvent[] */
function mapKeyEventsToMatchEvents(
  keyEvents: ESPNKeyEvent[],
  homeTeamId: string,
  awayTeamId: string
): MatchEvent[] {
  const events: MatchEvent[] = [];
  for (const ke of keyEvents) {
    const type = mapESPNEventType(ke.type?.text ?? "");
    if (!type) continue;

    // Prefer displayValue ("20'", "45+2'") as it handles added time;
    // fall back to clock.value (seconds) if no displayValue
    const minute = ke.clock?.displayValue
      ? parseInt(ke.clock.displayValue, 10) || 0
      : ke.clock?.value != null
        ? Math.floor(ke.clock.value / 60)
        : 0;

    const teamId = ke.team?.id;
    const teamSide: "home" | "away" =
      teamId === homeTeamId ? "home" : "away";

    events.push({
      minute,
      type,
      player: ke.participants?.[0]?.athlete?.displayName ?? "Unknown",
      team: teamSide,
      ...(type === "substitution" && ke.participants?.[1]
        ? { playerOut: ke.participants[1].athlete?.displayName }
        : {}),
    });
  }
  return events.sort((a, b) => a.minute - b.minute);
}

/** Extract minute-by-minute commentary from ESPN summary response */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractCommentary(summary: any): { minute: string; text: string }[] | undefined {
  if (!Array.isArray(summary.commentary) || summary.commentary.length === 0) return undefined;
  return summary.commentary.map((c: { time?: { displayValue?: string }; text?: string }) => ({
    minute: c.time?.displayValue ?? "",
    text: c.text ?? "",
  }));
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
 * Fetch soccer matches from football-data.org + ESPN expanded leagues.
 * When no specific date is given, fetches a 3-day window (yesterday → tomorrow).
 * When a specific date is given, fetches only that date (real results, no mock fallback).
 */
async function fetchSoccerMatches(date?: string): Promise<Match[]> {
  const isSpecificDate = !!date;
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
  // Cache even empty results for specific dates to avoid repeated API calls
  cacheSet(cacheKey, matches, config.cache.matchesTTL);

  // Only fall back to mock data for today's view (no specific date), never for past/future dates
  if (matches.length === 0 && !isSpecificDate) {
    return mockMatches.filter((m) => m.sport === "soccer");
  }
  return matches;
}

/**
 * Fetch matches from ESPN API for a given American sport.
 * Uses the dates query param (YYYYMMDD format) for specific dates.
 * Only falls back to mock data for today's view, not for past/future dates.
 */
async function fetchESPNMatches(
  sport: "nba" | "nfl" | "nhl" | "mlb",
  date?: string
): Promise<Match[]> {
  const isSpecificDate = !!date;
  // ESPN date format: YYYYMMDD
  const espnDate = date ? date.replace(/-/g, "") : undefined;
  const cacheKey = `matches:${sport}:${espnDate ?? "today"}`;

  const cached = cacheGet<Match[]>(cacheKey);
  if (cached) return cached;

  try {
    const resp = await getScoreboard(sport, espnDate);
    const matches = resp.events.map((e) => normalizeESPNMatch(e, sport));
    // Cache even empty results for specific dates
    cacheSet(cacheKey, matches, config.cache.matchesTTL);
    return matches;
  } catch (err) {
    console.error(`[match-service] ESPN ${sport} error:`, err);
    // Only use mock data for today's view, never for specific past/future dates
    if (isSpecificDate) return [];
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
    const eventId = parts.slice(2).join("-");

    if (["nba", "nfl", "nhl", "mlb"].includes(sport)) {
      // Try today's scoreboard first
      const matches = await fetchESPNMatches(sport as "nba" | "nfl" | "nhl" | "mlb");
      const match = matches.find((m) => m.id === id);
      if (match) return { match, lineups: null };

      // Fallback: fetch event directly via summary API (works for any date)
      try {
        const sportPaths: Record<string, { sport: string; league: string }> = {
          nba: { sport: "basketball", league: "nba" },
          nfl: { sport: "football", league: "nfl" },
          nhl: { sport: "hockey", league: "nhl" },
          mlb: { sport: "baseball", league: "mlb" },
        };
        const paths = sportPaths[sport];
        if (paths) {
          const summary = await getESPNEventSummary(paths.sport, paths.league, eventId);
          if (summary.header?.competitions?.[0]) {
            const comp = summary.header.competitions[0];
            // Build a synthetic ESPNEvent to reuse the normalizer
            const syntheticEvent = {
              id: eventId,
              date: comp.date,
              name: "",
              shortName: "",
              competitions: [{
                id: comp.id,
                date: comp.date,
                venue: { id: "", fullName: "" },
                competitors: comp.competitors,
                status: comp.status,
              }],
              status: comp.status,
            };
            const normalizedMatch = normalizeESPNMatch(syntheticEvent, sport as Sport);
            return { match: normalizedMatch, lineups: null };
          }
        }
      } catch (err) {
        console.error(`[match-service] ESPN event summary fallback error:`, err);
      }
    }

    if (sport === "soccer") {
      // ESPN soccer match — search across all ESPN soccer leagues (today only)
      const allESPNSoccer = await Promise.all(
        Object.keys(ESPN_SOCCER_LEAGUES).map((code) => fetchESPNSoccerLeague(code))
      );
      const match = allESPNSoccer.flat().find((m) => m.id === id);
      if (match) {
        // Enrich with events from summary API (scoreboard doesn't include them)
        const leagueSlug = ESPN_SOCCER_LEAGUES[match.leagueShort]?.slug ?? "eng.1";
        try {
          const summary = await getESPNEventSummary("soccer", leagueSlug, eventId);
          if (summary.keyEvents?.length && summary.header?.competitions?.[0]) {
            const comp = summary.header.competitions[0];
            const homeId = comp.competitors.find((c: { homeAway: string }) => c.homeAway === "home")?.team?.id ?? "";
            const awayId = comp.competitors.find((c: { homeAway: string }) => c.homeAway === "away")?.team?.id ?? "";
            match.events = mapKeyEventsToMatchEvents(summary.keyEvents, homeId, awayId);
          }
          const commentary = extractCommentary(summary);
          if (commentary) {
            match.sportDetail = { ...match.sportDetail, commentary };
          }
        } catch {
          // Events enrichment failed — return match without events
        }
        return { match, lineups: null };
      }

      // Fallback: fetch event directly via summary API (works for any date)
      // Try common league slugs — ESPN event IDs are global, so most slugs will work
      const soccerLeagueSlugs = [
        "eng.1", "esp.1", "ger.1", "ita.1", "fra.1",
        "usa.1", "mex.1", "arg.1", "bra.1",
        "uefa.champions", "uefa.europa",
        ...Object.values(ESPN_SOCCER_LEAGUES).map((l) => l.slug),
      ];
      // Deduplicate
      const uniqueSlugs = [...new Set(soccerLeagueSlugs)];

      for (const slug of uniqueSlugs) {
        try {
          const summary = await getESPNEventSummary("soccer", slug, eventId);
          if (summary.header?.competitions?.[0]) {
            const comp = summary.header.competitions[0];
            // Find league name from our mapping, or use the slug as fallback
            const leagueEntry = Object.entries(ESPN_SOCCER_LEAGUES).find(
              ([, v]) => v.slug === slug
            );
            const leagueName = leagueEntry?.[1].name ?? slug;
            const leagueShort = leagueEntry?.[0] ?? slug;

            const syntheticEvent = {
              id: eventId,
              date: comp.date,
              name: "",
              shortName: "",
              competitions: [{
                id: comp.id,
                date: comp.date,
                venue: { id: "", fullName: "" },
                competitors: comp.competitors,
                status: comp.status,
              }],
              status: comp.status,
            };
            const normalizedMatch = normalizeESPNSoccerMatch(
              syntheticEvent,
              leagueName,
              leagueShort
            );

            // Extract key events (goals, cards, substitutions) from summary
            if (summary.keyEvents?.length) {
              const homeId = comp.competitors.find((c: { homeAway: string }) => c.homeAway === "home")?.team?.id ?? "";
              const awayId = comp.competitors.find((c: { homeAway: string }) => c.homeAway === "away")?.team?.id ?? "";
              normalizedMatch.events = mapKeyEventsToMatchEvents(
                summary.keyEvents,
                homeId,
                awayId
              );
            }

            // Extract minute-by-minute commentary
            const commentary = extractCommentary(summary);
            if (commentary) {
              normalizedMatch.sportDetail = { ...normalizedMatch.sportDetail, commentary };
            }

            return { match: normalizedMatch, lineups: null };
          }
        } catch {
          // This slug didn't work, try next
          continue;
        }
      }
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
