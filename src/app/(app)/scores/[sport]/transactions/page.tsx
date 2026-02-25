"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

/* ── Types ── */

interface TransactionTeam {
  id: string;
  displayName: string;
  abbreviation: string;
  logos?: { href: string }[];
}

interface Transaction {
  date: string;
  description: string;
  team: TransactionTeam;
}

interface TransactionsResponse {
  transactions: Transaction[];
  count?: number;
}

/* ── Helpers ── */

/** Infer a transaction type label from its description text */
function inferType(description: string): string {
  const d = description.toLowerCase();
  if (d.includes("traded") || d.includes("trade")) return "Trade";
  if (d.includes("signed")) return "Signing";
  if (d.includes("waived") || d.includes("waive")) return "Waiver";
  if (d.includes("released")) return "Release";
  if (d.includes("claimed")) return "Claim";
  if (d.includes("recalled")) return "Recall";
  if (d.includes("assigned")) return "Assignment";
  if (d.includes("activated")) return "Activation";
  if (d.includes("placed") && d.includes("injured")) return "Injured Reserve";
  if (d.includes("placed") && d.includes("ir")) return "Injured Reserve";
  if (d.includes("designated")) return "Designation";
  if (d.includes("promoted")) return "Promotion";
  if (d.includes("extended") || d.includes("extension")) return "Extension";
  if (d.includes("acquired")) return "Acquisition";
  if (d.includes("selected")) return "Selection";
  if (d.includes("optioned")) return "Option";
  if (d.includes("suspended")) return "Suspension";
  return "Transaction";
}

/** Colour classes for transaction type badges */
const TYPE_COLORS: Record<string, string> = {
  Trade: "text-purple-400 bg-purple-400/10",
  Signing: "text-green-400 bg-green-400/10",
  Extension: "text-green-400 bg-green-400/10",
  Waiver: "text-red-400 bg-red-400/10",
  Release: "text-red-400 bg-red-400/10",
  Claim: "text-blue-400 bg-blue-400/10",
  Recall: "text-blue-400 bg-blue-400/10",
  Assignment: "text-cyan-400 bg-cyan-400/10",
  Activation: "text-emerald-400 bg-emerald-400/10",
  "Injured Reserve": "text-orange-400 bg-orange-400/10",
  Designation: "text-yellow-400 bg-yellow-400/10",
  Promotion: "text-teal-400 bg-teal-400/10",
  Acquisition: "text-indigo-400 bg-indigo-400/10",
  Selection: "text-sky-400 bg-sky-400/10",
  Option: "text-amber-400 bg-amber-400/10",
  Suspension: "text-red-500 bg-red-500/10",
  Transaction: "text-white/50 bg-white/10",
};

function typeColor(type: string): string {
  return TYPE_COLORS[type] ?? "text-white/50 bg-white/10";
}

/** Group transactions by display date */
function groupByDate(
  transactions: Transaction[]
): { dateLabel: string; dateKey: string; items: Transaction[] }[] {
  const groups: Map<string, Transaction[]> = new Map();

  for (const tx of transactions) {
    const d = new Date(tx.date);
    const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(tx);
  }

  // Sort groups newest first
  const sorted = [...groups.entries()].sort((a, b) => b[0].localeCompare(a[0]));

  return sorted.map(([key, items]) => {
    const d = new Date(key + "T12:00:00Z");
    const dateLabel = d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return { dateLabel, dateKey: key, items };
  });
}

/* ── Filter options ── */

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "trade", label: "Trades" },
  { value: "signing", label: "Signings" },
  { value: "waiver", label: "Waivers" },
  { value: "injury", label: "IR" },
] as const;

type FilterValue = (typeof FILTER_OPTIONS)[number]["value"];

function matchesFilter(description: string, filter: FilterValue): boolean {
  if (filter === "all") return true;
  const type = inferType(description).toLowerCase();
  if (filter === "trade") return type === "trade" || type === "acquisition";
  if (filter === "signing") return type === "signing" || type === "extension";
  if (filter === "waiver") return type === "waiver" || type === "release";
  if (filter === "injury") return type === "injured reserve";
  return true;
}

/* ── Skeleton loader ── */

function SkeletonCard() {
  return (
    <div className="bg-card rounded-xl border border-white/5 overflow-hidden animate-pulse">
      <div className="px-4 py-3 border-b border-white/5">
        <div className="h-4 w-32 bg-white/5 rounded" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="px-4 py-3 flex items-start gap-3 border-b border-white/5 last:border-b-0">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-28 bg-white/5 rounded" />
            <div className="h-3 w-full bg-white/5 rounded" />
            <div className="h-3 w-3/4 bg-white/5 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main component ── */

export default function TransactionsPage() {
  const { sport } = useParams<{ sport: string }>();
  const [data, setData] = useState<TransactionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterValue>("all");

  useEffect(() => {
    if (sport === "soccer") return;
    setLoading(true);
    setError(null);

    fetch(`/api/v1/transactions?sport=${sport}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((d) => setData(d))
      .catch(() => setError("Failed to load transactions"))
      .finally(() => setLoading(false));
  }, [sport]);

  /* Soccer doesn't have transactions via ESPN */
  if (sport === "soccer") {
    return (
      <div className="py-16 text-center">
        <p className="text-white/30">Transaction tracking is not available for soccer</p>
      </div>
    );
  }

  const allTransactions = data?.transactions ?? [];
  const filtered = allTransactions.filter((tx) => matchesFilter(tx.description, filter));
  const grouped = groupByDate(filtered);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-white">Transactions</h1>
        {data && (
          <span className="text-xs text-white/20">
            {allTransactions.length} recent
          </span>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 overflow-x-auto hide-scrollbar mb-6 pb-1">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filter === opt.value
                ? "bg-white/10 text-white ring-1 ring-white/10"
                : "text-white/30 hover:text-white/50 hover:bg-white/5"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          <div className="flex justify-center py-6">
            <Image
              src="/scorespark_white_transparent_bg.png"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 object-contain animate-pulse-glow opacity-40"
            />
          </div>
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* Error */}
      {error && <p className="text-red-400 text-sm text-center py-8">{error}</p>}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="py-16 text-center">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-white/10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
            />
          </svg>
          <p className="text-white/30 text-sm">
            {filter === "all"
              ? "No recent transactions found"
              : `No ${FILTER_OPTIONS.find((o) => o.value === filter)?.label.toLowerCase()} found`}
          </p>
        </div>
      )}

      {/* Transaction list grouped by date */}
      {!loading &&
        !error &&
        grouped.map((group) => (
          <div key={group.dateKey} className="mb-4">
            {/* Date header */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-semibold text-white/40">
                {group.dateLabel}
              </span>
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-[10px] text-white/20">
                {group.items.length} move{group.items.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Transactions card */}
            <div className="bg-card rounded-xl border border-white/5 overflow-hidden">
              <div className="divide-y divide-white/5">
                {group.items.map((tx, i) => {
                  const type = inferType(tx.description);
                  return (
                    <div
                      key={`${tx.team?.id}-${i}`}
                      className="px-4 py-3 flex items-start gap-3 hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Team logo */}
                      {tx.team?.logos?.[0]?.href ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={tx.team.logos[0].href}
                          alt=""
                          className="w-8 h-8 rounded-lg object-contain flex-shrink-0 bg-white/5 p-0.5"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex-shrink-0" />
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-white/90 truncate">
                            {tx.team?.displayName ?? "Unknown Team"}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${typeColor(
                              type
                            )}`}
                          >
                            {type}
                          </span>
                        </div>
                        <p className="text-[12px] text-white/50 leading-relaxed">
                          {tx.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
