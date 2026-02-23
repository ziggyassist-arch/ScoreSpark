import { notFound } from "next/navigation";
import { getMatchesForSport } from "@/lib/services/match-service";
import type { Sport } from "@/lib/types";
import SportSwitcher from "@/components/SportSwitcher";
import LeagueBar from "@/components/LeagueBar";
import LiveMatchList from "@/components/LiveMatchList";

const sportLabels: Record<Sport, string> = {
  soccer: "Soccer",
  nba: "NBA",
  nfl: "NFL",
  nhl: "NHL",
  mlb: "MLB",
};

const validSports = new Set<string>(["soccer", "nba", "nfl", "nhl", "mlb"]);

export function generateStaticParams() {
  return [{ sport: "soccer" }, { sport: "nba" }, { sport: "nfl" }, { sport: "nhl" }, { sport: "mlb" }];
}

export function generateMetadata() {
  return { title: "Scores — ScoreSpark" };
}

export const dynamic = "force-dynamic";

export default async function SportScoresPage({
  params,
}: {
  params: Promise<{ sport: string }>;
}) {
  const { sport } = await params;

  if (!validSports.has(sport)) {
    notFound();
  }

  const matches = await getMatchesForSport(sport as Sport);
  const label = sportLabels[sport as Sport];
  const liveCount = matches.filter((m) => m.status === "live").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">{label}</h1>
        <p className="text-sm text-white/40 mt-1">
          {liveCount > 0
            ? `${liveCount} live ${liveCount === 1 ? "match" : "matches"} right now`
            : "No live matches right now"}
        </p>
      </div>

      {/* Sport Filter */}
      <SportSwitcher />

      {/* Top Leagues — soccer only */}
      {sport === "soccer" && <LeagueBar />}

      {/* Match List with live polling */}
      <LiveMatchList initialMatches={matches} sport={sport as Sport} />
    </div>
  );
}
