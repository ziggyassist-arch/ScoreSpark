import { cacheGet, cacheSet } from "./cache";

export interface TransferItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: "done-deal" | "rumor" | "official" | "news";
}

/** RSS feed sources for transfer news */
const RSS_FEEDS = [
  {
    url: "https://www.bbc.co.uk/sport/football/transfers/rss.xml",
    source: "BBC Sport",
    fallbackUrl: "https://feeds.bbci.co.uk/sport/football/rss.xml",
  },
  {
    url: "https://www.skysports.com/rss/12040", // Sky Sports transfers
    source: "Sky Sports",
    fallbackUrl: "https://www.skysports.com/rss/11095", // Sky Sports football
  },
  {
    url: "https://www.theguardian.com/football/transfer-window/rss",
    source: "The Guardian",
    fallbackUrl: "https://www.theguardian.com/football/rss",
  },
];

/** Simple XML tag extractor — no external dependencies */
function extractTag(xml: string, tag: string): string {
  const openPattern = new RegExp(`<${tag}[^>]*>`, "i");
  const closePattern = new RegExp(`</${tag}>`, "i");
  const openMatch = openPattern.exec(xml);
  if (!openMatch) return "";
  const start = openMatch.index + openMatch[0].length;
  const closeMatch = closePattern.exec(xml.slice(start));
  if (!closeMatch) return "";
  const content = xml.slice(start, start + closeMatch.index);
  // Strip CDATA
  return content.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
}

/** Parse RSS XML into transfer items */
function parseRSS(xml: string, source: string): TransferItem[] {
  const items: TransferItem[] = [];
  // Split by <item> tags
  const itemBlocks = xml.split(/<item>/i).slice(1);

  for (const block of itemBlocks.slice(0, 20)) {
    const title = extractTag(block, "title");
    const description = extractTag(block, "description");
    const link = extractTag(block, "link");
    const pubDate = extractTag(block, "pubDate");

    if (!title) continue;

    // Categorize by keywords
    const lowerTitle = title.toLowerCase();
    let category: TransferItem["category"] = "news";
    if (
      lowerTitle.includes("signs") ||
      lowerTitle.includes("signed") ||
      lowerTitle.includes("completes") ||
      lowerTitle.includes("confirms") ||
      lowerTitle.includes("done deal") ||
      lowerTitle.includes("official")
    ) {
      category = "done-deal";
    } else if (
      lowerTitle.includes("rumour") ||
      lowerTitle.includes("rumor") ||
      lowerTitle.includes("interest") ||
      lowerTitle.includes("target") ||
      lowerTitle.includes("linked") ||
      lowerTitle.includes("bid") ||
      lowerTitle.includes("wants") ||
      lowerTitle.includes("chase")
    ) {
      category = "rumor";
    } else if (
      lowerTitle.includes("announce") ||
      lowerTitle.includes("official") ||
      lowerTitle.includes("agreement")
    ) {
      category = "official";
    }

    items.push({
      id: `${source}-${items.length}-${Date.now()}`,
      title: stripHtml(title),
      description: stripHtml(description).slice(0, 300),
      link,
      pubDate,
      source,
      category,
    });
  }

  return items;
}

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#039;/g, "'").trim();
}

/** Fetch a single RSS feed with fallback */
async function fetchFeed(config: (typeof RSS_FEEDS)[number]): Promise<TransferItem[]> {
  for (const url of [config.url, config.fallbackUrl]) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 0 },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) continue;
      const xml = await res.text();
      const items = parseRSS(xml, config.source);
      // Filter for transfer-relevant items from general feeds
      if (url === config.fallbackUrl) {
        return items.filter(
          (item) =>
            item.category !== "news" ||
            item.title.toLowerCase().includes("transfer") ||
            item.title.toLowerCase().includes("sign") ||
            item.title.toLowerCase().includes("deal") ||
            item.title.toLowerCase().includes("loan") ||
            item.title.toLowerCase().includes("move")
        );
      }
      return items;
    } catch {
      continue;
    }
  }
  return [];
}

/**
 * Get transfer news from multiple RSS sources.
 * Returns sorted by date, most recent first.
 */
export async function getTransferNews(): Promise<TransferItem[]> {
  const cacheKey = "transfers:soccer:all";
  const cached = cacheGet<TransferItem[]>(cacheKey);
  if (cached) return cached;

  const results = await Promise.allSettled(RSS_FEEDS.map(fetchFeed));
  const items = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));

  // Sort by date, newest first
  items.sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime() || 0;
    const dateB = new Date(b.pubDate).getTime() || 0;
    return dateB - dateA;
  });

  // Deduplicate by similar titles
  const seen = new Set<string>();
  const unique = items.filter((item) => {
    const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Cache for 15 minutes
  cacheSet(cacheKey, unique, 15 * 60 * 1000);
  return unique;
}
