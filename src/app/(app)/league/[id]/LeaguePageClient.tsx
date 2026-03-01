"use client";

import { useState } from "react";
import Link from "next/link";

type Tab = "overview" | "table" | "fixtures";

interface Standing {
  name: string;
  id: string;
  badge: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
}

interface LeagueMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeBadge: string;
  awayBadge: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  date: string;
  homeId: string;
  awayId: string;
}

function StandingsTable({ standings }: { standings: Standing[] }) {
  return (
    <div className="bg-card rounded-2xl border border-white/5 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5">
            <th className="text-left text-[11px] text-white/30 font-medium px-3 py-2 w-8">#</th>
            <th className="text-left text-[11px] text-white/30 font-medium px-2 py-2">Team</th>
            <th className="text-center text-[11px] text-white/30 font-medium px-1 py-2 w-8">P</th>
            <th className="text-center text-[11px] text-white/30 font-medium px-1 py-2 w-8">W</th>
            <th className="text-center text-[11px] text-white/30 font-medium px-1 py-2 w-8">D</th>
            <th className="text-center text-[11px] text-white/30 font-medium px-1 py-2 w-8">L</th>
            <th className="text-center text-[11px] text-white/30 font-medium px-1 py-2 w-10">GD</th>
            <th className="text-center text-[11px] text-white/30 font-medium px-2 py-2 w-10">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, i) => (
            <tr key={team.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors">
              <td className="px-3 py-2.5 text-xs text-white/40 tabular-nums">{i + 1}</td>
              <td className="px-2 py-2.5">
                <Link href={`/team/${team.id}`} className="flex items-center gap-2 hover:text-white transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={team.badge} alt="" className="w-5 h-5 object-contain" />
                  <span className="text-sm text-white/80 truncate">{team.name}</span>
                </Link>
              </td>
              <td className="text-center text-xs text-white/40 tabular-nums">{team.played}</td>
              <td className="text-center text-xs text-white/50 tabular-nums">{team.won}</td>
              <td className="text-center text-xs text-white/40 tabular-nums">{team.drawn}</td>
              <td className="text-center text-xs text-white/40 tabular-nums">{team.lost}</td>
              <td className="text-center text-xs text-white/40 tabular-nums">
                <span className={team.gd > 0 ? "text-green-400/70" : team.gd < 0 ? "text-red-400/70" : ""}>
                  {team.gd > 0 ? "+" : ""}{team.gd}
                </span>
              </td>
              <td className="text-center text-sm font-bold text-white tabular-nums">{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MatchesGrid({ matches }: { matches: LeagueMatch[] }) {
  const completed = matches.filter(m => m.status === "FT");
  const live = matches.filter(m => m.status === "LIVE");
  const upcoming = matches.filter(m => m.status !== "FT" && m.status !== "LIVE");

  const renderMatch = (m: LeagueMatch) => (
    <Link
      key={m.id}
      href={`/match/${m.id}`}
      className="flex items-center justify-between bg-card rounded-xl p-3 border border-white/5 hover:bg-white/5 transition-colors"
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={m.homeBadge} alt="" className="w-5 h-5 object-contain" />
        <span className="text-sm text-white/80 truncate">{m.homeTeam}</span>
      </div>
      <div className="flex items-center gap-2 px-3">
        {m.homeScore !== null ? (
          <>
            <span className="text-sm font-bold text-white tabular-nums">{m.homeScore}</span>
            <span className="text-xs text-white/30">-</span>
            <span className="text-sm font-bold text-white tabular-nums">{m.awayScore}</span>
          </>
        ) : (
          <span className="text-xs text-white/40">{m.status}</span>
        )}
      </div>
      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
        <span className="text-sm text-white/80 truncate text-right">{m.awayTeam}</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={m.awayBadge} alt="" className="w-5 h-5 object-contain" />
      </div>
    </Link>
  );

  return (
    <div className="space-y-4">
      {live.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-live-green uppercase tracking-wider mb-2">🔴 Live</h3>
          <div className="space-y-2">{live.map(renderMatch)}</div>
        </div>
      )}
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Upcoming</h3>
          <div className="space-y-2">{upcoming.map(renderMatch)}</div>
        </div>
      )}
      {completed.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Results</h3>
          <div className="space-y-2">{completed.map(renderMatch)}</div>
        </div>
      )}
    </div>
  );
}

export default function LeaguePageClient({
  leagueId,
  leagueName,
  standings,
  matches,
}: {
  leagueId: string;
  leagueName: string;
  standings: Standing[];
  matches: LeagueMatch[];
}) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "table", label: "Table" },
    { id: "fixtures", label: "Fixtures" },
  ];

  return (
    <div className="space-y-6">
      {/* League Header */}
      <div className="bg-card rounded-2xl p-6 border border-white/5">
        <h1 className="text-2xl font-bold text-white">{leagueName}</h1>
        <p className="text-sm text-white/40 mt-1">
          {standings.length} teams · {matches.length} matches today
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-card text-white shadow-sm"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Today's matches */}
          {matches.length > 0 && <MatchesGrid matches={matches} />}
          {/* Top of table */}
          {standings.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Standings</h3>
              <StandingsTable standings={standings.slice(0, 6)} />
              <button
                onClick={() => setActiveTab("table")}
                className="w-full mt-2 py-2 text-xs text-white/40 hover:text-white/60 transition-colors"
              >
                View full table →
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "table" && <StandingsTable standings={standings} />}
      {activeTab === "fixtures" && <MatchesGrid matches={matches} />}
    </div>
  );
}
