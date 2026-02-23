import { NextResponse } from "next/server";
import { getTeamDetail, getTeamMatches } from "@/lib/services/team-service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const team = await getTeamDetail(id);

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  const matches = await getTeamMatches(id);

  return NextResponse.json({ team, matches });
}
