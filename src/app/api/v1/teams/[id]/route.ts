import { NextResponse } from "next/server";
import { getTeamDetail, getTeamMatches } from "@/lib/services/team-service";
import * as mock from "@/lib/services/mock-provider";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const team = mock.isMockMode()
    ? await mock.getTeamDetail(id)
    : await getTeamDetail(id);

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  const matches = mock.isMockMode()
    ? await mock.getTeamMatches(id)
    : await getTeamMatches(id);

  return NextResponse.json({ team, matches });
}
