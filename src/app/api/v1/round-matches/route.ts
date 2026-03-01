import { NextRequest, NextResponse } from "next/server";

const LEAGUE_SLUGS: Record<string, string> = {
  "Premier League": "eng.1",
  "LaLiga": "esp.1",
  "Bundesliga": "ger.1",
  "Serie A": "ita.1",
  "Ligue 1": "fra.1",
  "MLS": "usa.1",
  "Liga MX": "mex.1",
  "Champions League": "uefa.champions",
  "Europa League": "uefa.europa",
  "FA Cup": "eng.fa",
  "Copa del Rey": "esp.copa_del_rey",
  "DFB Pokal": "ger.dfb_pokal",
};

export async function GET(req: NextRequest) {
  const league = req.nextUrl.searchParams.get("league");
  const matchId = req.nextUrl.searchParams.get("matchId");

  if (!league) {
    return NextResponse.json({ matches: [] });
  }

  // Find ESPN slug
  const slug = LEAGUE_SLUGS[league] || Object.entries(LEAGUE_SLUGS).find(([k]) => league.includes(k))?.[1];
  if (!slug) {
    return NextResponse.json({ matches: [] });
  }

  try {
    const res = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/soccer/${slug}/scoreboard`,
      { next: { revalidate: 120 } }
    );
    if (!res.ok) return NextResponse.json({ matches: [] });

    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const matches = (data.events || []).map((e: any) => {
      const comp = e.competitions?.[0];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const home = comp?.competitors?.find((c: any) => c.homeAway === "home");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const away = comp?.competitors?.find((c: any) => c.homeAway === "away");
      const completed = comp?.status?.type?.completed;
      const live = comp?.status?.type?.state === "in";
      return {
        id: `espn-soccer-${e.id}`,
        homeTeam: home?.team?.shortDisplayName || "TBD",
        awayTeam: away?.team?.shortDisplayName || "TBD",
        homeBadge: home?.team?.logo || "",
        awayBadge: away?.team?.logo || "",
        homeScore: completed || live ? parseInt(home?.score || "0") : null,
        awayScore: completed || live ? parseInt(away?.score || "0") : null,
        status: completed ? "FT" : live ? "LIVE" : new Date(comp?.date).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).filter((m: any) => m.id !== matchId); // Exclude current match

    return NextResponse.json({ matches });
  } catch {
    return NextResponse.json({ matches: [] });
  }
}
