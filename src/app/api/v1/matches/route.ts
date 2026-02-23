import { NextRequest, NextResponse } from "next/server";
import { getAllMatches, getMatchesForSport } from "@/lib/services/match-service";
import type { Sport } from "@/lib/types";

const VALID_SPORTS = new Set(["soccer", "nba", "nfl", "nhl", "mlb"]);

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sport = searchParams.get("sport");
  const date = searchParams.get("date") ?? undefined;
  const status = searchParams.get("status") ?? undefined;

  try {
    let matches;
    if (sport && VALID_SPORTS.has(sport)) {
      matches = await getMatchesForSport(sport as Sport, date);
    } else {
      matches = await getAllMatches(date);
    }

    // Optional status filter
    if (status) {
      matches = matches.filter((m) => m.status === status);
    }

    return NextResponse.json({ matches, count: matches.length });
  } catch (err) {
    console.error("[API /matches] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}
