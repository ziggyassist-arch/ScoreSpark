import { notFound } from "next/navigation";
import { getMockDraft } from "@/lib/services/mock-draft-service";
import type { Sport } from "@/lib/types";

const validSports = new Set<string>(["soccer", "nba", "nfl", "nhl", "mlb"]);

const sportLabels: Record<string, string> = {
  soccer: "MLS SuperDraft",
  nba: "NBA",
  nfl: "NFL",
  nhl: "NHL",
  mlb: "MLB",
};

export function generateStaticParams() {
  return [{ sport: "soccer" }, { sport: "nba" }, { sport: "nfl" }, { sport: "nhl" }, { sport: "mlb" }];
}

export function generateMetadata() {
  return { title: "Mock Draft — ScoreSpark" };
}

export default async function MockDraftPage({
  params,
}: {
  params: Promise<{ sport: string }>;
}) {
  const { sport } = await params;

  if (!validSports.has(sport)) {
    notFound();
  }

  const draft = getMockDraft(sport as Sport);

  if (!draft || draft.picks.length === 0) {
    return (
      <div className="space-y-6 animate-slide-up">
        <div>
          <h1 className="text-2xl font-bold text-white">{sportLabels[sport]} Mock Draft</h1>
          <p className="text-sm text-white/40 mt-1">Coming soon</p>
        </div>
        <div className="text-center py-16">
          <p className="text-white/30 text-sm">No mock draft data available yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">{sportLabels[sport]} Mock Draft {draft.year}</h1>
        <p className="text-sm text-white/40 mt-1">
          Consensus from top {draft.sources.length} sources
        </p>
      </div>

      {/* Draft info card */}
      <div className="bg-card rounded-2xl p-4 border border-white/5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gold-spark uppercase tracking-wider">
            Draft Date
          </span>
          <span className="text-xs text-white/40">{draft.draftDate}</span>
        </div>
        <div className="space-y-1.5">
          <p className="text-[11px] text-white/30 uppercase tracking-wider font-semibold">Sources</p>
          <div className="flex flex-wrap gap-1.5">
            {draft.sources.map((source) => (
              <span
                key={source}
                className="px-2 py-0.5 text-[10px] font-medium bg-white/5 text-white/50 rounded-full"
              >
                {source}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Draft picks table */}
      <div className="bg-card rounded-2xl border border-white/5 overflow-hidden">
        {/* Header row */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white/5 text-[11px] font-semibold text-white/40 uppercase tracking-wider">
          <span className="w-8 text-center">#</span>
          <span className="flex-1">Player</span>
          <span className="w-12 text-center">Pos</span>
          <span className="w-28 text-right hidden sm:block">School/Club</span>
        </div>

        {/* Picks */}
        {draft.picks.map((pick) => (
          <div
            key={pick.pick}
            className="flex items-center gap-3 px-4 py-3 border-t border-white/5 hover:bg-white/[0.02] transition-colors"
          >
            {/* Pick number */}
            <span className="w-8 text-center">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gold-spark/10 text-gold-spark text-xs font-bold tabular-nums">
                {pick.pick}
              </span>
            </span>

            {/* Player info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white/90 truncate">{pick.player}</p>
                {pick.team && (
                  <span className="text-[10px] text-white/30 hidden md:inline truncate">
                    {pick.team}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-white/30 sm:hidden">{pick.school}</span>
                <span className="text-[10px] text-white/20">
                  Avg: #{pick.avgPick.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Position */}
            <span className="w-12 text-center">
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-white/5 text-white/60 rounded">
                {pick.position}
              </span>
            </span>

            {/* School */}
            <span className="w-28 text-right text-xs text-white/40 truncate hidden sm:block">
              {pick.school}
            </span>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-white/20 text-center px-4">
        Mock draft consensus compiled from multiple expert sources. Picks represent averaged rankings
        and may differ from individual mocks. Last updated: {draft.lastUpdated}
      </p>
    </div>
  );
}
