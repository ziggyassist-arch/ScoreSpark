import { config } from "@/lib/config";
import { cacheGet, cacheSet } from "./cache";
import type { Team, Sport } from "@/lib/types";

const FD_BASE = config.footballData.baseUrl;
const FD_KEY = config.footballData.apiKey;

export interface TeamDetail {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  sport: Sport;
  venue?: string;
  coach?: string;
  founded?: number;
  colors?: string;
  competitions: string[];
  squad: SquadPlayer[];
}

export interface SquadPlayer {
  id: string;
  name: string;
  position: string;
  shirtNumber: number | null;
  nationality?: string;
  dateOfBirth?: string;
}

// ESPN sport paths
const ESPN_SPORT_PATHS: Record<string, string> = {
  nba: "basketball/nba",
  nfl: "football/nfl",
  nhl: "hockey/nhl",
  mlb: "baseball/mlb",
};

interface TeamListItem {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  sport: Sport;
}

/** Soccer competition codes available on football-data.org free tier */
export const SOCCER_LEAGUES = [
  { code: "CL", name: "Champions League", country: "Europe" },
  { code: "PL", name: "Premier League", country: "England" },
  { code: "PD", name: "La Liga", country: "Spain" },
  { code: "BL1", name: "Bundesliga", country: "Germany" },
  { code: "SA", name: "Serie A", country: "Italy" },
  { code: "FL1", name: "Ligue 1", country: "France" },
  { code: "DED", name: "Eredivisie", country: "Netherlands" },
  { code: "PPL", name: "Primeira Liga", country: "Portugal" },
  { code: "ELC", name: "Championship", country: "England" },
] as const;

/**
 * Fetch soccer teams for a specific competition code (e.g. "CL", "PL")
 */
export async function getSoccerTeamsForCompetition(competitionCode: string): Promise<TeamListItem[]> {
  const cacheKey = `teams-soccer:${competitionCode}`;
  const cached = cacheGet<TeamListItem[]>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${FD_BASE}/competitions/${competitionCode}/teams`, {
      headers: { "X-Auth-Token": FD_KEY },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const teams: TeamListItem[] = (data.teams ?? []).map((t: { id: number; name: string; shortName: string; tla: string; crest: string }) => ({
      id: `fd-${t.id}`,
      name: t.name,
      shortName: t.shortName || t.tla,
      badge: t.crest,
      sport: "soccer" as Sport,
    }));
    cacheSet(cacheKey, teams, 600_000);
    return teams;
  } catch (err) {
    console.error(`[team-service] Error fetching soccer teams for ${competitionCode}:`, err);
    return [];
  }
}

/**
 * Fetch all teams for a sport (for the Teams tab)
 */
export async function getTeamsForSport(sport: Sport): Promise<TeamListItem[]> {
  const cacheKey = `teams-list:${sport}`;
  const cached = cacheGet<TeamListItem[]>(cacheKey);
  if (cached) return cached;

  try {
    if (sport === "soccer") {
      return getSoccerTeamsForCompetition("CL");
    }

    // ESPN sports
    const path = ESPN_SPORT_PATHS[sport];
    if (!path) return [];

    const url = `https://site.api.espn.com/apis/site/v2/sports/${path}/teams?limit=50`;
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) return [];

    const data = await res.json();
    const teams: TeamListItem[] = (data.sports?.[0]?.leagues?.[0]?.teams ?? []).map(
      (entry: { team: { id: string; displayName: string; shortDisplayName: string; abbreviation: string; logos?: { href: string }[] } }) => ({
        id: `espn-${sport}-team-${entry.team.id}`,
        name: entry.team.displayName,
        shortName: entry.team.shortDisplayName || entry.team.abbreviation,
        badge: entry.team.logos?.[0]?.href ?? "",
        sport,
      })
    );

    cacheSet(cacheKey, teams, 600_000);
    return teams;
  } catch (err) {
    console.error(`[team-service] Error fetching ${sport} teams:`, err);
    // Return hardcoded fallback data so teams page is never empty
    return getFallbackTeams(sport);
  }
}

/** ESPN logo URL helper */
function espnTeamLogo(sport: string, id: string): string {
  const paths: Record<string, string> = {
    nhl: "hockey/nhl",
    mlb: "baseball/mlb",
    nba: "basketball/nba",
    nfl: "football/nfl",
  };
  return `https://a.espncdn.com/i/teamlogos/${paths[sport]?.split("/")[1] ?? sport}/500/${id}.png`;
}

