import { NextRequest, NextResponse } from "next/server";
import { getTeamsForSport, getSoccerTeamsForCompetition } from "@/lib/services/team-service";
import type { Sport } from "@/lib/types";

const validSports = new Set(["soccer", "nba", "nfl", "nhl", "mlb"]);

export async function GET(request: NextRequest) {
  const sport = request.nextUrl.searchParams.get("sport");
  const league = request.nextUrl.searchParams.get("league");

  if (!sport || !validSports.has(sport)) {
    return NextResponse.json({ error: "Invalid sport" }, { status: 400 });
  }

  if (sport === "soccer") {
    const code = league || "CL";
    const teams = await getSoccerTeamsForCompetition(code);
    return NextResponse.json({ teams });
  }

  const teams = await getTeamsForSport(sport as Sport);
  return NextResponse.json({ teams });
}
