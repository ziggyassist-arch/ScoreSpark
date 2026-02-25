"use client";

import { useEffect, useState } from "react";
import type { Match } from "@/lib/types";

interface Play {
  id: string;
  type: { text: string };
  text: string;
  shortText?: string;
  period: { number: number; displayValue: string };
  clock: { displayValue: string };
  scoringPlay?: boolean;
  homeScore?: string;
  awayScore?: string;
}

interface Drive {
  id: string;
  description: string;
  team: { abbreviation: string; displayName: string };
  result: string;
  isScore: boolean;
  yards: number;
  plays: Play[];
}

interface SummaryData {
  plays?: Play[];
  drives?: Drive[] | { previous?: Drive[]; current?: Drive };
  scoringPlays?: Play[];
}

export default function PlayByPlay({ match }: { match: Match }) {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showScoring, setShowScoring] = useState(false);
  const [expandedDrive, setExpandedDrive] = useState<string | null>(null);

  useEffect(() => {
    if (!match.id.startsWith("espn-")) {
      setLoading(false);
      return;
    }
    const parts = match.id.split("-");
    const sport = parts[1];
    const eventId = parts.slice(2).join("-");

    fetch(`/api/v1/summary?sport=${sport}&eventId=${eventId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [match.id]);

  if (loading) {
    return <div className="text-center py-12 text-white/30 animate-pulse">Loading play-by-play...</div>;
  }

  // NFL uses drives — ESPN wraps in { previous: [...] }
  const drives: Drive[] = Array.isArray(data?.drives)
    ? data.drives
    : (data?.drives as { previous?: Drive[] })?.previous ?? [];

  if (match.sport === "nfl" && drives.length) {
    return (
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Drive Summary</h3>
        {drives.map((drive) => (
          <div key={drive.id} className="bg-white/[0.02] rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedDrive(expandedDrive === drive.id ? null : drive.id)}
              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white/70">{drive.team.abbreviation}</span>
                <span className={`text-xs ${drive.isScore ? "text-live-green font-medium" : "text-white/40"}`}>
                  {drive.result}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {drive.yards > 0 && (
                  <span className="text-[10px] text-white/30">{drive.yards} yds</span>
                )}
                <svg className={`w-3.5 h-3.5 text-white/30 transition-transform ${expandedDrive === drive.id ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </button>
            {expandedDrive === drive.id && drive.plays.length > 0 && (
              <div className="px-3 pb-2 space-y-1">
                {drive.plays.map((play) => (
                  <div key={play.id} className={`flex items-start gap-2 py-1.5 px-2 rounded text-xs ${play.scoringPlay ? "bg-live-green/10" : ""}`}>
                    <span className="text-[10px] text-white/30 w-10 flex-shrink-0 tabular-nums">
                      {play.clock.displayValue}
                    </span>
                    <span className={`${play.scoringPlay ? "text-live-green" : "text-white/60"}`}>
                      {play.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Other sports use flat plays list
  const plays = data?.plays ?? [];
  const scoringPlays = data?.scoringPlays ?? plays.filter((p) => p.scoringPlay);
  const displayPlays = showScoring ? scoringPlays : plays;

  if (displayPlays.length === 0) {
    return (
      <div className="text-center py-12 text-white/30">
        <p>{match.status === "upcoming" ? "Game hasn't started yet" : "No play-by-play available"}</p>
      </div>
    );
  }

  // Group plays by period
  const grouped = new Map<string, Play[]>();
  for (const play of displayPlays) {
    const key = play.period.displayValue;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(play);
  }

  return (
    <div className="space-y-4">
      {/* Filter toggle */}
      <div className="flex gap-1 bg-surface rounded-lg p-0.5">
        <button
          onClick={() => setShowScoring(false)}
          className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${
            !showScoring ? "bg-card text-white shadow-sm" : "text-white/40 hover:text-white/60"
          }`}
        >
          All Plays
        </button>
        <button
          onClick={() => setShowScoring(true)}
          className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${
            showScoring ? "bg-card text-white shadow-sm" : "text-white/40 hover:text-white/60"
          }`}
        >
          Scoring Only
        </button>
      </div>

      {/* Plays grouped by period */}
      {Array.from(grouped.entries()).map(([period, periodPlays]) => (
        <div key={period}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-white/40 uppercase">{period}</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>
          <div className="space-y-0.5">
            {periodPlays.slice(-50).map((play, i) => (
              <div
                key={play.id || i}
                className={`flex items-start gap-2 py-1.5 px-2 rounded text-xs ${
                  play.scoringPlay ? "bg-live-green/10" : ""
                }`}
              >
                <span className="text-[10px] text-white/30 w-10 flex-shrink-0 tabular-nums">
                  {play.clock.displayValue}
                </span>
                <span className={`flex-1 ${play.scoringPlay ? "text-live-green font-medium" : "text-white/60"}`}>
                  {play.shortText || play.text}
                </span>
                {play.homeScore && play.awayScore && (
                  <span className="text-[10px] text-white/30 tabular-nums flex-shrink-0">
                    {play.homeScore}-{play.awayScore}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
