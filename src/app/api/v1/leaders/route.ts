import { NextRequest, NextResponse } from "next/server";
import { getLeaders } from "@/lib/api/espn";
import * as mock from "@/lib/services/mock-provider";

const VALID_SPORTS = new Set(["nba", "nfl", "nhl", "mlb"]);

export async function GET(request: NextRequest) {
  const sport = request.nextUrl.searchParams.get("sport");

  if (!sport || !VALID_SPORTS.has(sport)) {
    return NextResponse.json(
      { error: "Invalid sport. Use nba, nfl, nhl, or mlb" },
      { status: 400 }
    );
  }

  try {
    const data = mock.isMockMode()
      ? await mock.getLeaders(sport as "nba" | "nfl" | "nhl" | "mlb")
      : await getLeaders(sport as "nba" | "nfl" | "nhl" | "mlb");
    return NextResponse.json(data);
  } catch (err) {
    console.error("[API /leaders] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch leaders" },
      { status: 500 }
    );
  }
}
