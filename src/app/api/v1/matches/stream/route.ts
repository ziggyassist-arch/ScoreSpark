import { NextRequest } from "next/server";
import { getAllMatches, getMatchesForSport } from "@/lib/services/match-service";
import type { Sport } from "@/lib/types";

export const dynamic = "force-dynamic";

const VALID_SPORTS = new Set(["soccer", "nba", "nfl", "nhl", "mlb"]);
const POLL_INTERVAL = 30_000; // 30s server-side poll, pushed to client via SSE

/**
 * GET /api/v1/matches/stream?sport=nba — SSE stream of live score updates
 * Pushes fresh match data every 30s to connected clients.
 */
export async function GET(request: NextRequest) {
  const sport = request.nextUrl.searchParams.get("sport");
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: string) => {
        try {
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        } catch {
          // Stream closed
        }
      };

      // Send initial data immediately
      try {
        const matches = sport && VALID_SPORTS.has(sport)
          ? await getMatchesForSport(sport as Sport)
          : await getAllMatches();
        send(JSON.stringify({ matches, count: matches.length }));
      } catch {
        send(JSON.stringify({ matches: [], count: 0 }));
      }

      // Poll and push updates
      const interval = setInterval(async () => {
        try {
          const matches = sport && VALID_SPORTS.has(sport)
            ? await getMatchesForSport(sport as Sport)
            : await getAllMatches();
          send(JSON.stringify({ matches, count: matches.length }));
        } catch {
          // Skip this tick
        }
      }, POLL_INTERVAL);

      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        try {
          controller.close();
        } catch {
          // Already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
