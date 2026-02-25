import { NextRequest, NextResponse } from "next/server";
import { getHead2Head } from "@/lib/api/football-data";

export async function GET(request: NextRequest) {
  const matchIdParam = request.nextUrl.searchParams.get("matchId");

  if (!matchIdParam) {
    return NextResponse.json(
      { error: "matchId is required" },
      { status: 400 }
    );
  }

  const matchId = parseInt(matchIdParam, 10);
  if (isNaN(matchId)) {
    return NextResponse.json(
      { error: "matchId must be a number" },
      { status: 400 }
    );
  }

  try {
    const data = await getHead2Head(matchId, 10);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[API /h2h] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch head-to-head data" },
      { status: 500 }
    );
  }
}
