import { NextRequest, NextResponse } from "next/server";
import { getESPNStandings } from "@/lib/api/espn";

const VALID_SPORTS = new Set(["nba", "nfl", "nhl", "mlb"]);

export interface PlayoffTeam {
  seed: number;
  name: string;
  abbreviation: string;
  logo: string;
  wins: number;
  losses: number;
  conference: string;
}

export interface PlayoffBracketData {
  sport: string;
  season: string;
  conferences: {
    name: string;
    teams: PlayoffTeam[];
  }[];
}

function extractStat(
  stats: { name: string; value?: number; displayValue: string }[],
  name: string
): number {
  return stats.find((s) => s.name === name)?.value ?? 0;
}

export async function GET(request: NextRequest) {
  const sport = request.nextUrl.searchParams.get("sport");

  if (!sport || !VALID_SPORTS.has(sport)) {
    return NextResponse.json(
      { error: "Invalid sport. Use nba, nfl, nhl, or mlb" },
      { status: 400 }
    );
  }

  try {
    const standings = await getESPNStandings(sport as "nba" | "nfl" | "nhl" | "mlb");

    const conferences = standings.children.map((conf) => {
      // Flatten divisions if present
      const entries =
        conf.standings?.entries ??
        conf.children?.flatMap((d) => d.standings.entries) ??
        [];

      // Sort by wins descending, then by win% or points
      const sorted = [...entries].sort((a, b) => {
        const aWins = extractStat(a.stats, "wins");
        const bWins = extractStat(b.stats, "wins");
        const aLosses = extractStat(a.stats, "losses");
        const bLosses = extractStat(b.stats, "losses");
        // Sort by win percentage
        const aWinPct = aWins / Math.max(aWins + aLosses, 1);
        const bWinPct = bWins / Math.max(bWins + bLosses, 1);
        return bWinPct - aWinPct;
      });

      const teams: PlayoffTeam[] = sorted.map((entry, i) => ({
        seed: i + 1,
        name: entry.team.displayName,
        abbreviation: entry.team.abbreviation,
        logo: entry.team.logo ?? "",
        wins: extractStat(entry.stats, "wins"),
        losses: extractStat(entry.stats, "losses"),
        conference: conf.name,
      }));

      return {
        name: conf.name,
        teams,
      };
    });

    const year = new Date().getFullYear();
    const result: PlayoffBracketData = {
      sport,
      season: `${year - 1}-${year}`,
      conferences,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("[API /playoffs] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch playoff bracket data" },
      { status: 500 }
    );
  }
}
