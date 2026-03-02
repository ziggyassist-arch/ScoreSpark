"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { TIER_FEATURES, type SubscriptionTier } from "@/lib/services/stripe-service";

const tierOrder: SubscriptionTier[] = ["free", "premium", "ultra"];

const tierColors: Record<SubscriptionTier, { border: string; bg: string; badge: string }> = {
  free: { border: "border-white/10", bg: "bg-card", badge: "bg-white/10 text-white/60" },
  premium: { border: "border-gold-spark/30", bg: "bg-card", badge: "bg-gold-spark/15 text-gold-spark" },
  ultra: { border: "border-blue-accent/30", bg: "bg-card", badge: "bg-blue-accent/15 text-blue-accent" },
};

export default function PricingPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (tier: "premium" | "ultra") => {
    if (!session) {
      window.location.href = "/auth/signin";
      return;
    }

    setLoading(tier);
    try {
      const res = await fetch("/api/v1/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Failed to start checkout");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-slide-up">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white">Choose Your Plan</h1>
        <p className="text-sm text-white/40 mt-2">
          More scores. More stats. Less noise.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tierOrder.map((tier) => {
          const info = TIER_FEATURES[tier];
          const colors = tierColors[tier];
          const isPopular = tier === "premium";

          return (
            <div
              key={tier}
              className={`relative rounded-2xl border-2 ${colors.border} ${colors.bg} p-6 flex flex-col hover-card-lift`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-gold-spark text-navy-dark rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-lg ${colors.badge} mb-3`}>
                  {info.name}
                </span>
                <p className="text-2xl font-bold text-white">{info.price}</p>
              </div>

              <ul className="space-y-3 flex-1 mb-6">
                {info.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-live-green mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-sm text-white/70">{feature}</span>
                  </li>
                ))}
              </ul>

              {tier === "free" ? (
                <div className="px-4 py-3 text-center text-sm text-white/40 bg-white/5 rounded-xl">
                  Current Plan
                </div>
              ) : (
                <button
                  onClick={() => handleSubscribe(tier)}
                  disabled={loading !== null}
                  className={`px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                    tier === "premium"
                      ? "bg-gold-spark text-navy-dark hover:bg-gold-spark/90"
                      : "bg-blue-accent text-navy-dark hover:bg-blue-accent/90"
                  } ${loading === tier ? "opacity-50" : ""}`}
                >
                  {loading === tier ? "Loading..." : `Subscribe to ${info.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-white/20 mt-8">
        Subscriptions are managed through Stripe. Cancel anytime.
      </p>
    </div>
  );
}
