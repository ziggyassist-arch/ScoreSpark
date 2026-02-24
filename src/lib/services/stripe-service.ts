import Stripe from "stripe";
import { config } from "@/lib/config";

const stripe = config.stripe.secretKey
  ? new Stripe(config.stripe.secretKey)
  : null;

export type SubscriptionTier = "free" | "premium" | "ultra";

export const TIER_FEATURES: Record<SubscriptionTier, {
  name: string;
  price: string;
  features: string[];
}> = {
  free: {
    name: "Free",
    price: "$0",
    features: [
      "Live scores for all 5 sports",
      "Basic match details",
      "League standings",
      "News feed",
    ],
  },
  premium: {
    name: "Premium",
    price: "$4.99/mo",
    features: [
      "Everything in Free",
      "Ad-free experience",
      "Advanced stats & analytics",
      "Spoiler-free mode",
      "Pulse reactions",
      "Custom notifications",
    ],
  },
  ultra: {
    name: "Ultra",
    price: "$12.99/mo",
    features: [
      "Everything in Premium",
      "AI match previews & predictions",
      "Mock draft builder",
      "Real-time SSE updates",
      "Priority support",
      "Early access to new features",
    ],
  },
};

/**
 * Create a Stripe Checkout session for a subscription
 */
export async function createCheckoutSession(
  userId: string,
  tier: "premium" | "ultra",
  returnUrl: string
): Promise<string | null> {
  if (!stripe) return null;

  const priceId = tier === "premium" ? config.stripe.prices.premium : config.stripe.prices.ultra;
  if (!priceId) return null;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: returnUrl,
    metadata: { userId, tier },
  });

  return session.url;
}

/**
 * Create a Stripe Customer Portal session for managing subscriptions
 */
export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<string | null> {
  if (!stripe) return null;

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session.url;
}

/**
 * Handle Stripe webhook events
 */
export async function handleWebhookEvent(
  body: string,
  signature: string
): Promise<{ type: string; data: Record<string, unknown> } | null> {
  if (!stripe) return null;

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    config.stripe.webhookSecret
  );

  return { type: event.type, data: event.data.object as unknown as Record<string, unknown> };
}
