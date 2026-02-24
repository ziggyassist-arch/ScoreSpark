import { NextRequest, NextResponse } from "next/server";
import { addReaction, getCounts, PULSE_EMOJIS } from "@/lib/services/pulse-service";

/**
 * POST /api/v1/pulse — Submit a reaction
 * Body: { matchId: string, emoji: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { matchId, emoji } = body;

    if (!matchId || !emoji) {
      return NextResponse.json({ error: "matchId and emoji required" }, { status: 400 });
    }

    if (!PULSE_EMOJIS.includes(emoji)) {
      return NextResponse.json({ error: "Invalid emoji" }, { status: 400 });
    }

    addReaction(matchId, emoji);
    const counts = getCounts(matchId);

    return NextResponse.json({ success: true, counts });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

/**
 * GET /api/v1/pulse?matchId=xxx — Get current reaction counts
 */
export async function GET(request: NextRequest) {
  const matchId = request.nextUrl.searchParams.get("matchId");
  if (!matchId) {
    return NextResponse.json({ error: "matchId required" }, { status: 400 });
  }

  const counts = getCounts(matchId);
  return NextResponse.json({ counts });
}
