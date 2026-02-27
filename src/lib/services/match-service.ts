import { config } from "@/lib/config";
import { cacheGet, cacheSet } from "./cache";
import { getMatches, getMatchDetail, type CompetitionCode } from "@/lib/api/football-data";
import { normalizeMatch, normalizeMatchDetail, normalizeMatchLineups } from "./soccer-normalizer";
import { getScoreboard, getESPNSoccerScoreboard, getESPNEventSummary, ESPN_SOCCER_LEAGUES } from "@/lib/api/espn";
import { normalizeESPNMatch, normalizeESPNSoccerMatch } from "./espn-normalizer";
import { allMatches as mockMatches, sampleLineups as mockLineups } from "@/lib/mock-data";
import type { Match, MatchEvent, MatchStats, Sport, Lineup } from "@/lib/types";
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

/** Extract aggregate score from ESPN summary notes (for UCL/EL knockout ties) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractAggregateFromESPN(summary: any): { home: number; away: number } | null {
  // ESPN puts aggregate info in header.competitions[0].notes or headlines
  const comp = summary.header?.competitions?.[0];
  if (!comp) return null;

  // Check notes array for aggregate text like "Team A wins 4-2 on aggregate" or "Agg: 4-2"
  const notes: string[] = [];
  if (Array.isArray(comp.notes)) {
    for (const n of comp.notes) {
      if (typeof n === "string") notes.push(n);
      else if (n?.headline) notes.push(n.headline);
      else if (n?.text) notes.push(n.text);
    }
  }
  if (Array.isArray(comp.headlines)) {
    for (const h of comp.headlines) {
      if (typeof h === "string") notes.push(h);
      else if (h?.shortLinkText) notes.push(h.shortLinkText);
      else if (h?.description) notes.push(h.description);
    }
  }

  // Parse "X-Y on aggregate" or "Agg: X-Y" or "aggregate X-Y"
  for (const text of notes) {
    const aggMatch = text.match(/(\d+)\s*[-–]\s*(\d+)\s+on\s+agg/i)
      ?? text.match(/agg(?:regate)?[:\s]+(\d+)\s*[-–]\s*(\d+)/i);
    if (aggMatch) {
      return { home: parseInt(aggMatch[1], 10), away: parseInt(aggMatch[2], 10) };
    }
  }
  return null;
}

/** Map football-data.org competition codes to ESPN soccer league slugs */
function fdLeagueToESPN(fdCode: string): string | null {
  const map: Record<string, string> = {
    PL: "eng.1",
    PD: "esp.1",
    SA: "ita.1",
    BL1: "ger.1",
    FL1: "fra.1",
    CL: "uefa.champions",
  };
  return map[fdCode] ?? null;
}

/** Fuzzy team name match: returns true if one name contains the other (case-insensitive) */
function fuzzyTeamMatch(fdName: string, espnName: string): boolean {
  const a = fdName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const b = espnName.toLowerCase().replace(/[^a-z0-9]/g, "");
  return a.includes(b) || b.includes(a);
}

