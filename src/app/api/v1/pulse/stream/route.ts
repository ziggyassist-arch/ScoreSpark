import { NextRequest } from "next/server";
import { subscribe, type PulseReaction } from "@/lib/services/pulse-service";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/pulse/stream?matchId=xxx — SSE stream of live reactions
 */
export async function GET(request: NextRequest) {
  const matchId = request.nextUrl.searchParams.get("matchId");
  if (!matchId) {
    return new Response("matchId required", { status: 400 });
  }

  const encoder = new TextEncoder();
  let unsubscribe: (() => void) | null = null;

  const stream = new ReadableStream({
    start(controller) {
      // Send initial keepalive
      controller.enqueue(encoder.encode(": connected\n\n"));

      // Subscribe to new reactions
      unsubscribe = subscribe(matchId, (reaction: PulseReaction) => {
        try {
          const data = JSON.stringify(reaction);
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        } catch {
          // Stream closed
        }
      });

      // Keepalive every 30s
      const keepalive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": keepalive\n\n"));
        } catch {
          clearInterval(keepalive);
        }
      }, 30_000);

      // Cleanup on abort
      request.signal.addEventListener("abort", () => {
        clearInterval(keepalive);
        unsubscribe?.();
      });
    },
    cancel() {
      unsubscribe?.();
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
