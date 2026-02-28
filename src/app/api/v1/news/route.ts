import { NextRequest, NextResponse } from "next/server";
import { getNewsForSport } from "@/lib/services/news-service";
import * as mock from "@/lib/services/mock-provider";
import type { Sport } from "@/lib/types";

const VALID_SPORTS = new Set(["soccer", "nba", "nfl", "nhl", "mlb"]);

export async function GET(request: NextRequest) {
  const sport = request.nextUrl.searchParams.get("sport") ?? "soccer";

  if (!VALID_SPORTS.has(sport)) {
    return NextResponse.json({ error: "Invalid sport" }, { status: 400 });
  }

  try {
    const articles = mock.isMockMode()
      ? await mock.getNewsForSport(sport as Sport)
      : await getNewsForSport(sport as Sport);
    return NextResponse.json({ articles });
  } catch (err) {
    console.error("[API /news] error:", err);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
