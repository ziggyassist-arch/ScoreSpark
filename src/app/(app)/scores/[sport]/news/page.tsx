import { notFound } from "next/navigation";
import type { Sport } from "@/lib/types";
import { getNewsForSport } from "@/lib/services/news-service";

const validSports = new Set<string>(["soccer", "nba", "nfl", "nhl", "mlb"]);

const sportLabels: Record<Sport, string> = {
  soccer: "Soccer",
  nba: "NBA",
  nfl: "NFL",
  nhl: "NHL",
  mlb: "MLB",
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [{ sport: "soccer" }, { sport: "nba" }, { sport: "nfl" }, { sport: "nhl" }, { sport: "mlb" }];
}

export function generateMetadata() {
  return { title: "News — ScoreSpark" };
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ sport: string }>;
}) {
  const { sport } = await params;

  if (!validSports.has(sport)) {
    notFound();
  }

  const articles = await getNewsForSport(sport as Sport);

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white">{sportLabels[sport as Sport]} News</h1>
        <p className="text-sm text-white/40 mt-1">Aggregated from top sports news sources</p>
      </div>

      <div className="space-y-3">
        {articles.map((article) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-4 p-4 bg-card rounded-2xl border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all group hover-card-lift"
          >
            {article.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={article.imageUrl}
                alt=""
                className="w-24 h-16 object-cover rounded-lg shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[15px] text-white/90 leading-snug group-hover:text-white transition-colors line-clamp-2 font-medium">
                {article.title}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-white/40">{article.source}</span>
                <span className="text-xs text-white/20">·</span>
                <span className="text-xs text-white/40">{article.timeAgo}</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-16">
          <p className="text-white/30 text-sm">No news available right now</p>
        </div>
      )}
    </div>
  );
}
