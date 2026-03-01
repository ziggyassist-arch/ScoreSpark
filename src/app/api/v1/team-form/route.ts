import { NextRequest, NextResponse } from "next/server";

const ESPN_SPORT_MAP: Record<string, string> = {
  soccer: "soccer",
  nba: "basketball/nba",
  nfl: "football/nfl",
  nhl: "hockey/nhl",
  mlb: "baseball/mlb",
};

const ESPN_SOCCER_LEAGUES = [
  "eng.1", "usa.1", "esp.1", "ger.1", "ita.1", "fra.1",
  "mex.1", "uefa.champions", "uefa.europa",
];

export async function GET(req: NextRequest) {
  const teamId = req.nextUrl.searchParams.get("teamId");
  const sport = req.nextUrl.searchParams.get("sport") || "soccer";

  if (!teamId) {
    return NextResponse.json({ error: "teamId required" }, { status: 400 });
  }

  // Parse ESPN team ID
  const espnMatch = teamId.match(/^espn-(\w+)-(?:team-)?(\d+)$/);
  if (!espnMatch) {
    return NextResponse.json({ matches: [] });
  }

  const [, , espnId] = espnMatch;
  const espnSport = ESPN_SPORT_MAP[sport] || "soccer";

  try {
    if (sport === "soccer") {
      // Try each league to find recent results
      for (const league of ESPN_SOCCER_LEAGUES) {
        const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${league}/teams/${espnId}/schedule`;
        const res = await fetch(url, { next: { revalidate: 300 } });
        if (!res.ok) continue;

        const data = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const events = data.events || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const completed = events.filter((e: any) => e.competitions?.[0]?.status?.type?.completed);

        if (completed.length === 0) continue;

        // Get last 5 completed matches
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const recent = completed.slice(-5).reverse().map((e: any) => {
          const comp = e.competitions[0];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const homeTeam = comp.competitors?.find((c: any) => c.homeAway === "home");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const awayTeam = comp.competitors?.find((c: any) => c.homeAway === "away");

          const isHome = homeTeam?.id === espnId;
          const us = isHome ? homeTeam : awayTeam;
          const them = isHome ? awayTeam : homeTeam;
          const ourScore = parseInt(us?.score || "0");
          const theirScore = parseInt(them?.score || "0");

          let result: "W" | "D" | "L" = "D";
          if (ourScore > theirScore) result = "W";
          else if (ourScore < theirScore) result = "L";

          return {
            id: `espn-soccer-${e.id}`,
            opponent: them?.team?.shortDisplayName || them?.team?.displayName || "Unknown",
            score: isHome ? `${ourScore} - ${theirScore}` : `${theirScore} - ${ourScore}`,
            result,
            isHome,
          };
        });

        return NextResponse.json({ matches: recent });
      }
    } else {
      // American sports
      const url = `https://site.api.espn.com/apis/site/v2/sports/${espnSport}/teams/${espnId}/schedule`;
      const res = await fetch(url, { next: { revalidate: 300 } });
      if (res.ok) {
        const data = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const events = data.events || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const completed = events.filter((e: any) => e.competitions?.[0]?.status?.type?.completed);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const recent = completed.slice(-5).reverse().map((e: any) => {
          const comp = e.competitions[0];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const homeTeam = comp.competitors?.find((c: any) => c.homeAway === "home");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const awayTeam = comp.competitors?.find((c: any) => c.homeAway === "away");
          const isHome = homeTeam?.id === espnId;
          const us = isHome ? homeTeam : awayTeam;
          const them = isHome ? awayTeam : homeTeam;
          const ourScore = parseInt(us?.score || "0");
          const theirScore = parseInt(them?.score || "0");
          let result: "W" | "D" | "L" = "D";
          if (ourScore > theirScore) result = "W";
          else if (ourScore < theirScore) result = "L";
          return {
            id: `espn-${sport}-${e.id}`,
            opponent: them?.team?.shortDisplayName || "Unknown",
            score: isHome ? `${ourScore} - ${theirScore}` : `${theirScore} - ${ourScore}`,
            result,
            isHome,
          };
        });
        return NextResponse.json({ matches: recent });
      }
    }

    return NextResponse.json({ matches: [] });
  } catch (err) {
    console.error("[team-form] error:", err);
    return NextResponse.json({ matches: [] });
  }
}
