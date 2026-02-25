"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import type { ESPNLeaderCategoryV3 } from "@/lib/api/types/espn";

interface LeadersData {
  categories: ESPNLeaderCategoryV3[];
}

export default function StatsLeadersPage() {
  const { sport } = useParams<{ sport: string }>();
  const [data, setData] = useState<LeadersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(0);

  useEffect(() => {
    if (sport === "soccer") return;
    setLoading(true);
    setError(null);
    fetch(`/api/v1/leaders?sport=${sport}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((d) => {
        setData(d);
        setActiveCategory(0);
      })
      .catch(() => setError("Failed to load stats leaders"))
      .finally(() => setLoading(false));
  }, [sport]);

  if (sport === "soccer") {
    return (
      <div className="py-16 text-center">
        <p className="text-white/30">For soccer stats leaders, check the Top Scorers tab</p>
      </div>
    );
  }

  const categories = data?.categories ?? [];
  const currentCategory = categories[activeCategory];

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-4">Stats Leaders</h1>

      {loading && (
        <div className="flex justify-center py-12">
          <Image src="/scorespark_white_transparent_bg.png" alt="" width={40} height={40} className="h-10 w-10 object-contain animate-pulse-glow opacity-40" />
        </div>
      )}

      {error && <p className="text-red-400 text-sm text-center py-8">{error}</p>}

      {!loading && categories.length > 0 && (
        <>
          {/* Category selector */}
          <div className="flex gap-1.5 overflow-x-auto hide-scrollbar mb-6 pb-1">
            {categories.map((cat, i) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === i
                    ? "bg-white/10 text-white ring-1 ring-white/10"
                    : "text-white/30 hover:text-white/50 hover:bg-white/5"
                }`}
              >
                {cat.shortDisplayName || cat.abbreviation}
              </button>
            ))}
          </div>

          {/* Leaders table */}
          {currentCategory && (
            <div className="bg-card rounded-xl border border-white/5 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5">
                <span className="text-sm font-semibold text-white/60">{currentCategory.displayName}</span>
              </div>

              {currentCategory.leaders?.slice(0, 20).map((leader, i) => (
                <div
                  key={`${leader.athlete?.id ?? i}-${i}`}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    i < 3 ? "bg-gold-spark/5" : ""
                  } ${i !== Math.min(19, (currentCategory.leaders?.length ?? 0) - 1) ? "border-b border-white/5" : ""}`}
                >
                  <span className={`w-6 text-center text-sm font-bold flex-shrink-0 ${i < 3 ? "text-gold-spark" : "text-white/30"}`}>
                    {i + 1}
                  </span>
                  {leader.athlete?.headshot ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={leader.athlete.headshot} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/90 truncate">{leader.athlete?.displayName ?? "Unknown"}</p>
                    <div className="flex items-center gap-2">
                      {leader.team?.logos?.[0]?.href && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={leader.team.logos[0].href} alt="" className="w-3.5 h-3.5 object-contain" />
                      )}
                      <span className="text-[10px] text-white/30">{leader.team?.displayName ?? ""}</span>
                      {leader.athlete?.position && (
                        <span className="text-[10px] text-white/20">{leader.athlete.position.abbreviation}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-lg font-bold text-white tabular-nums">{leader.displayValue}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
