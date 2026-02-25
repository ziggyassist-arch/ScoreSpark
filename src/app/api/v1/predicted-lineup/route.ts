import { NextRequest, NextResponse } from "next/server";
import { getPredictedLineups } from "@/lib/services/predicted-lineup-service";

/**
 * GET /api/v1/predicted-lineup?homeTeamId=123&awayTeamId=456
 * Returns predicted starting XIs for both teams based on squad data.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const homeTeamId = parseInt(searchParams.get("homeTeamId") ?? "", 10);
  const awayTeamId = parseInt(searchParams.get("awayTeamId") ?? "", 10);

  if (isNaN(homeTeamId) || isNaN(awayTeamId)) {
    return NextResponse.json(
      { error: "homeTeamId and awayTeamId are required" },
      { status: 400 }
    );
  }

  const result = await getPredictedLineups(homeTeamId, awayTeamId);
  if (!result) {
    return NextResponse.json(
      { error: "Unable to generate predicted lineups" },
      { status: 404 }
    );
  }

  return NextResponse.json(result);
}
