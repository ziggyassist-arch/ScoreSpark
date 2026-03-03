import { notFound } from "next/navigation";
import Link from "next/link";
import LeaguePageClient from "./LeaguePageClient";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return { title: "League — ScoreSpark" };
}

const LEAGUE_MAP: Record<string, { name: string; espnSlug: string; sport: string }> = {
  // Friendly slugs
  "epl": { name: "Premier League", espnSlug: "eng.1", sport: "soccer" },
  "laliga": { name: "LaLiga", espnSlug: "esp.1", sport: "soccer" },
  "bundesliga": { name: "Bundesliga", espnSlug: "ger.1", sport: "soccer" },
  "serie-a": { name: "Serie A", espnSlug: "ita.1", sport: "soccer" },
  "ligue-1": { name: "Ligue 1", espnSlug: "fra.1", sport: "soccer" },
  "mls": { name: "MLS", espnSlug: "usa.1", sport: "soccer" },
  "liga-mx": { name: "Liga MX", espnSlug: "mex.1", sport: "soccer" },
  "champions-league": { name: "Champions League", espnSlug: "uefa.champions", sport: "soccer" },
  "europa-league": { name: "Europa League", espnSlug: "uefa.europa", sport: "soccer" },
  // ESPN slug aliases (so /league/eng.1 works)
  "eng.1": { name: "Premier League", espnSlug: "eng.1", sport: "soccer" },
  "esp.1": { name: "LaLiga", espnSlug: "esp.1", sport: "soccer" },
  "ger.1": { name: "Bundesliga", espnSlug: "ger.1", sport: "soccer" },
  "ita.1": { name: "Serie A", espnSlug: "ita.1", sport: "soccer" },
  "fra.1": { name: "Ligue 1", espnSlug: "fra.1", sport: "soccer" },
  "usa.1": { name: "MLS", espnSlug: "usa.1", sport: "soccer" },
  "mex.1": { name: "Liga MX", espnSlug: "mex.1", sport: "soccer" },
  "uefa.champions": { name: "Champions League", espnSlug: "uefa.champions", sport: "soccer" },
  "uefa.europa": { name: "Europa League", espnSlug: "uefa.europa", sport: "soccer" },
  // Additional leagues
  "eng.2": { name: "Championship", espnSlug: "eng.2", sport: "soccer" },
  "ned.1": { name: "Eredivisie", espnSlug: "ned.1", sport: "soccer" },
  "por.1": { name: "Primeira Liga", espnSlug: "por.1", sport: "soccer" },
  "bra.1": { name: "Brasileirão", espnSlug: "bra.1", sport: "soccer" },
  "arg.1": { name: "Liga Profesional", espnSlug: "arg.1", sport: "soccer" },
  "tur.1": { name: "Süper Lig", espnSlug: "tur.1", sport: "soccer" },
  "sco.1": { name: "Scottish Premiership", espnSlug: "sco.1", sport: "soccer" },
  "rus.1": { name: "Russian Premier League", espnSlug: "rus.1", sport: "soccer" },
};

async function fetchLeagueData(espnSlug: string) {
  const base = "https://site.api.espn.com/apis/site/v2/sports/soccer";
  const webBase = "https://site.web.api.espn.com/apis/v2/sports/soccer";
  
  const [standingsRes, scoresRes] = await Promise.all([
    fetch(`${webBase}/${espnSlug}/standings`, { next: { revalidate: 300 } }).catch(() =>
      fetch(`${base}/${espnSlug}/standings`, { next: { revalidate: 300 } })
    ),
    fetch(`${base}/${espnSlug}/scoreboard`, { next: { revalidate: 120 } }),
  ]);

  let standings: { name: string; id: string; badge: string; played: number; won: number; drawn: number; lost: number; gf: number; ga: number; gd: number; points: number }[] = [];
  let matches: { id: string; homeTeam: string; awayTeam: string; homeBadge: string; awayBadge: string; homeScore: number | null; awayScore: number | null; status: string; date: string; homeId: string; awayId: string }[] = [];

  if (standingsRes.ok) {
    const data = await standingsRes.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entries = data.children?.[0]?.standings?.entries || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    standings = entries.map((e: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const getStat = (name: string) => e.stats?.find((s: any) => s.name === name)?.value ?? 0;
      return {
        name: e.team?.displayName || "Unknown",
        id: `espn-soccer-${e.team?.id}`,
        badge: e.team?.logos?.[0]?.href || "",
        played: getStat("gamesPlayed"),
        won: getStat("wins"),
        drawn: getStat("ties"),
        lost: getStat("losses"),
        gf: getStat("pointsFor"),
        ga: getStat("pointsAgainst"),
        gd: getStat("pointDifferential"),
        points: getStat("points"),
      };
    }).sort((a: { points: number; gd: number }, b: { points: number; gd: number }) => b.points - a.points || b.gd - a.gd);
  }

  if (scoresRes.ok) {
    const data = await scoresRes.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    matches = (data.events || []).map((e: any) => {
      const comp = e.competitions?.[0];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const home = comp?.competitors?.find((c: any) => c.homeAway === "home");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const away = comp?.competitors?.find((c: any) => c.homeAway === "away");
      const isCompleted = comp?.status?.type?.completed;
      const isLive = comp?.status?.type?.state === "in";
      return {
        id: `espn-soccer-${e.id}`,
        homeTeam: home?.team?.shortDisplayName || "TBD",
        awayTeam: away?.team?.shortDisplayName || "TBD",
        homeBadge: home?.team?.logo || "",
        awayBadge: away?.team?.logo || "",
        homeScore: isCompleted || isLive ? parseInt(home?.score || "0") : null,
        awayScore: isCompleted || isLive ? parseInt(away?.score || "0") : null,
        status: isCompleted ? "FT" : isLive ? "LIVE" : new Date(comp?.date).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }),
        date: comp?.date || e.date,
        homeId: `espn-soccer-${home?.id}`,
        awayId: `espn-soccer-${away?.id}`,
      };
    });
  }

  return { standings, matches };
}

export default async function LeaguePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Try exact match first, then treat the id as an ESPN slug directly
  const league = LEAGUE_MAP[id] ?? { name: id.replace(/\./g, " ").replace(/\b\w/g, c => c.toUpperCase()), espnSlug: id, sport: "soccer" };

  const { standings, matches } = await fetchLeagueData(league.espnSlug);

  return (
    <div className="animate-slide-up">
      <Link
        href="/scores/soccer"
        className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Soccer
      </Link>

      <LeaguePageClient
        leagueId={id}
        leagueName={league.name}
        standings={standings}
        matches={matches}
      />
    </div>
  );
}
