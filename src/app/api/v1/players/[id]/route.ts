import { NextRequest, NextResponse } from "next/server";
import { getPlayerProfile } from "@/lib/services/player-service";
import * as mock from "@/lib/services/mock-provider";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const player = mock.isMockMode()
      ? await mock.getPlayerProfile(id)
      : await getPlayerProfile(id);
    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }
    return NextResponse.json(player);
  } catch (err) {
    console.error("[API /players/:id] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch player" },
      { status: 500 }
    );
  }
}
