import { NextRequest, NextResponse } from "next/server";

const ESPN_BASE = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams";

export async function GET(request: NextRequest) {
  const teamId = request.nextUrl.searchParams.get("teamId");

  if (!teamId) {
    return NextResponse.json(
      { error: "Missing teamId parameter" },
      { status: 400 }
    );
  }

  try {
    const url = `${ESPN_BASE}/${teamId}/depthcharts`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 }, // cache for 5 minutes
    });

    if (!res.ok) {
      throw new Error(`ESPN API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[API /depth-chart] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch depth chart" },
      { status: 500 }
    );
  }
}
