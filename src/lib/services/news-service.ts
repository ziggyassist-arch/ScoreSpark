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

// RSS feed URLs — top sources per sport (all fetched concurrently)
const RSS_FEEDS: Record<Sport, { name: string; url: string }[]> = {
  soccer: [
    { name: "FotMob", url: "https://www.fotmob.com/rss" },
    { name: "ESPN FC", url: "https://www.espn.com/espn/rss/soccer/news" },
    { name: "BBC Sport", url: "https://feeds.bbci.co.uk/sport/football/rss.xml" },
    { name: "Sky Sports", url: "https://www.skysports.com/rss/12040" },
    { name: "The Athletic", url: "https://theathletic.com/feeds/rss/news/?sport=soccer" },
    { name: "Goal.com", url: "https://www.goal.com/feeds/en/news" },
    { name: "The Guardian", url: "https://www.theguardian.com/football/rss" },
    { name: "Marca", url: "https://e00-marca.uecdn.es/rss/en/football.xml" },
  ],
  nba: [
    { name: "The Athletic", url: "https://theathletic.com/feeds/rss/news/?sport=basketball" },
    { name: "CBS Sports", url: "https://www.cbssports.com/rss/headlines/nba/" },
    { name: "Yahoo Sports", url: "https://sports.yahoo.com/nba/rss" },
    { name: "NBA.com", url: "https://www.nba.com/feeds/promopage/rss" },
  ],
  nfl: [
    { name: "The Athletic", url: "https://theathletic.com/feeds/rss/news/?sport=football" },
    { name: "NFL.com", url: "https://www.nfl.com/feeds-rs/headlines.rss" },
    { name: "CBS Sports", url: "https://www.cbssports.com/rss/headlines/nfl/" },
    { name: "Pro Football Talk", url: "https://profootballtalk.nbcsports.com/feed/" },
    { name: "Yahoo Sports", url: "https://sports.yahoo.com/nfl/rss" },
  ],
  nhl: [
    { name: "The Athletic", url: "https://theathletic.com/feeds/rss/news/?sport=hockey" },
    { name: "NHL.com", url: "https://www.nhl.com/feeds/news/rss" },
    { name: "TSN", url: "https://www.tsn.ca/rss/nhl" },
    { name: "Sportsnet", url: "https://www.sportsnet.ca/hockey/nhl/feed/" },
    { name: "CBS Sports", url: "https://www.cbssports.com/rss/headlines/nhl/" },
  ],
  mlb: [
    { name: "The Athletic", url: "https://theathletic.com/feeds/rss/news/?sport=baseball" },
    { name: "MLB.com", url: "https://www.mlb.com/feeds/news/rss.xml" },
    { name: "CBS Sports", url: "https://www.cbssports.com/rss/headlines/mlb/" },
    { name: "Yahoo Sports", url: "https://sports.yahoo.com/mlb/rss" },
    { name: "Baseball America", url: "https://www.baseballamerica.com/feed/" },
  ],
};

