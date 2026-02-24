import { notFound } from "next/navigation";

const validSports = new Set<string>(["soccer", "nba", "nfl", "nhl", "mlb"]);

const sportLabels: Record<string, string> = {
  soccer: "Soccer",
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

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white">{sportLabels[sport]} Mock Draft</h1>
        <p className="text-sm text-white/40 mt-1">Coming soon</p>
      </div>

      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-gold-spark/10 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gold-spark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-white/80 mb-1">Mock Draft</h2>
        <p className="text-sm text-white/40 text-center max-w-xs">
          Create and share your own {sportLabels[sport]} mock drafts. This feature is coming soon.
        </p>
      </div>
    </div>
  );
}
