"use client";

import Link from "next/link";
import { useState } from "react";
import { Match, MatchEvent, Lineup } from "@/lib/types";
import LinescoreTable from "@/components/match-detail/LinescoreTable";
import TeamStatsView from "@/components/match-detail/TeamStatsView";
import NFLSituation from "@/components/match-detail/NFLSituation";
import { generateHypePrimer } from "@/lib/hype-primers";
import PulseReactions from "@/components/PulseReactions";

type Tab = "summary" | "lineups" | "stats" | "events" | "boxscore";

function EventIcon({ type }: { type: MatchEvent["type"] }) {
  switch (type) {
    case "goal":
      return <span className="text-live-green">&#9917;</span>;
    case "penalty":
      return <span className="text-live-green">P</span>;
    case "own-goal":
      return <span className="text-live-red">OG</span>;
    case "yellow-card":
      return (
        <span className="inline-block w-3 h-4 bg-yellow-400 rounded-[1px]" />
      );
    case "red-card":
      return (
        <span className="inline-block w-3 h-4 bg-red-500 rounded-[1px]" />
      );
    case "substitution":
      return <span className="text-blue-accent">&#8644;</span>;
    default:
      return null;
  }
}

// — Soccer tabs —

function SoccerSummaryTab({ match }: { match: Match }) {
  if (match.status === "upcoming") {
    return <UpcomingMessage match={match} />;
  }

  return (
    <div className="space-y-4">
      {match.events.length > 0 ? (
        <div className="space-y-1">
          {match.events.map((event, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 py-2 px-3 rounded-lg ${
                event.team === "home" ? "" : "flex-row-reverse text-right"
              }`}
            >
              <span className="text-xs text-white/30 w-8 tabular-nums flex-shrink-0">
                {event.minute}&apos;
              </span>
              <EventIcon type={event.type} />
              <div className="min-w-0">
                <p className="text-sm text-white/80 truncate">{event.player}</p>
                {event.assistedBy && (
                  <p className="text-[11px] text-white/30">
                    Assist: {event.assistedBy}
                  </p>
                )}
                {event.playerOut && (
                  <p className="text-[11px] text-live-red/60">
                    Out: {event.playerOut}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-white/30">
          <p>No events yet</p>
        </div>
      )}
      {match.venue && (
        <div className="pt-4 border-t border-white/5">
          <p className="text-xs text-white/30">
            <span className="text-white/50">Venue:</span> {match.venue}
          </p>
        </div>
      )}
    </div>
  );
}

function SoccerStatsTab({ match }: { match: Match }) {
  if (!match.stats) {
    return (
      <div className="text-center py-12 text-white/30">
        <p>No stats available</p>
      </div>
    );
  }

  const stats = match.stats;
  const statRows: { label: string; values: [number, number] }[] = [
    { label: "Possession", values: stats.possession },
    { label: "Shots", values: stats.shots },
    { label: "Shots on Target", values: stats.shotsOnTarget },
    { label: "Corners", values: stats.corners },
    { label: "Fouls", values: stats.fouls },
    { label: "Yellow Cards", values: stats.yellowCards },
    { label: "Red Cards", values: stats.redCards },
    { label: "Passes", values: stats.passes },
    { label: "Pass Accuracy", values: stats.passAccuracy },
  ];

  return (
    <div className="space-y-4">
      {statRows.map((row) => {
        const total = row.values[0] + row.values[1];
        const homeWidth = total > 0 ? (row.values[0] / total) * 100 : 50;
        const isPercent =
          row.label === "Possession" || row.label === "Pass Accuracy";

        return (
          <div key={row.label}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-white/80 tabular-nums font-medium">
                {row.values[0]}
                {isPercent ? "%" : ""}
              </span>
              <span className="text-white/40 text-xs">{row.label}</span>
              <span className="text-white/80 tabular-nums font-medium">
                {row.values[1]}
                {isPercent ? "%" : ""}
              </span>
            </div>
            <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5">
              <div
                className="bg-blue-accent/60 rounded-full transition-all duration-500"
                style={{ width: `${homeWidth}%` }}
              />
              <div
                className="bg-white/20 rounded-full transition-all duration-500"
                style={{ width: `${100 - homeWidth}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LineupsTab({
  lineups,
  match,
}: {
  lineups: { home: Lineup; away: Lineup } | null;
  match: Match;
}) {
  if (!lineups) {
    return (
      <div className="text-center py-12 text-white/30">
        <p>Lineups not available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {(["home", "away"] as const).map((side) => {
        const lineup = lineups[side];
        const team = side === "home" ? match.homeTeam : match.awayTeam;
        return (
          <div key={side}>
            <div className="mb-3">
              <p className="text-sm font-semibold text-white/80">{team.shortName}</p>
              <p className="text-[11px] text-white/40">{lineup.formation}</p>
            </div>
            <div className="space-y-1">
              {lineup.starters.map((player) => (
                <div
                  key={player.number}
                  className="flex items-center gap-2 py-1"
                >
                  <span className="text-[11px] text-white/30 w-5 tabular-nums">
                    {player.number}
                  </span>
                  <span className="text-xs text-white/70 truncate">
                    {player.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-white/5">
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">
                Subs
              </p>
              {lineup.substitutes.map((player) => (
                <div
                  key={player.number}
                  className="flex items-center gap-2 py-0.5"
                >
                  <span className="text-[10px] text-white/20 w-5 tabular-nums">
                    {player.number}
                  </span>
                  <span className="text-[11px] text-white/40 truncate">
                    {player.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EventsTab({ match }: { match: Match }) {
  if (match.events.length === 0) {
    return (
      <div className="text-center py-12 text-white/30">
        <p>No events to display</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-[39px] top-0 bottom-0 w-px bg-white/10" />
      <div className="space-y-0">
        {match.events.map((event, i) => (
          <div key={i} className="flex items-start gap-4 py-3 relative">
            <span className="text-xs text-white/40 w-8 tabular-nums text-right flex-shrink-0 pt-0.5">
              {event.minute}&apos;
            </span>
            <div className="w-3 h-3 rounded-full bg-card border-2 border-white/20 flex-shrink-0 mt-0.5 z-10" />
            <div className="flex items-center gap-2 min-w-0">
              <EventIcon type={event.type} />
              <div>
                <p className="text-sm text-white/80">{event.player}</p>
                <p className="text-[11px] text-white/30">
                  {event.team === "home"
                    ? match.homeTeam.shortName
                    : match.awayTeam.shortName}
                  {event.assistedBy && ` \u00B7 Assist: ${event.assistedBy}`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// — American sports summary —

function AmericanSportSummary({ match }: { match: Match }) {
  if (match.status === "upcoming") {
    return <UpcomingMessage match={match} />;
  }

  const detail = match.sportDetail;

  return (
    <div className="space-y-6">
      {/* Linescore (quarter/period/inning scores) */}
      {detail?.linescores && <LinescoreTable match={match} />}

      {/* NFL live situation */}
      {match.sport === "nfl" && <NFLSituation match={match} />}

      {/* Records */}
      {(detail?.homeRecord || detail?.awayRecord) && (
        <div className="flex justify-between text-xs text-white/40 px-1">
          <span>{match.homeTeam.shortName}: {detail?.homeRecord ?? "—"}</span>
          <span>{match.awayTeam.shortName}: {detail?.awayRecord ?? "—"}</span>
        </div>
      )}

      {/* Venue */}
      {match.venue && (
        <div className="pt-4 border-t border-white/5">
          <p className="text-xs text-white/30">
            <span className="text-white/50">Venue:</span> {match.venue}
          </p>
        </div>
      )}
    </div>
  );
}

// — Shared —

function UpcomingMessage({ match }: { match: Match }) {
  const hype = generateHypePrimer(match);

  return (
    <div className="text-center py-12">
      {hype && (
        <p className="text-sm text-white/60 italic mb-4 max-w-sm mx-auto leading-relaxed">
          {hype}
        </p>
      )}
      <p className="text-lg text-white/30">Match hasn&apos;t started yet</p>
      <p className="text-sm text-white/30 mt-2">
        {new Date(match.startTime).toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
        {" at "}
        {new Date(match.startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      {match.venue && <p className="text-sm text-white/30 mt-1">{match.venue}</p>}
    </div>
  );
}

/** Get tabs based on sport */
function getTabsForSport(sport: string, hasStats: boolean, hasLineups: boolean): { id: Tab; label: string }[] {
  if (sport === "soccer") {
    return [
      { id: "summary", label: "Summary" },
      { id: "stats", label: "Stats" },
      { id: "lineups", label: "Lineups" },
      { id: "events", label: "Events" },
    ];
  }
  // American sports
  const tabs: { id: Tab; label: string }[] = [
    { id: "summary", label: "Summary" },
  ];
  if (hasStats) {
    tabs.push({ id: "boxscore", label: "Box Score" });
  }
  return tabs;
}

export default function MatchDetail({
  match,
  lineups,
}: {
  match: Match;
  lineups: { home: Lineup; away: Lineup } | null;
}) {
  const hasTeamStats = (match.sportDetail?.teamStats?.length ?? 0) > 0;
  const tabs = getTabsForSport(match.sport, hasTeamStats, !!lineups);
  const [activeTab, setActiveTab] = useState<Tab>(tabs[0].id);

  const sportColors: Record<string, string> = {
    soccer: "text-sport-soccer",
    nba: "text-sport-nba",
    nfl: "text-sport-nfl",
    nhl: "text-sport-nhl",
    mlb: "text-sport-mlb",
  };
  const sportColor = sportColors[match.sport] ?? "text-sport-nfl";

  return (
    <div className="animate-slide-up">
      {/* Back button */}
      <Link
        href={`/scores/${match.sport === "soccer" ? "" : match.sport}`}
        className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Scores
      </Link>

      {/* Match Header Card */}
      <div className="bg-card rounded-2xl p-6 border border-white/5 mb-6">
        {/* League + Status */}
        <div className="flex items-center justify-between mb-6">
          <span className={`text-xs font-semibold uppercase tracking-wider ${sportColor}`}>
            {match.league}
          </span>
          {match.status === "live" && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-live-green/10 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-live-red opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-live-red" />
              </span>
              <span className="text-xs font-bold text-live-green">
                {match.clock?.displayValue ?? "LIVE"}
              </span>
            </div>
          )}
          {match.status === "finished" && (
            <span className="text-xs font-semibold text-white/40 px-2.5 py-1 bg-white/5 rounded-full">
              Final
            </span>
          )}
          {match.status === "upcoming" && (
            <span className="text-xs text-white/40 px-2.5 py-1 bg-white/5 rounded-full">
              {new Date(match.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>

        {/* Score display */}
        <div className="flex items-center justify-between">
          {/* Home team */}
          <div className="flex-1 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={match.homeTeam.badge}
              alt={match.homeTeam.name}
              width={56}
              height={56}
              className="w-14 h-14 rounded-lg mx-auto mb-2"
            />
            <p className="text-sm font-semibold text-white/90 truncate">
              {match.homeTeam.name}
            </p>
            {match.sportDetail?.homeRecord && (
              <p className="text-[11px] text-white/30 mt-0.5">
                {match.sportDetail.homeRecord}
              </p>
            )}
          </div>

          {/* Score */}
          <div className="flex-shrink-0 px-6">
            {match.status === "upcoming" ? (
              <div className="text-center">
                <p className="text-2xl font-bold text-white/30">vs</p>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-white tabular-nums">
                  {match.homeScore}
                </span>
                <span className="text-xl text-white/20">-</span>
                <span className="text-4xl font-bold text-white tabular-nums">
                  {match.awayScore}
                </span>
              </div>
            )}
          </div>

          {/* Away team */}
          <div className="flex-1 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={match.awayTeam.badge}
              alt={match.awayTeam.name}
              width={56}
              height={56}
              className="w-14 h-14 rounded-lg mx-auto mb-2"
            />
            <p className="text-sm font-semibold text-white/90 truncate">
              {match.awayTeam.name}
            </p>
            {match.sportDetail?.awayRecord && (
              <p className="text-[11px] text-white/30 mt-0.5">
                {match.sportDetail.awayRecord}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Pulse Reactions — live & finished matches */}
      {match.status !== "upcoming" && (
        <div className="mb-6">
          <PulseReactions matchId={match.id} />
        </div>
      )}

      {/* Tabs */}
      {tabs.length > 1 && (
        <div className="flex gap-1 bg-surface rounded-xl p-1 mb-6">
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
      )}

      {/* Tab Content */}
      <div className="bg-card rounded-2xl p-5 border border-white/5">
        {/* Soccer tabs */}
        {match.sport === "soccer" && activeTab === "summary" && <SoccerSummaryTab match={match} />}
        {match.sport === "soccer" && activeTab === "stats" && <SoccerStatsTab match={match} />}
        {match.sport === "soccer" && activeTab === "lineups" && (
          <LineupsTab lineups={lineups} match={match} />
        )}
        {match.sport === "soccer" && activeTab === "events" && <EventsTab match={match} />}

        {/* American sport tabs */}
        {match.sport !== "soccer" && activeTab === "summary" && (
          <AmericanSportSummary match={match} />
        )}
        {match.sport !== "soccer" && activeTab === "boxscore" && (
          <TeamStatsView match={match} />
        )}
      </div>
    </div>
  );
}
