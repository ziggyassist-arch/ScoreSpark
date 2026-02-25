import { config } from "@/lib/config";
import type {
  FDMatchesResponse,
  FDHead2HeadMatch,
  FDStandingsResponse,
  FDCompetitionsResponse,
} from "./types/football-data";

const BASE = config.footballData.baseUrl;

async function fdFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "X-Auth-Token": config.footballData.apiKey },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`football-data.org ${res.status}: ${text}`);
  }

  return res.json();
}

// Competitions available on free tier
export const FREE_TIER_COMPETITIONS = [
  { code: "PL", name: "Premier League", country: "England" },
  { code: "PD", name: "La Liga", country: "Spain" },
  { code: "BL1", name: "Bundesliga", country: "Germany" },
  { code: "SA", name: "Serie A", country: "Italy" },
  { code: "FL1", name: "Ligue 1", country: "France" },
  { code: "CL", name: "Champions League", country: "Europe" },
  { code: "DED", name: "Eredivisie", country: "Netherlands" },
  { code: "ELC", name: "Championship", country: "England" },
  { code: "PPL", name: "Primeira Liga", country: "Portugal" },
] as const;

export type CompetitionCode = (typeof FREE_TIER_COMPETITIONS)[number]["code"];

/**
 * Get matches for a date range, optionally filtered by competition
 */
export async function getMatches(params: {
  dateFrom?: string;
  dateTo?: string;
  competitions?: CompetitionCode[];
  status?: string;
}): Promise<FDMatchesResponse> {
  const searchParams = new URLSearchParams();
  if (params.dateFrom) searchParams.set("dateFrom", params.dateFrom);
  if (params.dateTo) searchParams.set("dateTo", params.dateTo);
  if (params.competitions?.length) {
    searchParams.set("competitions", params.competitions.join(","));
  }
  if (params.status) searchParams.set("status", params.status);

  const query = searchParams.toString();
  return fdFetch<FDMatchesResponse>(`/matches${query ? `?${query}` : ""}`);
}

/**
 * Get matches for a specific competition
 */
export async function getCompetitionMatches(
  competition: CompetitionCode,
  params?: { dateFrom?: string; dateTo?: string; matchday?: number; status?: string }
): Promise<FDMatchesResponse> {
  const searchParams = new URLSearchParams();
  if (params?.dateFrom) searchParams.set("dateFrom", params.dateFrom);
  if (params?.dateTo) searchParams.set("dateTo", params.dateTo);
  if (params?.matchday) searchParams.set("matchday", String(params.matchday));
  if (params?.status) searchParams.set("status", params.status);

  const query = searchParams.toString();
  return fdFetch<FDMatchesResponse>(
    `/competitions/${competition}/matches${query ? `?${query}` : ""}`
  );
}

/**
 * Get a single match by ID (includes goals, bookings, substitutions)
 */
export async function getMatchDetail(matchId: number): Promise<FDHead2HeadMatch> {
  return fdFetch<FDHead2HeadMatch>(`/matches/${matchId}`);
}

/**
 * Get standings for a competition
 */
export async function getStandings(competition: CompetitionCode): Promise<FDStandingsResponse> {
  return fdFetch<FDStandingsResponse>(`/competitions/${competition}/standings`);
}

/**
 * Get available competitions
 */
export async function getCompetitions(): Promise<FDCompetitionsResponse> {
  return fdFetch<FDCompetitionsResponse>("/competitions");
}

/** Top scorers response from football-data.org */
export interface FDScorersResponse {
  count: number;
  competition: { id: number; name: string; code: string; emblem: string };
  season: { id: number; startDate: string; endDate: string; currentMatchday: number };
  scorers: FDScorer[];
}

export interface FDScorer {
  player: {
    id: number;
    name: string;
    firstName: string | null;
    lastName: string | null;
    dateOfBirth: string | null;
    nationality: string | null;
    position: string | null;
  };
  team: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  playedMatches: number;
  goals: number;
  assists: number | null;
  penalties: number | null;
}

/**
 * Get top scorers for a competition
 */
export async function getTopScorers(
  competition: CompetitionCode,
  limit?: number
): Promise<FDScorersResponse> {
  const params = new URLSearchParams();
  if (limit) params.set("limit", String(limit));
  const query = params.toString();
  return fdFetch<FDScorersResponse>(
    `/competitions/${competition}/scorers${query ? `?${query}` : ""}`
  );
}
