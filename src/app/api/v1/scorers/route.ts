import { NextRequest, NextResponse } from "next/server";
import { getTopScorers, FREE_TIER_COMPETITIONS } from "@/lib/api/football-data";
import type { CompetitionCode } from "@/lib/api/football-data";

const VALID_COMPETITIONS = new Set<string>(FREE_TIER_COMPETITIONS.map((c) => c.code));

export async function GET(request: NextRequest) {
  const competition = request.nextUrl.searchParams.get("competition");

  if (!competition || !VALID_COMPETITIONS.has(competition)) {
    return NextResponse.json(
      { error: `Invalid competition. Use one of: ${FREE_TIER_COMPETITIONS.map((c) => c.code).join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const data = await getTopScorers(competition as CompetitionCode, 25);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[API /scorers] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch top scorers" },
      { status: 500 }
    );
  }
}
