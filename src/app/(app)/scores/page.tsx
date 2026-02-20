import { allMatches } from "@/lib/mock-data";
import SportSwitcher from "@/components/SportSwitcher";
import MatchList from "@/components/MatchList";

export const metadata = { title: "Scores — ScoreSpark" };

export default function ScoresPage() {
  const liveCount = allMatches.filter((m) => m.status === "live").length;

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

      {/* Match List */}
      <MatchList matches={allMatches} />
    </div>
  );
}