/** Hardcoded fallback teams (used when ESPN API is unreachable) */
function getFallbackTeams(sport: Sport): { id: string; name: string; shortName: string; badge: string; sport: Sport }[] {
  if (sport === "nhl") {
    const nhlTeams = [
      { id: "24", name: "Anaheim Ducks", short: "Ducks" },
      { id: "6", name: "Boston Bruins", short: "Bruins" },
      { id: "7", name: "Buffalo Sabres", short: "Sabres" },
      { id: "20", name: "Calgary Flames", short: "Flames" },
      { id: "12", name: "Carolina Hurricanes", short: "Hurricanes" },
      { id: "16", name: "Chicago Blackhawks", short: "Blackhawks" },
      { id: "21", name: "Colorado Avalanche", short: "Avalanche" },
      { id: "29", name: "Columbus Blue Jackets", short: "Blue Jackets" },
      { id: "25", name: "Dallas Stars", short: "Stars" },
      { id: "11", name: "Detroit Red Wings", short: "Red Wings" },
      { id: "22", name: "Edmonton Oilers", short: "Oilers" },
      { id: "13", name: "Florida Panthers", short: "Panthers" },
      { id: "26", name: "Los Angeles Kings", short: "Kings" },
      { id: "30", name: "Minnesota Wild", short: "Wild" },
      { id: "8", name: "Montreal Canadiens", short: "Canadiens" },
      { id: "18", name: "Nashville Predators", short: "Predators" },
      { id: "1", name: "New Jersey Devils", short: "Devils" },
      { id: "2", name: "New York Islanders", short: "Islanders" },
      { id: "3", name: "New York Rangers", short: "Rangers" },
      { id: "9", name: "Ottawa Senators", short: "Senators" },
      { id: "4", name: "Philadelphia Flyers", short: "Flyers" },
      { id: "5", name: "Pittsburgh Penguins", short: "Penguins" },
      { id: "28", name: "San Jose Sharks", short: "Sharks" },
      { id: "55", name: "Seattle Kraken", short: "Kraken" },
      { id: "19", name: "St. Louis Blues", short: "Blues" },
      { id: "14", name: "Tampa Bay Lightning", short: "Lightning" },
      { id: "10", name: "Toronto Maple Leafs", short: "Maple Leafs" },
      { id: "23", name: "Vancouver Canucks", short: "Canucks" },
      { id: "54", name: "Vegas Golden Knights", short: "Golden Knights" },
      { id: "15", name: "Washington Capitals", short: "Capitals" },
      { id: "11", name: "Winnipeg Jets", short: "Jets" },
      { id: "53", name: "Arizona Coyotes", short: "Coyotes" },
    ];
    return nhlTeams.map((t) => ({
      id: `espn-nhl-team-${t.id}`,
      name: t.name,
      shortName: t.short,
      badge: espnTeamLogo("nhl", t.id),
      sport: "nhl" as Sport,
    }));
  }

  if (sport === "mlb") {
    const mlbTeams = [
      { id: "29", name: "Arizona Diamondbacks", short: "D-backs" },
      { id: "15", name: "Atlanta Braves", short: "Braves" },
      { id: "1", name: "Baltimore Orioles", short: "Orioles" },
      { id: "2", name: "Boston Red Sox", short: "Red Sox" },
      { id: "16", name: "Chicago Cubs", short: "Cubs" },
      { id: "4", name: "Chicago White Sox", short: "White Sox" },
      { id: "17", name: "Cincinnati Reds", short: "Reds" },
      { id: "5", name: "Cleveland Guardians", short: "Guardians" },
      { id: "27", name: "Colorado Rockies", short: "Rockies" },
      { id: "6", name: "Detroit Tigers", short: "Tigers" },
      { id: "18", name: "Houston Astros", short: "Astros" },
      { id: "7", name: "Kansas City Royals", short: "Royals" },
      { id: "3", name: "Los Angeles Angels", short: "Angels" },
      { id: "19", name: "Los Angeles Dodgers", short: "Dodgers" },
      { id: "28", name: "Miami Marlins", short: "Marlins" },
      { id: "8", name: "Milwaukee Brewers", short: "Brewers" },
      { id: "9", name: "Minnesota Twins", short: "Twins" },
      { id: "21", name: "New York Mets", short: "Mets" },
      { id: "10", name: "New York Yankees", short: "Yankees" },
      { id: "11", name: "Athletics", short: "Athletics" },
      { id: "22", name: "Philadelphia Phillies", short: "Phillies" },
      { id: "23", name: "Pittsburgh Pirates", short: "Pirates" },
      { id: "25", name: "San Diego Padres", short: "Padres" },
      { id: "26", name: "San Francisco Giants", short: "Giants" },
      { id: "12", name: "Seattle Mariners", short: "Mariners" },
      { id: "24", name: "St. Louis Cardinals", short: "Cardinals" },
      { id: "30", name: "Tampa Bay Rays", short: "Rays" },
      { id: "13", name: "Texas Rangers", short: "Rangers" },
      { id: "14", name: "Toronto Blue Jays", short: "Blue Jays" },
      { id: "20", name: "Washington Nationals", short: "Nationals" },
    ];
    return mlbTeams.map((t) => ({
      id: `espn-mlb-team-${t.id}`,
      name: t.name,
      shortName: t.short,
      badge: espnTeamLogo("mlb", t.id),
      sport: "mlb" as Sport,
    }));
  }

  return [];
}

