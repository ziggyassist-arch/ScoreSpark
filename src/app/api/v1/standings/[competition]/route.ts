import { NextRequest, NextResponse } from "next/server";
import { getStandingsForLeague } from "@/lib/services/standings-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ competition: string }> }
) {
  const { competition } = await params;

  try {
    const result = await getStandingsForLeague(competition);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[API /standings/:competition] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch standings" },
      { status: 500 }
    );
  }
}
