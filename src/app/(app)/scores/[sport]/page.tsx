import { notFound } from "next/navigation";
import { getMatchesBySport } from "@/lib/mock-data";
import type { Sport } from "@/lib/types";
import SportSwitcher from "@/components/SportSwitcher";
import MatchList from "@/components/MatchList";

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

export function generateMetadata({ params }: { params: Promise<{ sport: string }> }) {
  // We can't await in generateMetadata sync, so we return a default
  return { title: "Scores — ScoreSpark" };
}

export default async function SportScoresPage({
  params,
}: {
  params: Promise<{ sport: string }>;
}) {
  const { sport } = await params;

  if (!validSports.has(sport)) {
    notFound();
  }

  const matches = getMatchesBySport(sport);
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

      {/* Match List */}
      <MatchList matches={matches} />
    </div>
  );
}