/**
 * Fetch team detail from football-data.org (soccer) or ESPN (other sports)
 */
export async function getTeamDetail(teamId: string): Promise<TeamDetail | null> {
  // Handle ESPN team IDs: espn-{sport}-team-{id}
  if (teamId.startsWith("espn-")) {
    return getESPNTeamDetail(teamId);
  }

  // Only handle football-data IDs (fd-<number>)
  if (!teamId.startsWith("fd-")) return null;

  const fdId = teamId.replace("fd-", "");
  const cacheKey = `team:${fdId}`;
  const cached = cacheGet<TeamDetail>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${FD_BASE}/teams/${fdId}`, {
      headers: { "X-Auth-Token": FD_KEY },
    });

    if (!res.ok) return null;

    const data = await res.json();

    const detail: TeamDetail = {
      id: teamId,
      name: data.name,
      shortName: data.shortName || data.tla,
      badge: data.crest,
      sport: "soccer",
      venue: data.venue,
      coach: data.coach?.name,
      founded: data.founded,
      colors: data.clubColors,
      competitions: (data.runningCompetitions || []).map((c: { name: string }) => c.name),
      squad: (data.squad || []).map((p: {
        id: number;
        name: string;
        position: string;
        shirtNumber: number | null;
        nationality: string;
        dateOfBirth: string;
      }) => ({
        id: `fdp-${p.id}`,
        name: p.name,
        position: p.position || "Unknown",
        shirtNumber: p.shirtNumber,
        nationality: p.nationality,
        dateOfBirth: p.dateOfBirth,
      })),
    };

    cacheSet(cacheKey, detail, config.cache.teamTTL);
    return detail;
  } catch (err) {
    console.error("[team-service] Error fetching team:", err);
    return null;
  }
}

/**
 * Get team matches (recent + upcoming) from football-data.org
 */
export async function getTeamMatches(teamId: string): Promise<{
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  date: string;
  competition: string;
}[]> {
  // Handle ESPN team IDs
  if (teamId.startsWith("espn-")) {
    return getESPNTeamMatches(teamId);
  }

  if (!teamId.startsWith("fd-")) return [];

  const fdId = teamId.replace("fd-", "");
  const cacheKey = `team-matches:${fdId}`;
  const cached = cacheGet<ReturnType<typeof getTeamMatches> extends Promise<infer T> ? T : never>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`${FD_BASE}/teams/${fdId}/matches?status=SCHEDULED,LIVE,IN_PLAY,FINISHED&limit=10`, {
      headers: { "X-Auth-Token": FD_KEY },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const matches = (data.matches || []).map((m: {
      id: number;
      homeTeam: { id: number; name: string; shortName: string; crest: string };
      awayTeam: { id: number; name: string; shortName: string; crest: string };
      score: { fullTime: { home: number | null; away: number | null } };
      status: string;
      utcDate: string;
      competition: { name: string };
    }) => ({
      id: `fd-${m.id}`,
      homeTeam: {
        id: `fd-${m.homeTeam.id}`,
        name: m.homeTeam.name,
        shortName: m.homeTeam.shortName || m.homeTeam.name.slice(0, 3),
        badge: m.homeTeam.crest,
        sport: "soccer" as Sport,
      },
      awayTeam: {
        id: `fd-${m.awayTeam.id}`,
        name: m.awayTeam.name,
        shortName: m.awayTeam.shortName || m.awayTeam.name.slice(0, 3),
        badge: m.awayTeam.crest,
        sport: "soccer" as Sport,
      },
      homeScore: m.score?.fullTime?.home ?? null,
      awayScore: m.score?.fullTime?.away ?? null,
      status: m.status === "FINISHED" ? "finished" : m.status === "IN_PLAY" || m.status === "LIVE" ? "live" : "upcoming",
      date: m.utcDate,
      competition: m.competition?.name || "Unknown",
    }));

    cacheSet(cacheKey, matches, config.cache.matchesTTL);
    return matches;
  } catch (err) {
    console.error("[team-service] Error fetching team matches:", err);
    return [];
  }
}

/** Parse ESPN team ID: espn-{sport}-team-{id} */
function parseESPNTeamId(teamId: string): { sport: Sport; espnId: string } | null {
  const match = teamId.match(/^espn-(nba|nfl|nhl|mlb)-team-(\d+)$/);
  if (!match) return null;
  return { sport: match[1] as Sport, espnId: match[2] };
}

/** Fetch team detail from ESPN API */
async function getESPNTeamDetail(teamId: string): Promise<TeamDetail | null> {
  const parsed = parseESPNTeamId(teamId);
  if (!parsed) return null;

  const cacheKey = `team-espn:${teamId}`;
  const cached = cacheGet<TeamDetail>(cacheKey);
  if (cached) return cached;

  try {
    const path = ESPN_SPORT_PATHS[parsed.sport];
    const url = `https://site.api.espn.com/apis/site/v2/sports/${path}/teams/${parsed.espnId}`;
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) return null;

    const data = await res.json();
    const team = data.team;
    if (!team) return null;

    const detail: TeamDetail = {
      id: teamId,
      name: team.displayName,
      shortName: team.shortDisplayName || team.abbreviation,
      badge: team.logos?.[0]?.href ?? "",
      sport: parsed.sport,
      venue: team.franchise?.venue?.fullName,
      coach: undefined,
      founded: undefined,
      colors: team.color ? `#${team.color}` : undefined,
      competitions: [team.standingSummary ?? ""].filter(Boolean),
      squad: (team.athletes ?? []).slice(0, 30).map((p: {
        id: string;
        fullName: string;
        position: { abbreviation: string };
        jersey?: string;
      }) => ({
        id: `espn-p-${p.id}`,
        name: p.fullName,
        position: p.position?.abbreviation ?? "Unknown",
        shirtNumber: p.jersey ? parseInt(p.jersey, 10) : null,
      })),
    };

    cacheSet(cacheKey, detail, config.cache.teamTTL);
    return detail;
  } catch (err) {
    console.error("[team-service] ESPN team detail error:", err);
    return null;
  }
}

