import { cacheGet, cacheSet } from "./cache";
import type { Sport } from "@/lib/types";

interface NewsArticle {
  id: string;
  title: string;
  source: string;
  url: string;
  sport: Sport;
  imageUrl?: string;
  timeAgo: string;
}

// ESPN sport paths for news (soccer needs a league suffix)
const ESPN_SPORT_PATHS: Record<Sport, string> = {
  soccer: "soccer/eng.1",
  nba: "basketball/nba",
  nfl: "football/nfl",
  nhl: "hockey/nhl",
  mlb: "baseball/mlb",
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/**
 * Fetch news headlines from ESPN's public API
 */
export async function getNewsForSport(sport: Sport): Promise<NewsArticle[]> {
  const cacheKey = `news:${sport}`;
  const cached = cacheGet<NewsArticle[]>(cacheKey);
  if (cached) return cached;

  try {
    const path = ESPN_SPORT_PATHS[sport];
    const url = `https://site.api.espn.com/apis/site/v2/sports/${path}/news?limit=8`;
    const resp = await fetch(url, { next: { revalidate: 300 } });

    if (!resp.ok) throw new Error(`ESPN news ${resp.status}`);

    const data = await resp.json();
    const articles: NewsArticle[] = (data.articles ?? []).slice(0, 8).map(
      (article: Record<string, unknown>, idx: number) => ({
        id: `espn-${sport}-${idx}`,
        title: article.headline as string,
        source: "ESPN",
        url: (article.links as Record<string, unknown>)?.web
          ? ((article.links as Record<string, Record<string, unknown>>).web.href as string)
          : `https://www.espn.com/${path}`,
        sport,
        imageUrl: Array.isArray(article.images) && article.images.length > 0
          ? (article.images[0] as Record<string, unknown>).url as string
          : undefined,
        timeAgo: article.published ? timeAgo(article.published as string) : "",
      })
    );

    // Cache for 5 minutes
    cacheSet(cacheKey, articles, 300_000);
    return articles;
  } catch (err) {
    console.error(`[news-service] Error fetching ${sport} news:`, err);
    return [];
  }
}
