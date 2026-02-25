import { NextRequest, NextResponse } from "next/server";
import { getInjuries } from "@/lib/api/espn";

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
    const data = await getInjuries(sport as "nba" | "nfl" | "nhl" | "mlb");
    return NextResponse.json(data);
  } catch (err) {
    console.error("[API /injuries] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch injuries" },
      { status: 500 }
    );
  }
}
