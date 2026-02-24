import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserFavorites, addFavorite, removeFavorite } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const favorites = await getUserFavorites(session.user.id);
    return NextResponse.json({ favorites });
  } catch {
    // DB not configured yet — return empty
    return NextResponse.json({ favorites: [] });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { teamId, sport, action } = body;

    if (!teamId) {
      return NextResponse.json({ error: "teamId required" }, { status: 400 });
    }

    if (action === "remove") {
      await removeFavorite(session.user.id, teamId);
    } else {
      await addFavorite(session.user.id, teamId, sport ?? "soccer");
    }

    const favorites = await getUserFavorites(session.user.id);
    return NextResponse.json({ favorites });
  } catch {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
}
