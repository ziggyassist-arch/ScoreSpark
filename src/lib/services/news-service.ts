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
  publishedAt?: string;
}

// ESPN sport paths for news
const ESPN_SPORT_PATHS: Record<Sport, string> = {
  soccer: "soccer/eng.1",
  nba: "basketball/nba",
  nfl: "football/nfl",
  nhl: "hockey/nhl",
  mlb: "baseball/mlb",
};

// RSS feed URLs — top 10 sources per sport
const RSS_FEEDS: Record<Sport, { name: string; url: string }[]> = {
  soccer: [
    { name: "FotMob", url: "https://www.fotmob.com/rss" },
    { name: "ESPN FC", url: "https://www.espn.com/espn/rss/soccer/news" },
    { name: "The Athletic", url: "https://theathletic.com/feeds/rss/news/?sport=soccer" },
    { name: "BBC Sport", url: "https://feeds.bbci.co.uk/sport/football/rss.xml" },
    { name: "Sky Sports", url: "https://www.skysports.com/rss/12040" },
    { name: "Goal.com", url: "https://www.goal.com/feeds/en/news" },
    { name: "Marca", url: "https://e00-marca.uecdn.es/rss/en/football.xml" },
    { name: "The Guardian", url: "https://www.theguardian.com/football/rss" },
    { name: "Transfermarkt", url: "https://www.transfermarkt.com/rss/news" },
    { name: "FIFA.com", url: "https://www.fifa.com/rss" },
  ],
  nba: [
    { name: "CBS Sports", url: "https://www.cbssports.com/rss/headlines/nba/" },
    { name: "Bleacher Report", url: "https://bleacherreport.com/articles/feed" },
    { name: "Hoops Hype", url: "https://hoopshype.com/feed/" },
    { name: "SB Nation", url: "https://www.sbnation.com/nba/rss/current" },
    { name: "Sporting News", url: "https://www.sportingnews.com/us/nba/rss" },
    { name: "ClutchPoints", url: "https://clutchpoints.com/feed" },
    { name: "The Ringer", url: "https://www.theringer.com/rss/index.xml" },
    { name: "Yahoo Sports", url: "https://sports.yahoo.com/nba/rss" },
    { name: "NBC Sports", url: "https://nba.nbcsports.com/feed/" },
    { name: "The Athletic", url: "https://theathletic.com/feeds/rss/news/?sport=basketball" },
  ],
  nfl: [
    { name: "CBS Sports", url: "https://www.cbssports.com/rss/headlines/nfl/" },
    { name: "Pro Football Talk", url: "https://profootballtalk.nbcsports.com/feed/" },
    { name: "Bleacher Report", url: "https://bleacherreport.com/articles/feed" },
    { name: "SB Nation", url: "https://www.sbnation.com/nfl/rss/current" },
    { name: "Yahoo Sports", url: "https://sports.yahoo.com/nfl/rss" },
    { name: "Sporting News", url: "https://www.sportingnews.com/us/nfl/rss" },
    { name: "Fox Sports", url: "https://api.foxsports.com/v2/content/optimized-rss?partnerKey=MB0Wehpmng&size=30&tags=fs/nfl" },
    { name: "The Ringer", url: "https://www.theringer.com/rss/index.xml" },
    { name: "NBC Sports", url: "https://profootballtalk.nbcsports.com/feed/" },
    { name: "The Athletic", url: "https://theathletic.com/feeds/rss/news/?sport=football" },
  ],
  nhl: [
    { name: "CBS Sports", url: "https://www.cbssports.com/rss/headlines/nhl/" },
    { name: "Bleacher Report", url: "https://bleacherreport.com/articles/feed" },
    { name: "SB Nation", url: "https://www.sbnation.com/nhl/rss/current" },
    { name: "The Hockey News", url: "https://thehockeynews.com/feed" },
    { name: "Sporting News", url: "https://www.sportingnews.com/us/nhl/rss" },
    { name: "NBC Sports", url: "https://nhl.nbcsports.com/feed/" },
    { name: "Yahoo Sports", url: "https://sports.yahoo.com/nhl/rss" },
    { name: "Daily Faceoff", url: "https://www.dailyfaceoff.com/feed/" },
    { name: "Sportsnet", url: "https://www.sportsnet.ca/hockey/nhl/feed/" },
    { name: "The Athletic", url: "https://theathletic.com/feeds/rss/news/?sport=hockey" },
  ],
  mlb: [
    { name: "CBS Sports", url: "https://www.cbssports.com/rss/headlines/mlb/" },
    { name: "Bleacher Report", url: "https://bleacherreport.com/articles/feed" },
    { name: "SB Nation", url: "https://www.sbnation.com/mlb/rss/current" },
    { name: "MLB Trade Rumors", url: "https://www.mlbtraderumors.com/feed" },
    { name: "Sporting News", url: "https://www.sportingnews.com/us/mlb/rss" },
    { name: "FanGraphs", url: "https://blogs.fangraphs.com/feed/" },
    { name: "Yahoo Sports", url: "https://sports.yahoo.com/mlb/rss" },
    { name: "NBC Sports", url: "https://mlb.nbcsports.com/feed/" },
    { name: "Just Baseball", url: "https://www.justbaseball.com/feed/" },
    { name: "The Athletic", url: "https://theathletic.com/feeds/rss/news/?sport=baseball" },
  ],
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  if (isNaN(then)) return "";
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 0) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/** Parse RSS XML and extract articles */
function parseRSSItems(xml: string, sourceName: string, sport: Sport): NewsArticle[] {
  const articles: NewsArticle[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>|<entry>([\s\S]*?)<\/entry>/gi;
  let match;
  let idx = 0;

  while ((match = itemRegex.exec(xml)) !== null && idx < 5) {
    const block = match[1] || match[2];

    const titleMatch = block.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : "";
    if (!title) continue;

    const linkMatch = block.match(/<link[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/)
      || block.match(/<link[^>]*href="([^"]+)"/);
    const url = linkMatch ? linkMatch[1].trim() : "";

    const dateMatch = block.match(/<pubDate>(.*?)<\/pubDate>/)
      || block.match(/<published>(.*?)<\/published>/)
      || block.match(/<dc:date>(.*?)<\/dc:date>/)
      || block.match(/<updated>(.*?)<\/updated>/);
    const publishedAt = dateMatch ? dateMatch[1].trim() : "";

    const imageMatch = block.match(/(?:media:content|enclosure)[^>]*url="([^"]+\.(jpg|jpeg|png|webp)[^"]*)"/i)
      || block.match(/<media:thumbnail[^>]*url="([^"]+)"/i)
      || block.match(/<img[^>]*src="([^"]+)"/i);
    const imageUrl = imageMatch ? imageMatch[1] : undefined;

    articles.push({
      id: `rss-${sourceName.replace(/\s/g, "-").toLowerCase()}-${sport}-${idx}`,
      title,
      source: sourceName,
      url: url || "#",
      sport,
      imageUrl,
      timeAgo: publishedAt ? timeAgo(publishedAt) : "",
      publishedAt,
    });
    idx++;
  }

  return articles;
}

