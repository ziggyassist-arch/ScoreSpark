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

/**
 * Fetch soccer team detail from football-data.org
 */
export async function getTeamDetail(teamId: string): Promise<TeamDetail | null> {
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