/** Fetch recent/upcoming matches for an ESPN team */
async function getESPNTeamMatches(teamId: string): Promise<{
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  date: string;
  competition: string;
}[]> {
  const parsed = parseESPNTeamId(teamId);
  if (!parsed) return [];

  const cacheKey = `team-matches-espn:${teamId}`;
  const cached = cacheGet<Awaited<ReturnType<typeof getESPNTeamMatches>>>(cacheKey);
  if (cached) return cached;

  try {
    const path = ESPN_SPORT_PATHS[parsed.sport];
    const url = `https://site.api.espn.com/apis/site/v2/sports/${path}/teams/${parsed.espnId}/schedule`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];

    const data = await res.json();
    const events = (data.events ?? []).slice(-10);

    const matches = events.map((ev: {
      id: string;
      date: string;
      name: string;
      competitions: {
        competitors: {
          id: string;
          team: { id: string; displayName: string; shortDisplayName: string; logos?: { href: string }[] };
          homeAway: string;
          score?: { value: number };
          winner?: boolean;
        }[];
        status: { type: { completed: boolean; description: string } };
      }[];
    }) => {
      const comp = ev.competitions?.[0];
      if (!comp) return null;

      const homeComp = comp.competitors?.find((c: { homeAway: string }) => c.homeAway === "home");
      const awayComp = comp.competitors?.find((c: { homeAway: string }) => c.homeAway === "away");
      if (!homeComp || !awayComp) return null;

      const isFinished = comp.status?.type?.completed ?? false;
      const statusDesc = comp.status?.type?.description ?? "";

      return {
        id: `espn-${parsed.sport}-${ev.id}`,
        homeTeam: {
          id: `espn-${parsed.sport}-team-${homeComp.team.id}`,
          name: homeComp.team.displayName,
          shortName: homeComp.team.shortDisplayName,
          badge: homeComp.team.logos?.[0]?.href ?? "",
          sport: parsed.sport,
        },
        awayTeam: {
          id: `espn-${parsed.sport}-team-${awayComp.team.id}`,
          name: awayComp.team.displayName,
          shortName: awayComp.team.shortDisplayName,
          badge: awayComp.team.logos?.[0]?.href ?? "",
          sport: parsed.sport,
        },
        homeScore: homeComp.score?.value ?? null,
        awayScore: awayComp.score?.value ?? null,
        status: isFinished ? "finished" : statusDesc === "In Progress" ? "live" : "upcoming",
        date: ev.date,
        competition: parsed.sport.toUpperCase(),
      };
    }).filter(Boolean);

    cacheSet(cacheKey, matches, config.cache.matchesTTL);
    return matches;
  } catch (err) {
    console.error("[team-service] ESPN team matches error:", err);
    return [];
  }
}
