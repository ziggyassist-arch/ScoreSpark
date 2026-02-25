"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface TransferItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: "done-deal" | "rumor" | "official" | "news";
}

const categoryFilters = [
  { value: "all", label: "All" },
  { value: "done-deal", label: "Done Deals" },
  { value: "rumor", label: "Rumors" },
  { value: "official", label: "Official" },
  { value: "news", label: "News" },
];

function categoryBadge(category: TransferItem["category"]): { label: string; color: string } {
  switch (category) {
    case "done-deal":
      return { label: "Done Deal", color: "bg-live-green/15 text-live-green" };
    case "rumor":
      return { label: "Rumor", color: "bg-gold-spark/15 text-gold-spark" };
    case "official":
      return { label: "Official", color: "bg-blue-accent/15 text-blue-accent" };
    default:
      return { label: "News", color: "bg-white/10 text-white/50" };
  }
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  const now = Date.now();
  const diff = now - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function TransfersPage() {
  const params = useParams();
  const sport = params.sport as string;
  const [items, setItems] = useState<TransferItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (sport !== "soccer") {
      setLoading(false);
      return;
    }

    fetch("/api/v1/transfers")
      .then((r) => r.json())
      .then((data) => setItems(data.items ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sport]);

  if (sport !== "soccer") {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-white/30">Transfer news is available for soccer only</p>
        <p className="text-sm text-white/20 mt-2">
          For other sports, check the Transactions tab
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-card rounded-xl p-4 h-24" />
        ))}
      </div>
    );
  }

  const filtered = filter === "all" ? items : items.filter((i) => i.category === filter);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-white/90">Transfer News</h1>
        <span className="text-xs text-white/30">{filtered.length} stories</span>
      </div>

      {/* Category filter pills */}
      <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-1">
        {categoryFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
              filter === f.value
                ? "bg-gold-spark/15 text-gold-spark"
                : "bg-white/5 text-white/40 hover:text-white/60 hover:bg-white/10"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Transfer items */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-12 h-12 text-white/10 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
          </svg>
          <p className="text-sm text-white/30">No transfer stories available</p>
          <p className="text-xs text-white/20 mt-1">Check back later for updates</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => {
            const badge = categoryBadge(item.category);
            return (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-card rounded-xl p-4 border border-white/5 hover:border-white/10 hover:bg-card-hover transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Category + Source + Time */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-[10px] text-white/25">{item.source}</span>
                      {item.pubDate && (
                        <span className="text-[10px] text-white/20 ml-auto flex-shrink-0">
                          {timeAgo(item.pubDate)}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-semibold text-white/80 group-hover:text-white/95 transition-colors leading-snug mb-1">
                      {item.title}
                    </h3>

                    {/* Description */}
                    {item.description && (
                      <p className="text-xs text-white/35 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* External link icon */}
                  <svg className="w-4 h-4 text-white/15 flex-shrink-0 mt-1 group-hover:text-white/30 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