/** Extract structured match stats from ESPN boxscore */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractStatsFromBoxscore(summary: any): MatchStats | undefined {
  const teams = summary.boxscore?.teams;
  if (!Array.isArray(teams) || teams.length < 2) return undefined;

  // ESPN boxscore teams are ordered [away, home] or have homeAway field
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const homeTeam = teams.find((t: any) => t.homeAway === "home") ?? teams[0];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const awayTeam = teams.find((t: any) => t.homeAway === "away") ?? teams[1];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getStat = (team: any, ...names: string[]): number => {
    if (!Array.isArray(team.statistics)) return 0;
    for (const name of names) {
      const stat = team.statistics.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (s: any) => s.name?.toLowerCase() === name.toLowerCase()
      );
      if (stat) return parseFloat(stat.displayValue) || 0;
    }
    return 0;
  };

  const homeXG = getStat(homeTeam, "expectedGoals", "xG", "xGoals");
  const awayXG = getStat(awayTeam, "expectedGoals", "xG", "xGoals");

  return {
    possession: [getStat(homeTeam, "possessionPct", "possession"), getStat(awayTeam, "possessionPct", "possession")],
    shots: [getStat(homeTeam, "totalShots", "shots"), getStat(awayTeam, "totalShots", "shots")],
    shotsOnTarget: [getStat(homeTeam, "shotsOnTarget"), getStat(awayTeam, "shotsOnTarget")],
    corners: [getStat(homeTeam, "cornerKicks", "corners"), getStat(awayTeam, "cornerKicks", "corners")],
    fouls: [getStat(homeTeam, "foulsCommitted", "fouls"), getStat(awayTeam, "foulsCommitted", "fouls")],
    yellowCards: [getStat(homeTeam, "yellowCards"), getStat(awayTeam, "yellowCards")],
    redCards: [getStat(homeTeam, "redCards"), getStat(awayTeam, "redCards")],
    passes: [getStat(homeTeam, "totalPasses", "passes"), getStat(awayTeam, "totalPasses", "passes")],
    passAccuracy: [getStat(homeTeam, "passAccuracy"), getStat(awayTeam, "passAccuracy")],
    ...(homeXG > 0 || awayXG > 0 ? { xg: [homeXG, awayXG] as [number, number] } : {}),
  };
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
          const aggregate = extractAggregateFromESPN(summary);
          if (aggregate) {
            match.sportDetail = { ...match.sportDetail, aggregate };
          }

          // Extract stats from boxscore
          const stats = extractStatsFromBoxscore(summary);
          if (stats) match.stats = stats;

          // Extract htScore from linescores
          if (summary.header?.competitions?.[0]?.competitors) {
            const comps = summary.header.competitions[0].competitors;
            const homeComp = comps.find((c: { homeAway: string }) => c.homeAway === "home");
            const awayComp = comps.find((c: { homeAway: string }) => c.homeAway === "away");
            if (homeComp?.linescores?.[0] && awayComp?.linescores?.[0]) {
              match.sportDetail = {
                ...match.sportDetail,
                htScore: {
                  home: homeComp.linescores[0].value ?? 0,
                  away: awayComp.linescores[0].value ?? 0,
                },
              };
            }
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

            // Extract aggregate from ESPN notes
            const aggregate = extractAggregateFromESPN(summary);
            if (aggregate) {
              normalizedMatch.sportDetail = { ...normalizedMatch.sportDetail, aggregate };
            }

            // Extract stats from boxscore
            const stats = extractStatsFromBoxscore(summary);
            if (stats) normalizedMatch.stats = stats;

            // Extract htScore from linescores
            if (comp.competitors) {
              const homeComp = comp.competitors.find((c: { homeAway: string }) => c.homeAway === "home");
              const awayComp = comp.competitors.find((c: { homeAway: string }) => c.homeAway === "away");
              if (homeComp?.linescores?.[0] && awayComp?.linescores?.[0]) {
                normalizedMatch.sportDetail = {
                  ...normalizedMatch.sportDetail,
                  htScore: {
                    home: homeComp.linescores[0].value ?? 0,
                    away: awayComp.linescores[0].value ?? 0,
                  },
                };
              }
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

    // Enrich fd- match with ESPN events, stats, and commentary
    const espnSlug = fdLeagueToESPN(detail.competition?.code ?? "");
    if (espnSlug) {
      try {
        const matchDate = match.startTime.slice(0, 10).replace(/-/g, "");
        const scoreboard = await getESPNSoccerScoreboard(espnSlug, matchDate);

        // Find matching ESPN event by fuzzy team name comparison
        const espnEvent = scoreboard.events.find((e) => {
          const competitors = e.competitions?.[0]?.competitors ?? [];
          const espnHome = competitors.find((c) => c.homeAway === "home");
          const espnAway = competitors.find((c) => c.homeAway === "away");
          if (!espnHome || !espnAway) return false;
          const homeMatch =
            fuzzyTeamMatch(match.homeTeam.name, espnHome.team.shortDisplayName) ||
            fuzzyTeamMatch(match.homeTeam.name, espnHome.team.displayName) ||
            match.homeTeam.shortName === espnHome.team.abbreviation;
          const awayMatch =
            fuzzyTeamMatch(match.awayTeam.name, espnAway.team.shortDisplayName) ||
            fuzzyTeamMatch(match.awayTeam.name, espnAway.team.displayName) ||
            match.awayTeam.shortName === espnAway.team.abbreviation;
          return homeMatch && awayMatch;
        });

        if (espnEvent) {
          const summary = await getESPNEventSummary("soccer", espnSlug, espnEvent.id);

          // Enrich events (goals, cards, subs)
          if (summary.keyEvents?.length && summary.header?.competitions?.[0]) {
            const comp = summary.header.competitions[0];
            const homeId = comp.competitors.find((c: { homeAway: string }) => c.homeAway === "home")?.team?.id ?? "";
            const awayId = comp.competitors.find((c: { homeAway: string }) => c.homeAway === "away")?.team?.id ?? "";
            match.events = mapKeyEventsToMatchEvents(summary.keyEvents, homeId, awayId);
          }

          // Enrich stats from boxscore
          const stats = extractStatsFromBoxscore(summary);
          if (stats) match.stats = stats;

          // Enrich commentary
          const commentary = extractCommentary(summary);
          if (commentary) {
            match.sportDetail = { ...match.sportDetail, commentary };
          }

          // Enrich aggregate from ESPN notes (if not already set from fd)
          if (!match.sportDetail?.aggregate) {
            const aggregate = extractAggregateFromESPN(summary);
            if (aggregate) {
              match.sportDetail = { ...match.sportDetail, aggregate };
            }
          }
        }
      } catch {
        // ESPN enrichment failed — return fd data as-is
      }
    }

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
