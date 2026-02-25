"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import type { ESPNTeamInjuries } from "@/lib/api/types/espn";

interface InjuryData {
  injuries: ESPNTeamInjuries[];
}

const STATUS_COLORS: Record<string, string> = {
  "Out": "text-red-400 bg-red-400/10",
  "Day-To-Day": "text-yellow-400 bg-yellow-400/10",
  "Questionable": "text-orange-400 bg-orange-400/10",
  "Doubtful": "text-orange-500 bg-orange-500/10",
  "Active": "text-green-400 bg-green-400/10",
  "Probable": "text-green-400 bg-green-400/10",
};

function getStatusColor(status: string): string {
  return STATUS_COLORS[status] ?? "text-white/50 bg-white/10";
}

export default function InjuriesPage() {
  const { sport } = useParams<{ sport: string }>();
  const [data, setData] = useState<InjuryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "out" | "day-to-day">("all");

  useEffect(() => {
    if (sport === "soccer") return;
    setLoading(true);
    setError(null);
    fetch(`/api/v1/injuries?sport=${sport}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((d) => setData(d))
      .catch(() => setError("Failed to load injury reports"))
      .finally(() => setLoading(false));
  }, [sport]);

  if (sport === "soccer") {
    return (
      <div className="py-16 text-center">
        <p className="text-white/30">Injury reports are not available for soccer on the free tier</p>
      </div>
    );
  }

  const filteredTeams = data?.injuries?.filter((team) => {
    if (filter === "all") return team.injuries.length > 0;
    return team.injuries.some((inj) => {
      if (filter === "out") return inj.status === "Out";
      if (filter === "day-to-day") return inj.status === "Day-To-Day" || inj.status === "Questionable";
      return true;
    });
  }) ?? [];

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-4">Injury Reports</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "out", "day-to-day"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === f
                ? "bg-white/10 text-white"
                : "text-white/30 hover:text-white/50 hover:bg-white/5"
            }`}
          >
            {f === "all" ? "All" : f === "out" ? "Out" : "Day-to-Day"}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <Image src="/scorespark_white_transparent_bg.png" alt="" width={40} height={40} className="h-10 w-10 object-contain animate-pulse-glow opacity-40" />
        </div>
      )}

      {error && <p className="text-red-400 text-sm text-center py-8">{error}</p>}

      {!loading && filteredTeams.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-white/30">No injury reports found</p>
        </div>
      )}

      {!loading && filteredTeams.map((team) => {
        const injuries = filter === "all"
          ? team.injuries
          : team.injuries.filter((inj) => {
              if (filter === "out") return inj.status === "Out";
              return inj.status === "Day-To-Day" || inj.status === "Questionable";
            });
        if (injuries.length === 0) return null;

        return (
          <div key={team.id} className="mb-4 bg-card rounded-xl border border-white/5 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <span className="text-sm font-semibold text-white/70">{team.displayName}</span>
              <span className="text-[10px] text-white/20 bg-white/5 px-1.5 py-0.5 rounded-full">
                {injuries.length}
              </span>
            </div>
            <div className="divide-y divide-white/5">
              {injuries.map((injury) => (
                <div key={injury.id} className="px-4 py-3 flex items-start gap-3">
                  {injury.athlete.headshot ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={injury.athlete.headshot} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-white/90">{injury.athlete.displayName}</span>
                      {injury.athlete.position && (
                        <span className="text-[10px] text-white/30">{injury.athlete.position.abbreviation}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getStatusColor(injury.status)}`}>
                        {injury.status}
                      </span>
                      {injury.details?.type && (
                        <span className="text-[11px] text-white/40">{injury.details.type}</span>
                      )}
                    </div>
                    {injury.shortComment && (
                      <p className="text-[11px] text-white/25 mt-1 line-clamp-2">{injury.shortComment}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
