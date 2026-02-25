import { NextRequest, NextResponse } from "next/server";
import { getESPNEventSummary } from "@/lib/api/espn";

const SPORT_PATHS: Record<string, { sport: string; league: string }> = {
  nfl: { sport: "football", league: "nfl" },
  nba: { sport: "basketball", league: "nba" },
  nhl: { sport: "hockey", league: "nhl" },
  mlb: { sport: "baseball", league: "mlb" },
};

export async function GET(request: NextRequest) {
  const sport = request.nextUrl.searchParams.get("sport");
  const eventId = request.nextUrl.searchParams.get("eventId");

  if (!sport || !eventId || !SPORT_PATHS[sport]) {
    return NextResponse.json(
      { error: "sport and eventId are required. sport must be nfl, nba, nhl, or mlb." },
      { status: 400 }
    );
  }

  const paths = SPORT_PATHS[sport];

  try {
    const data = await getESPNEventSummary(paths.sport, paths.league, eventId);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[API /summary] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch event summary" },
      { status: 500 }
    );
  }
}
