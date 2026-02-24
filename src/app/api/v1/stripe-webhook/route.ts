import { NextRequest, NextResponse } from "next/server";
import { handleWebhookEvent } from "@/lib/services/stripe-service";

/**
 * POST /api/v1/stripe-webhook — Handle Stripe webhook events
 */
export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  try {
    const body = await request.text();
    const event = await handleWebhookEvent(body, signature);

    if (!event) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const userId = (event.data.metadata as Record<string, string>)?.userId;
        const tier = (event.data.metadata as Record<string, string>)?.tier;
        console.log(`[stripe] User ${userId} subscribed to ${tier}`);
        // TODO: Update user tier in database when Vercel Postgres is configured
        break;
      }
      case "customer.subscription.deleted": {
        console.log("[stripe] Subscription cancelled:", event.data.id);
        // TODO: Downgrade user to free tier
        break;
      }
      case "customer.subscription.updated": {
        console.log("[stripe] Subscription updated:", event.data.id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[stripe-webhook] Error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
