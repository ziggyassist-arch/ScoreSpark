import { NextRequest, NextResponse } from "next/server";
import { getMatchDetailById } from "@/lib/services/match-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const result = await getMatchDetailById(id);
    if (!result) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[API /matches/:id] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch match detail" },
      { status: 500 }
    );
  }
}
