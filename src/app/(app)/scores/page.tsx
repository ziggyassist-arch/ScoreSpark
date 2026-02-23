import { getAllMatches } from "@/lib/services/match-service";
import SportSwitcher from "@/components/SportSwitcher";
import LeagueBar from "@/components/LeagueBar";
import LiveMatchList from "@/components/LiveMatchList";

export const metadata = { title: "Scores — ScoreSpark" };
export const dynamic = "force-dynamic";

export default async function ScoresPage() {
  const matches = await getAllMatches();
  const liveCount = matches.filter((m) => m.status === "live").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Scores</h1>
        <p className="text-sm text-white/40 mt-1">
          {liveCount > 0
            ? `${liveCount} live ${liveCount === 1 ? "match" : "matches"} right now`
            : "No live matches right now"}
        </p>
      </div>

      {/* Sport Filter */}
      <SportSwitcher />

      {/* Top Leagues */}
      <LeagueBar />

      {/* Match List — client component with live polling */}
      <LiveMatchList initialMatches={matches} />
    </div>
  );
}
