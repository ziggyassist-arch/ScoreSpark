"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import type { TeamDetail, SquadPlayer } from "@/lib/services/team-service";
import type { Team } from "@/lib/types";

interface TeamMatch {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  date: string;
  competition: string;
}

type Tab = "overview" | "fixtures" | "squad" | "stats" | "standings" | "transfers" | "news";

const sportColors: Record<string, string> = {
  soccer: "text-sport-soccer",
  nba: "text-sport-nba",
  nfl: "text-sport-nfl",
  nhl: "text-sport-nhl",
  mlb: "text-sport-mlb",
};

function OverviewTab({ team, recent, upcoming }: { team: TeamDetail; recent: TeamMatch[]; upcoming: TeamMatch[] }) {
  // Next match
  const nextMatch = upcoming[0];

  return (
    <div className="space-y-6">
      {/* Next Match */}
      {nextMatch && (
        <Link href={`/match/${nextMatch.id}`} className="block">
          <div className="bg-card rounded-2xl p-4 border border-white/5 hover:bg-white/5 transition-colors">
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Next match</h3>
            {nextMatch.competition && (
              <p className="text-[11px] text-white/30 mb-2">{nextMatch.competition}</p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={nextMatch.homeTeam.badge} alt="" width={24} height={24} className="w-6 h-6 object-contain" />
                <span className="text-sm text-white/80">{nextMatch.homeTeam.shortName}</span>
              </div>
              <div className="text-center">
                <p className="text-xs text-white/50">
                  {new Date(nextMatch.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                </p>
                <p className="text-sm font-bold text-white/70">
                  {new Date(nextMatch.date).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/80">{nextMatch.awayTeam.shortName}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={nextMatch.awayTeam.badge} alt="" width={24} height={24} className="w-6 h-6 object-contain" />
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Team Info Card */}
      <div className="bg-card rounded-2xl p-4 border border-white/5 space-y-3">
        {team.venue && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/40">Stadium</span>
            <span className="text-sm text-white/70">{team.venue}</span>
          </div>
        )}
        {team.coach && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/40">Coach</span>
            <span className="text-sm text-white/70">{team.coach}</span>
          </div>
        )}
        {team.founded && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/40">Founded</span>
            <span className="text-sm text-white/70">{team.founded}</span>
          </div>
        )}
        {team.squad.length > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/40">Squad Size</span>
            <span className="text-sm text-white/70">{team.squad.length} players</span>
          </div>
        )}
      </div>

      {/* Form — Recent Results */}
      {recent.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
            Recent Form
          </h3>
          <div className="flex gap-1.5 mb-3">
            {recent.slice(0, 5).map((m) => {
              const isHome = m.homeTeam.id === `fd-${team.id.replace("fd-", "")}` ||
                m.homeTeam.id === team.id;
              const teamScore = isHome ? m.homeScore : m.awayScore;
              const oppScore = isHome ? m.awayScore : m.homeScore;
              const result = teamScore !== null && oppScore !== null
                ? teamScore > oppScore ? "W" : teamScore < oppScore ? "L" : "D"
                : "?";
              return (
                <span
                  key={m.id}
                  className={`w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold ${
                    result === "W" ? "bg-live-green/20 text-live-green"
                      : result === "L" ? "bg-live-red/20 text-live-red"
                      : result === "D" ? "bg-yellow-500/20 text-yellow-500"
                      : "bg-white/5 text-white/30"
                  }`}
                >
                  {result}
                </span>
              );
            })}
          </div>

          <div className="space-y-2">
            {recent.map((m) => (
              <Link
                key={m.id}
                href={`/match/${m.id}`}
                className="flex items-center justify-between bg-card rounded-xl p-3 border border-white/5 hover:bg-white/5 transition-colors hover-card-lift"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.homeTeam.badge} alt="" width={20} height={20} className="w-5 h-5 object-contain" />
                  <span className="text-sm text-white/80 truncate">{m.homeTeam.shortName}</span>
                  <span className="text-sm font-bold text-white tabular-nums">
                    {m.homeScore} - {m.awayScore}
                  </span>
                  <span className="text-sm text-white/80 truncate">{m.awayTeam.shortName}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.awayTeam.badge} alt="" width={20} height={20} className="w-5 h-5 object-contain" />
                </div>
                <span className="text-[10px] text-white/30 ml-2">{m.competition}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Next Match */}
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
            Next Match
          </h3>
          <Link href={`/match/${upcoming[0].id}`} className="block">
            <div className="bg-card rounded-xl p-4 border border-white/5 hover:bg-white/5 transition-colors">
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={upcoming[0].homeTeam.badge} alt="" className="w-10 h-10 object-contain" />
                  <span className="text-xs text-white/70 mt-1">{upcoming[0].homeTeam.shortName}</span>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-white/40 mb-0.5">{upcoming[0].competition}</p>
                  <p className="text-lg font-bold text-white/30">vs</p>
                  <p className="text-[10px] text-white/30 mt-0.5">
                    {new Date(upcoming[0].date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={upcoming[0].awayTeam.badge} alt="" className="w-10 h-10 object-contain" />
                  <span className="text-xs text-white/70 mt-1">{upcoming[0].awayTeam.shortName}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Fixture Difficulty — FotMob-style */}
      {upcoming.length > 1 && (
        <div>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
            Fixture Difficulty
          </h3>
          <div className="flex gap-2">
            {upcoming.slice(0, 5).map((m) => {
              const isHome = m.homeTeam.id === team.id;
              const opponent = isHome ? m.awayTeam : m.homeTeam;
              return (
                <Link
                  key={m.id}
                  href={`/match/${m.id}`}
                  className="flex-1 bg-card rounded-lg p-2 border border-white/5 hover:bg-white/5 transition-colors text-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={opponent.badge} alt="" className="w-6 h-6 object-contain mx-auto mb-1" />
                  <p className="text-[10px] text-white/60 truncate">{opponent.shortName}</p>
                  <p className="text-[9px] text-white/30">{isHome ? "(H)" : "(A)"}</p>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming Fixtures List */}
      {upcoming.length > 1 && (
        <div>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
            Fixtures
          </h3>
          <div className="space-y-1">
            {upcoming.slice(0, 5).map((m) => (
              <Link
                key={m.id}
                href={`/match/${m.id}`}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] text-white/30 w-16">
                    {new Date(m.date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                  </span>
                  <span className="text-[10px] text-white/20">{m.competition}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.homeTeam.badge} alt="" className="w-4 h-4 object-contain" />
                  <span className="text-xs text-white/60">{m.homeTeam.shortName}</span>
                  <span className="text-xs text-white/30">vs</span>
                  <span className="text-xs text-white/60">{m.awayTeam.shortName}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.awayTeam.badge} alt="" className="w-4 h-4 object-contain" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FixturesTab({ recent, upcoming }: { recent: TeamMatch[]; upcoming: TeamMatch[] }) {
  const all = [...upcoming, ...recent.reverse()];

  if (all.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 gap-2">
        <Image src="/scorespark_white_transparent_bg.png" alt="" width={32} height={32} className="h-8 w-8 object-contain opacity-15" />
        <p className="text-sm text-white/30">No fixtures available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {upcoming.length > 0 && (
        <>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
            Upcoming
          </h3>
          {upcoming.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between bg-card rounded-xl p-3 border border-white/5"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.homeTeam.badge} alt="" width={20} height={20} className="w-5 h-5 object-contain" />
                <span className="text-sm text-white/80 truncate">{m.homeTeam.shortName}</span>
                <span className="text-xs text-white/30">vs</span>
                <span className="text-sm text-white/80 truncate">{m.awayTeam.shortName}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.awayTeam.badge} alt="" width={20} height={20} className="w-5 h-5 object-contain" />
              </div>
              <span className="text-[10px] text-white/30 ml-2">
                {new Date(m.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </span>
            </div>
          ))}
        </>
      )}

      {recent.length > 0 && (
        <>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mt-4 mb-2">
            Results
          </h3>
          {recent.map((m) => (
            <Link
              key={m.id}
              href={`/match/${m.id}`}
              className="flex items-center justify-between bg-card rounded-xl p-3 border border-white/5 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.homeTeam.badge} alt="" width={20} height={20} className="w-5 h-5 object-contain" />
                <span className="text-sm text-white/80 truncate">{m.homeTeam.shortName}</span>
                <span className="text-sm font-bold text-white tabular-nums">
                  {m.homeScore} - {m.awayScore}
                </span>
                <span className="text-sm text-white/80 truncate">{m.awayTeam.shortName}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.awayTeam.badge} alt="" width={20} height={20} className="w-5 h-5 object-contain" />
              </div>
              <span className="text-[10px] text-white/30 ml-2">
                {new Date(m.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </span>
            </Link>
          ))}
        </>
      )}
    </div>
  );
}

function SquadTab({ squad, sport }: { squad: SquadPlayer[]; sport: string }) {
  if (squad.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 gap-2">
        <Image src="/scorespark_white_transparent_bg.png" alt="" width={32} height={32} className="h-8 w-8 object-contain opacity-15" />
        <p className="text-sm text-white/30">Squad data not available</p>
      </div>
    );
  }

  // Group by position
  const positionGroups = sport === "soccer"
    ? ["Goalkeeper", "Defence", "Midfield", "Offence"]
    : [...new Set(squad.map((p) => p.position))].sort();

  return (
    <div className="bg-card rounded-2xl border border-white/5 overflow-hidden">
      {positionGroups.map((pos) => {
        const players = squad.filter((p) => p.position === pos);
        if (players.length === 0) return null;
        return (
          <div key={pos}>
            <div className="px-4 py-2 bg-white/5">
              <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                {pos === "Offence" ? "Attack" : pos}
              </span>
            </div>
            {players.map((p) => (
              <Link
                key={p.id}
                href={`/player/${p.id}`}
                className="flex items-center gap-3 px-4 py-2.5 border-t border-white/5 hover:bg-white/[0.03] transition-colors"
              >
                <span className="text-xs text-white/30 w-6 text-right tabular-nums">
                  {p.shirtNumber ?? "—"}
                </span>
                <span className="text-sm text-white/80 flex-1 group-hover:text-white">{p.name}</span>
                {p.nationality && (
                  <span className="text-[10px] text-white/30">{p.nationality}</span>
                )}
                <svg className="w-4 h-4 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/** Map sport/competitions to standings league slugs */
function getStandingsSlug(sport: string, competitions: string[]): string | null {
  if (sport === "soccer") {
    const compMap: Record<string, string> = {
      "Premier League": "epl",
      "La Liga": "laliga",
      "Bundesliga": "bundesliga",
      "Serie A": "seriea",
      "Ligue 1": "ligue1",
      "Champions League": "ucl",
      "UEFA Champions League": "ucl",
      "Eredivisie": "eredivisie",
      "Championship": "championship",
      "Primeira Liga": "ligapt",
    };
    for (const comp of competitions) {
      if (compMap[comp]) return compMap[comp];
    }
    return "epl";
  }
  const sportMap: Record<string, string> = {
    nba: "nba-east",
    nfl: "nfl",
    nhl: "nhl",
    mlb: "mlb-al",
  };
  return sportMap[sport] ?? null;
}

function StandingsTab({ team }: { team: TeamDetail }) {
  const slug = getStandingsSlug(team.sport, team.competitions);
  return (
    <div className="space-y-4">
      <p className="text-sm text-white/50">
        View full standings for {team.competitions[0] ?? team.sport.toUpperCase()}
      </p>
      {slug && (
        <Link
          href={`/standings/${slug}`}
          className="inline-flex items-center gap-2 px-4 py-3 bg-card rounded-xl border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all text-sm font-medium text-gold-spark"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
          </svg>
          View Standings
        </Link>
      )}
    </div>
  );
}

function StatsTab({ team, matches }: { team: TeamDetail; matches: TeamMatch[] }) {
  const finished = matches.filter((m) => m.status === "finished");
  const totalGames = finished.length;

  if (totalGames === 0) {
    return (
      <div className="flex flex-col items-center py-12 gap-2">
        <Image src="/scorespark_white_transparent_bg.png" alt="" width={32} height={32} className="h-8 w-8 object-contain opacity-15" />
        <p className="text-sm text-white/30">No stats available yet</p>
      </div>
    );
  }

  // Calculate basic stats from matches
  let wins = 0, draws = 0, losses = 0;
  let goalsFor = 0, goalsAgainst = 0;

  finished.forEach((m) => {
    const isHome = m.homeTeam.id === team.id;
    const teamScore = isHome ? (m.homeScore ?? 0) : (m.awayScore ?? 0);
    const oppScore = isHome ? (m.awayScore ?? 0) : (m.homeScore ?? 0);
    goalsFor += teamScore;
    goalsAgainst += oppScore;
    if (teamScore > oppScore) wins++;
    else if (teamScore < oppScore) losses++;
    else draws++;
  });

  const winPct = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : "0.0";

  const statRows = [
    { label: "Games Played", value: totalGames.toString() },
    { label: "Wins", value: wins.toString() },
    { label: "Draws", value: draws.toString() },
    { label: "Losses", value: losses.toString() },
    { label: "Win %", value: `${winPct}%` },
    { label: "Goals/Points For", value: goalsFor.toString() },
    { label: "Goals/Points Against", value: goalsAgainst.toString() },
    { label: "Goal/Point Diff", value: `${goalsFor - goalsAgainst > 0 ? "+" : ""}${goalsFor - goalsAgainst}` },
  ];

  return (
    <div className="bg-card rounded-2xl border border-white/5 overflow-hidden">
      {statRows.map((row) => (
        <div key={row.label} className="flex items-center justify-between px-4 py-3 border-t border-white/5 first:border-t-0">
          <span className="text-sm text-white/40">{row.label}</span>
          <span className="text-sm font-bold text-white/80 tabular-nums">{row.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Transfers Tab ─── */
function TransfersTab({ team }: { team: TeamDetail }) {
  const [transfers, setTransfers] = useState<{
    in: { name: string; from: string; fee?: string }[];
    out: { name: string; to: string; fee?: string }[];
  } | null>(null);

  useEffect(() => {
    async function fetchTransfers() {
      try {
        const espnMatch = team.id.match(/^espn-(\w+)-(?:team-)?(\d+)$/);
        if (!espnMatch) return;
        const [, sport, espnId] = espnMatch;
        
        // For soccer teams, try to get transfer data
        if (sport === "soccer") {
          // ESPN doesn't have a direct transfers API, show squad changes
          const res = await fetch(`/api/v1/team-form?teamId=${team.id}&sport=soccer`);
          if (res.ok) {
            // Placeholder — transfers data isn't readily available from ESPN
            setTransfers({ in: [], out: [] });
          }
        } else {
          setTransfers({ in: [], out: [] });
        }
      } catch { /* ignore */ }
    }
    fetchTransfers();
  }, [team.id]);

  return (
    <div className="bg-card rounded-2xl border border-white/5 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Transfers</h2>
      {!transfers ? (
        <p className="text-sm text-white/30 text-center py-8">Loading...</p>
      ) : transfers.in.length === 0 && transfers.out.length === 0 ? (
        <p className="text-sm text-white/30 text-center py-8">
          Transfer data is being added. Check back soon.
        </p>
      ) : (
        <div className="space-y-6">
          {transfers.in.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-green-400 mb-2">Arrivals</h3>
              {transfers.in.map((t, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-t border-white/5">
                  <span className="text-sm text-white/80">{t.name}</span>
                  <span className="text-xs text-white/40">from {t.from}</span>
                </div>
              ))}
            </div>
          )}
          {transfers.out.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-red-400 mb-2">Departures</h3>
              {transfers.out.map((t, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-t border-white/5">
                  <span className="text-sm text-white/80">{t.name}</span>
                  <span className="text-xs text-white/40">to {t.to}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── News Tab ─── */
function NewsTab({ team }: { team: TeamDetail }) {
  const [articles, setArticles] = useState<{ title: string; source: string; url: string; time: string }[]>([]);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch(`/api/v1/news?sport=${team.sport}&team=${encodeURIComponent(team.name)}`);
        if (res.ok) {
          const data = await res.json();
          setArticles(data.articles || []);
        }
      } catch { /* ignore */ }
    }
    fetchNews();
  }, [team.sport, team.name]);

  if (articles.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-white/5 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">News</h2>
        <p className="text-sm text-white/30 text-center py-8">
          No recent news found for {team.name}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-white/5 overflow-hidden">
      <h2 className="text-lg font-semibold text-white p-4 pb-2">News</h2>
      {articles.map((article, i) => (
        <a
          key={i}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col gap-1 px-4 py-3 border-t border-white/5 hover:bg-white/5 transition-colors"
        >
          <span className="text-sm text-white/80 line-clamp-2">{article.title}</span>
          <span className="text-[11px] text-white/30">{article.source} · {article.time}</span>
        </a>
      ))}
    </div>
  );
}

export default function TeamPageClient({
  team,
  matches,
}: {
  team: TeamDetail;
  matches: TeamMatch[];
}) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const recent = matches.filter((m) => m.status === "finished").slice(0, 10);
  const upcoming = matches.filter((m) => m.status === "upcoming").slice(0, 10);

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "standings", label: "Table" },
    { id: "fixtures", label: "Fixtures" },
    { id: "squad", label: "Squad" },
    { id: "stats", label: "Stats" },
    { id: "transfers", label: "Transfers" },
    { id: "news", label: "News" },
  ];

  const sportColor = sportColors[team.sport] ?? "text-sport-soccer";

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Team Header — FotMob style */}
      <div className="bg-card rounded-2xl p-6 border border-white/5">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={team.badge}
            alt={team.name}
            width={72}
            height={72}
            className="w-[72px] h-[72px] object-contain"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white truncate">{team.name}</h1>
            <p className="text-sm text-white/40 mt-0.5">
              {[team.venue, team.coach && `Coach: ${team.coach}`]
                .filter(Boolean)
                .join(" · ")}
            </p>
            {team.competitions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {team.competitions.map((comp) => (
                  <span
                    key={comp}
                    className={`px-2 py-0.5 text-[10px] font-medium bg-white/5 rounded-full ${sportColor}`}
                  >
                    {comp}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs — scrollable for many tabs */}
      <div className="flex gap-1 bg-surface rounded-xl p-1 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-card text-white shadow-sm"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && <OverviewTab team={team} recent={recent} upcoming={upcoming} />}
      {activeTab === "fixtures" && <FixturesTab recent={recent} upcoming={upcoming} />}
      {activeTab === "squad" && <SquadTab squad={team.squad} sport={team.sport} />}
      {activeTab === "stats" && <StatsTab team={team} matches={matches} />}
      {activeTab === "standings" && <StandingsTab team={team} />}
      {activeTab === "transfers" && <TransfersTab team={team} />}
      {activeTab === "news" && <NewsTab team={team} />}
    </div>
  );
}
