import { NextRequest, NextResponse } from "next/server";
import { getTransferNews } from "@/lib/services/transfer-service";
import * as mock from "@/lib/services/mock-provider";

/**
 * GET /api/v1/transfers?category=done-deal|rumor|official|news
 * Returns soccer transfer news from RSS feeds.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");

  try {
    let items = mock.isMockMode()
      ? await mock.getTransferNews()
      : await getTransferNews();

    if (category && ["done-deal", "rumor", "official", "news"].includes(category)) {
      items = items.filter((item) => item.category === category);
    }

    return NextResponse.json({ items, count: items.length });
  } catch (err) {
    console.error("[transfers] Error:", err);
    return NextResponse.json({ items: [], count: 0, error: "Failed to fetch transfers" });
  }
}
