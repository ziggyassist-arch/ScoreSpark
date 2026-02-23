import { NextResponse } from "next/server";
import { FREE_TIER_COMPETITIONS } from "@/lib/api/football-data";

export async function GET() {
  const competitions = FREE_TIER_COMPETITIONS.map((c) => ({
    code: c.code,
    name: c.name,
    country: c.country,
    sport: "soccer" as const,
  }));

  return NextResponse.json({ competitions });
}
