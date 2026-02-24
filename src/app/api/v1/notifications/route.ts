import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  registerSubscription,
  removeSubscription,
  getSubscription,
} from "@/lib/services/notification-service";

/**
 * GET /api/v1/notifications — Get current notification preferences
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sub = getSubscription(session.user.id);
  return NextResponse.json({
    registered: !!sub,
    subscription: sub
      ? {
          platform: sub.platform,
          teams: sub.teams,
          preferences: sub.preferences,
        }
      : null,
  });
}

/**
 * POST /api/v1/notifications — Register/update push subscription
 * Body: { token, platform, teams, preferences }
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { token, platform, teams, preferences } = body;

    if (!token || !platform) {
      return NextResponse.json({ error: "token and platform required" }, { status: 400 });
    }

    registerSubscription({
      userId: session.user.id,
      endpoint: token,
      platform: platform ?? "web",
      token,
      teams: teams ?? [],
      preferences: {
        matchStart: preferences?.matchStart ?? true,
        goals: preferences?.goals ?? true,
        finalScore: preferences?.finalScore ?? true,
        redCards: preferences?.redCards ?? false,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

/**
 * DELETE /api/v1/notifications — Unregister push subscription
 */
export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  removeSubscription(session.user.id);
  return NextResponse.json({ success: true });
}
