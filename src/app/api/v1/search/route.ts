import { NextRequest, NextResponse } from "next/server";
import { getTeamsForSport, getSoccerTeamsForCompetition, SOCCER_LEAGUES } from "@/lib/services/team-service";
import * as mock from "@/lib/services/mock-provider";
import type { Sport } from "@/lib/types";

const SPORTS: Sport[] = ["soccer", "nba", "nfl", "nhl", "mlb"];

const LEAGUES_SEARCHABLE = [
  { id: "epl", name: "Premier League", sport: "soccer", href: "/standings/epl" },
  { id: "laliga", name: "La Liga", sport: "soccer", href: "/standings/laliga" },
  { id: "bundesliga", name: "Bundesliga", sport: "soccer", href: "/standings/bundesliga" },
  { id: "seriea", name: "Serie A", sport: "soccer", href: "/standings/seriea" },
  { id: "ligue1", name: "Ligue 1", sport: "soccer", href: "/standings/ligue1" },
  { id: "ucl", name: "Champions League", sport: "soccer", href: "/standings/ucl" },
  { id: "eredivisie", name: "Eredivisie", sport: "soccer", href: "/standings/eredivisie" },
  { id: "championship", name: "Championship", sport: "soccer", href: "/standings/championship" },
  { id: "ligapt", name: "Primeira Liga", sport: "soccer", href: "/standings/ligapt" },
  { id: "nba", name: "NBA", sport: "nba", href: "/scores/nba" },
  { id: "nfl", name: "NFL", sport: "nfl", href: "/scores/nfl" },
  { id: "nhl", name: "NHL", sport: "nhl", href: "/scores/nhl" },
  { id: "mlb", name: "MLB", sport: "mlb", href: "/scores/mlb" },
];

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").trim().toLowerCase();

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  // Mock mode: use mock search
  if (mock.isMockMode()) {
    const result = await mock.search(request.nextUrl.searchParams.get("q") ?? "");
    return NextResponse.json(result);
  }

  // Fetch teams from all sports in parallel
  const teamPromises = SPORTS.map(async (sport) => {
    if (sport === "soccer") {
      // Fetch from major leagues
      const leagues = ["PL", "PD", "BL1", "SA", "FL1", "CL"];
      const results = await Promise.all(leagues.map((l) => getSoccerTeamsForCompetition(l)));
      // Deduplicate by ID
      const seen = new Set<string>();
      const allTeams: { id: string; name: string; shortName: string; badge: string; sport: string }[] = [];
      for (const list of results) {
        for (const t of list) {
          if (!seen.has(t.id)) {
            seen.add(t.id);
            allTeams.push(t);
          }
        }
      }
      return allTeams;
    }
    return getTeamsForSport(sport);
  });

  const allTeamLists = await Promise.all(teamPromises);
  const allTeams = allTeamLists.flat();

  // Filter teams by query
  const matchedTeams = allTeams
    .filter((t) => t.name.toLowerCase().includes(q) || t.shortName.toLowerCase().includes(q))
    .slice(0, 8)
    .map((t) => ({
      type: "team" as const,
      id: t.id,
      name: t.name,
      shortName: t.shortName,
      badge: t.badge,
      sport: t.sport,
      href: `/team/${t.id}`,
    }));

  // Filter leagues by query
  const matchedLeagues = LEAGUES_SEARCHABLE
    .filter((l) => l.name.toLowerCase().includes(q) || l.id.toLowerCase().includes(q))
    .slice(0, 4)
    .map((l) => ({
      type: "league" as const,
      id: l.id,
      name: l.name,
      sport: l.sport,
      href: l.href,
    }));

  return NextResponse.json({ results: [...matchedLeagues, ...matchedTeams] });
}