/** Fetch a single RSS feed with timeout */
async function fetchRSSFeed(feedUrl: string, sourceName: string, sport: Sport): Promise<NewsArticle[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(feedUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "ScoreSpark/1.0" },
      next: { revalidate: 300 },
    });
    clearTimeout(timeout);

    if (!res.ok) return [];
    const text = await res.text();
    return parseRSSItems(text, sourceName, sport);
  } catch {
    return [];
  }
}

/** Fetch news from ESPN's public API (reliable primary source) */
async function fetchESPNNews(sport: Sport): Promise<NewsArticle[]> {
  try {
    const path = ESPN_SPORT_PATHS[sport];
    const url = `https://site.api.espn.com/apis/site/v2/sports/${path}/news?limit=10`;
    const resp = await fetch(url, { next: { revalidate: 300 } });
    if (!resp.ok) return [];

    const data = await resp.json();
    return (data.articles ?? []).slice(0, 10).map(
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
        publishedAt: article.published as string | undefined,
      })
    );
  } catch {
    return [];
  }
}

/**
 * Fetch news from multiple sources per sport.
 * ESPN API (reliable) + rotating subset of RSS feeds from top 10 sources.
 */
export async function getNewsForSport(sport: Sport): Promise<NewsArticle[]> {
  const cacheKey = `news-multi:${sport}`;
  const cached = cacheGet<NewsArticle[]>(cacheKey);
  if (cached) return cached;

  // Pick a rotating subset of RSS feeds to avoid hammering all 10 at once
  const feeds = RSS_FEEDS[sport] ?? [];
  const hour = new Date().getHours();
  const feedSubset = feeds.filter((_, i) => i % 3 === (hour % 3)).slice(0, 4);

  const [espnArticles, ...rssResults] = await Promise.all([
    fetchESPNNews(sport),
    ...feedSubset.map((feed) => fetchRSSFeed(feed.url, feed.name, sport)),
  ]);

  // Merge and deduplicate by title similarity
  const allArticles = [...espnArticles, ...rssResults.flat()];
  const seen = new Set<string>();
  const deduped = allArticles.filter((a) => {
    const key = a.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by recency
  deduped.sort((a, b) => {
    if (a.publishedAt && b.publishedAt) {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
    if (a.publishedAt) return -1;
    if (b.publishedAt) return 1;
    return 0;
  });

  const result = deduped.slice(0, 20);
  cacheSet(cacheKey, result, 300_000);
  return result;
}
