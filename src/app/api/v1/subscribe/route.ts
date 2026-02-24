import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createCheckoutSession, TIER_FEATURES, type SubscriptionTier } from "@/lib/services/stripe-service";

/**
 * GET /api/v1/subscribe — Get subscription tier info
 */
export async function GET() {
  return NextResponse.json({ tiers: TIER_FEATURES });
}

/**
 * POST /api/v1/subscribe — Create a Stripe Checkout session
 * Body: { tier: "premium" | "ultra" }
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const tier = body.tier as SubscriptionTier;

    if (tier !== "premium" && tier !== "ultra") {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    const origin = request.nextUrl.origin;
    const checkoutUrl = await createCheckoutSession(session.user.id, tier, `${origin}/settings`);

    if (!checkoutUrl) {
      return NextResponse.json({
        error: "Stripe not configured. Set STRIPE_SECRET_KEY and price IDs in env vars.",
      }, { status: 503 });
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    console.error("[subscribe] Error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
