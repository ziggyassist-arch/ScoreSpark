import { NextRequest, NextResponse } from "next/server";

const VALID_SPORTS = new Set(["nba", "nfl", "nhl", "mlb"]);

const SPORT_PATHS: Record<string, { sport: string; league: string }> = {
  nfl: { sport: "football", league: "nfl" },
  nba: { sport: "basketball", league: "nba" },
  nhl: { sport: "hockey", league: "nhl" },
  mlb: { sport: "baseball", league: "mlb" },
};

export async function GET(request: NextRequest) {
  const sport = request.nextUrl.searchParams.get("sport");

  if (!sport || !VALID_SPORTS.has(sport)) {
    return NextResponse.json(
      { error: "Invalid sport. Use nba, nfl, nhl, or mlb" },
      { status: 400 }
    );
  }

  const paths = SPORT_PATHS[sport];
  const url = `https://site.api.espn.com/apis/site/v2/sports/${paths.sport}/${paths.league}/transactions?limit=50`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 120 },
    });

    if (!res.ok) {
      throw new Error(`ESPN API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[API /transactions] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