// Keywords that identify articles as belonging to a specific sport
const SPORT_KEYWORDS: Record<Sport, RegExp> = {
  soccer: /\b(soccer|football|premier league|la liga|champions league|europa league|epl|serie a|bundesliga|ligue 1|mls|uefa|fifa|world cup|fc |united|city|arsenal|chelsea|liverpool|barca|real madrid|transfer window|matchday|nil-nil|clean sheet|var |offside|penalty kick|hat-trick|pitch|goalkeeper|striker|winger|midfielder|defender)\b/i,
  nba: /\b(nba|basketball|lakers|celtics|warriors|bucks|76ers|sixers|knicks|nets|heat|nuggets|suns|mavericks|cavaliers|thunder|timberwolves|grizzlies|clippers|spurs|raptors|pacers|hawks|hornets|pistons|magic|wizards|kings|blazers|rockets|pelicans|jazz|three.?pointer|dunk|rebound|free throw|triple.?double|double.?double|all.?star game|nba draft|slam dunk)\b/i,
  nfl: /\b(nfl|super bowl|quarterback|touchdown|endzone|end zone|passing yards|rushing|interception|fumble|sack|field goal|punt|wide receiver|tight end|linebacker|cornerback|safety|pro bowl|nfl draft|chiefs|eagles|49ers|cowboys|packers|ravens|bills|dolphins|bengals|lions|texans|bears|steelers|browns|broncos|chargers|rams|seahawks|jets|patriots|saints|colts|falcons|buccaneers|bucs|cardinals|commanders|titans|jaguars|panthers|raiders|vikings|giants)\b/i,
  nhl: /\b(nhl|hockey|stanley cup|hat trick|power play|penalty box|slapshot|goaltender|goalie|puck|ice hockey|bruins|maple leafs|canadiens|rangers|penguins|blackhawks|red wings|flyers|capitals|lightning|avalanche|oilers|flames|canucks|sharks|blues|wild|predators|hurricanes|panthers|jets|islanders|senators|devils|ducks|coyotes|kraken|golden knights)\b/i,
  mlb: /\b(mlb|baseball|world series|home run|strikeout|pitcher|batting average|rbi|innings|dugout|outfield|infield|shortstop|catcher|bullpen|spring training|yankees|dodgers|red sox|astros|braves|mets|phillies|cubs|cardinals|padres|brewers|guardians|twins|orioles|rays|mariners|rangers|blue jays|white sox|tigers|royals|reds|pirates|diamondbacks|rockies|marlins|nationals|athletics)\b/i,
};

// Keywords that mean the article is definitely NOT this sport
const OTHER_SPORT_SIGNALS: Record<Sport, RegExp> = {
  soccer: /\b(nba|nfl|nhl|mlb|basketball|hockey|baseball|touchdown|quarterback|slam dunk|home run|stanley cup|super bowl)\b/i,
  nba: /\b(nfl|nhl|mlb|soccer|hockey|baseball|touchdown|quarterback|stanley cup|home run|premier league|champions league|world cup|la liga)\b/i,
  nfl: /\b(nba|nhl|mlb|soccer|basketball|hockey|baseball|slam dunk|stanley cup|home run|premier league|champions league|world cup|la liga)\b/i,
  nhl: /\b(nba|nfl|mlb|soccer|basketball|baseball|touchdown|quarterback|slam dunk|home run|super bowl|premier league|champions league|world cup|la liga)\b/i,
  mlb: /\b(nba|nfl|nhl|soccer|basketball|hockey|touchdown|quarterback|slam dunk|stanley cup|super bowl|premier league|champions league|world cup|la liga)\b/i,
};

/** Check if an article is relevant to the requested sport */
function isRelevantToSport(title: string, url: string, sport: Sport): boolean {
  const text = `${title} ${url}`;
  const hasOwnKeyword = SPORT_KEYWORDS[sport].test(text);
  const hasOtherKeyword = OTHER_SPORT_SIGNALS[sport].test(text);

  // If it has keywords from another sport and none from ours, filter it out
  if (hasOtherKeyword && !hasOwnKeyword) return false;
  return true;
}

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
 * ESPN API (reliable) + ALL RSS feeds from top 5-10 sources fetched concurrently.
 */
export async function getNewsForSport(sport: Sport): Promise<NewsArticle[]> {
  const cacheKey = `news-multi:${sport}`;
  const cached = cacheGet<NewsArticle[]>(cacheKey);
  if (cached) return cached;

  // Fetch ESPN + ALL RSS feeds concurrently
  const feeds = RSS_FEEDS[sport] ?? [];

  const [espnArticles, ...rssResults] = await Promise.all([
    fetchESPNNews(sport),
    ...feeds.map((feed) => fetchRSSFeed(feed.url, feed.name, sport)),
  ]);

  // Merge, filter by sport relevance, and deduplicate by title similarity
  const allArticles = [...espnArticles, ...rssResults.flat()];
  const relevant = allArticles.filter((a) => isRelevantToSport(a.title, a.url, sport));
  const seen = new Set<string>();
  const deduped = relevant.filter((a) => {
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

  const result = deduped.slice(0, 30);
  cacheSet(cacheKey, result, 300_000);
  return result;
}
