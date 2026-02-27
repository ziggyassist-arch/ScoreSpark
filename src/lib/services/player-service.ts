import { config } from "@/lib/config";
import { cacheGet, cacheSet } from "./cache";
import type { Sport } from "@/lib/types";

export interface PlayerProfile {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  position: string;
  nationality?: string;
  dateOfBirth?: string;
  age?: number;
  jersey?: string;
  height?: string;
  weight?: string;
  photo?: string;
  team: {
    id: string;
    name: string;
    badge: string;
    sport: Sport;
  };
  stats: PlayerStat[];
  sport: Sport;
}

export interface PlayerStat {
  label: string;
  value: string;
}

const ESPN_SPORT_PATHS: Record<string, string> = {
  nba: "basketball/nba",
  nfl: "football/nfl",
  nhl: "hockey/nhl",
  mlb: "baseball/mlb",
  soccer: "soccer",
};

/**
 * Fetch soccer player from football-data.org
 */
async function fetchSoccerPlayer(id: number): Promise<PlayerProfile | null> {
  const cacheKey = `player:soccer:${id}`;
  const cached = cacheGet<PlayerProfile>(cacheKey);
  if (cached) return cached;

  try {
    const resp = await fetch(`https://api.football-data.org/v4/persons/${id}`, {
      headers: { "X-Auth-Token": config.footballData.apiKey },
    });
    if (!resp.ok) return null;

    const data = await resp.json();
    const dob = data.dateOfBirth;
    const age = dob
      ? Math.floor((Date.now() - new Date(dob).getTime()) / 31557600000)
      : undefined;

    const team = data.currentTeam;

    const profile: PlayerProfile = {
      id: `fd-player-${id}`,
      name: data.name,
      firstName: data.firstName ?? data.name.split(" ")[0],
      lastName: data.lastName ?? data.name.split(" ").slice(1).join(" "),
      position: data.position ?? "Unknown",
      nationality: data.nationality,
      dateOfBirth: dob,
      age,
      jersey: data.shirtNumber?.toString(),
      team: team
        ? {
            id: `fd-${team.id}`,
            name: team.name ?? "Unknown",
            badge: `https://crests.football-data.org/${team.id}.png`,
            sport: "soccer",
          }
        : { id: "", name: "Unknown", badge: "", sport: "soccer" },
      stats: [],
      sport: "soccer",
    };

    cacheSet(cacheKey, profile, 3600_000); // 1 hour
    return profile;
  } catch (err) {
    console.error("[player-service] football-data error:", err);
    return null;
  }
}

/**
 * Fetch ESPN player (NBA, NFL, NHL, MLB)
 */
async function fetchESPNPlayer(
  sport: "nba" | "nfl" | "nhl" | "mlb" | "soccer",
  espnId: string
): Promise<PlayerProfile | null> {
  const cacheKey = `player:${sport}:${espnId}`;
  const cached = cacheGet<PlayerProfile>(cacheKey);
  if (cached) return cached;

  const path = ESPN_SPORT_PATHS[sport];

  try {
    // Fetch athlete basic info
    const [infoResp, overviewResp] = await Promise.all([
      fetch(`https://site.api.espn.com/apis/common/v3/sports/${path}/athletes/${espnId}`),
      fetch(`https://site.api.espn.com/apis/common/v3/sports/${path}/athletes/${espnId}/overview`),
    ]);

    if (!infoResp.ok) return null;

    const info = await infoResp.json();
    const athlete = info.athlete;

    // Parse stats from overview
    let stats: PlayerStat[] = [];
    if (overviewResp.ok) {
      const overview = await overviewResp.json();
      const statsData = overview.statistics;
      if (statsData?.labels && statsData?.splits?.length) {
        const regularSeason = statsData.splits.find(
          (s: Record<string, unknown>) =>
            (s.displayName as string)?.includes("Regular") ||
            (s.displayName as string)?.includes("Season")
        ) ?? statsData.splits[0];

        if (regularSeason?.stats) {
          const labels = statsData.labels as string[];
          const values = regularSeason.stats as string[];
          stats = labels.map((label: string, i: number) => ({
            label,
            value: values[i] ?? "—",
          }));
        }
      }
    }

    const team = athlete.team;
    const dob = athlete.dateOfBirth;
    const age = athlete.age ?? (dob
      ? Math.floor((Date.now() - new Date(dob).getTime()) / 31557600000)
      : undefined);

    const profile: PlayerProfile = {
      id: `espn-${sport}-player-${espnId}`,
      name: athlete.displayName,
      firstName: athlete.firstName ?? athlete.displayName.split(" ")[0],
      lastName: athlete.lastName ?? athlete.displayName.split(" ").slice(1).join(" "),
      position: athlete.position?.displayName ?? athlete.position?.abbreviation ?? "Unknown",
      nationality: athlete.birthPlace
        ? `${athlete.birthPlace.city ?? ""}${athlete.birthPlace.state ? `, ${athlete.birthPlace.state}` : ""}${athlete.birthPlace.country ? `, ${athlete.birthPlace.country}` : ""}`
        : undefined,
      dateOfBirth: dob,
      age,
      jersey: athlete.jersey,
      height: athlete.displayHeight,
      weight: athlete.displayWeight,
      photo: athlete.headshot?.href,
      team: team
        ? {
            id: `espn-${sport}-${team.id}`,
            name: team.displayName ?? team.name ?? "Unknown",
            badge: team.logo ?? `https://a.espncdn.com/i/teamlogos/${sport}/500/${(team.abbreviation ?? "").toLowerCase()}.png`,
            sport,
          }
        : { id: "", name: "Unknown", badge: "", sport },
      stats,
      sport,
    };

    cacheSet(cacheKey, profile, 3600_000);
    return profile;
  } catch (err) {
    console.error(`[player-service] ESPN ${sport} error:`, err);
    return null;
  }
}

/**
 * Get player profile by ID.
 * ID format: fd-player-{id} for soccer, espn-{sport}-player-{id} for American sports
 */
export async function getPlayerProfile(
  playerId: string
): Promise<PlayerProfile | null> {
  if (playerId.startsWith("fd-player-")) {
    const fdId = parseInt(playerId.replace("fd-player-", ""), 10);
    if (isNaN(fdId)) return null;
    return fetchSoccerPlayer(fdId);
  }

  // fdp-{id} format (from team squad listings)
  if (playerId.startsWith("fdp-")) {
    const fdId = parseInt(playerId.replace("fdp-", ""), 10);
    if (isNaN(fdId)) return null;
    return fetchSoccerPlayer(fdId);
  }

  // espn-{sport}-player-{id}
  const espnMatch = playerId.match(/^espn-(nba|nfl|nhl|mlb|soccer)-player-(\d+)$/);
  if (espnMatch) {
    const sport = espnMatch[1];
    const id = espnMatch[2];
    return fetchESPNPlayer(sport as "nba" | "nfl" | "nhl" | "mlb" | "soccer", id);
  }

  return null;
}
