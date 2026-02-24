import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserPreferences, saveUserPreferences } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const prefs = await getUserPreferences(session.user.id);
    return NextResponse.json({ preferences: prefs ?? { spoilerMode: false, defaultSport: "soccer" } });
  } catch {
    return NextResponse.json({
      preferences: { spoilerMode: false, defaultSport: "soccer" },
    });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    await saveUserPreferences(session.user.id, body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
}
