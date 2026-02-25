"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Match, MatchEvent, Lineup } from "@/lib/types";
import LinescoreTable from "@/components/match-detail/LinescoreTable";
import TeamStatsView from "@/components/match-detail/TeamStatsView";
import NFLSituation from "@/components/match-detail/NFLSituation";
import BoxScore from "@/components/match-detail/BoxScore";
import PlayByPlay from "@/components/match-detail/PlayByPlay";
import { generateHypePrimer } from "@/lib/hype-primers";
import PulseReactions from "@/components/PulseReactions";

type Tab = "summary" | "lineups" | "stats" | "events" | "boxscore" | "h2h" | "plays";

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
      {/* Match Info footer */}
      <div className="pt-4 border-t border-white/5 space-y-1">
        {match.venue && (
          <p className="text-xs text-white/30">
            <span className="text-white/50">Venue:</span> {match.venue}
          </p>
        )}
        {match.referee && (
          <p className="text-xs text-white/30">
            <span className="text-white/50">Referee:</span> {match.referee.name}
            {match.referee.nationality && ` (${match.referee.nationality})`}
          </p>
        )}
        {match.matchday && (
          <p className="text-xs text-white/30">
            <span className="text-white/50">Matchday:</span> {match.matchday}
          </p>
        )}
      </div>
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
  const [showFormation, setShowFormation] = useState(true);

  if (!lineups) {
    return (
      <div className="text-center py-12 text-white/30">
        <p>Lineups not available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toggle: Formation / List */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setShowFormation(true)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            showFormation ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
          }`}
        >
          Formation
        </button>
        <button
          onClick={() => setShowFormation(false)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
            !showFormation ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
          }`}
        >
          List
        </button>
      </div>

      {showFormation ? (
        /* Full pitch formation — FotMob style */
        <FullPitchFormation lineups={lineups} match={match} />
      ) : (
        /* List view */
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
                    <div key={player.number} className="flex items-center gap-2 py-1">
                      <span className="text-[11px] text-white/30 w-5 tabular-nums">{player.number}</span>
                      <span className="text-xs text-white/70 truncate">{player.name}</span>
                      {player.position && (
                        <span className="text-[9px] text-white/20 ml-auto">{player.position}</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Subs</p>
                  {lineup.substitutes.map((player) => (
                    <div key={player.number} className="flex items-center gap-2 py-0.5">
                      <span className="text-[10px] text-white/20 w-5 tabular-nums">{player.number}</span>
                      <span className="text-[11px] text-white/40 truncate">{player.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
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

// — Full Pitch Formation Visualization (FotMob-style) —

function FormationRow({ players, color }: { players: { number: number; name: string }[]; color: string }) {
  return (
    <div className="flex justify-center gap-1 sm:gap-3">
      {players.map((p) => (
        <div key={p.number} className="flex flex-col items-center w-11 sm:w-14">
          <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full ${color} flex items-center justify-center shadow-md`}>
            <span className="text-[11px] sm:text-xs font-bold text-white tabular-nums">{p.number}</span>
          </div>
          <span className="text-[8px] sm:text-[9px] text-white/70 text-center leading-tight mt-0.5 truncate w-full">
            {p.name.split(" ").pop()}
          </span>
        </div>
      ))}
    </div>
  );
}

function FullPitchFormation({ lineups, match }: { lineups: { home: Lineup; away: Lineup }; match: Match }) {
  function buildRows(lineup: Lineup): { number: number; name: string }[][] {
    const parts = lineup.formation?.split("-").map(Number).filter(Boolean) ?? [];
    if (parts.length === 0) return [];
    const rowSizes = [1, ...parts]; // GK + formation
    const rows: { number: number; name: string }[][] = [];
    let idx = 0;
    for (const size of rowSizes) {
      const row: { number: number; name: string }[] = [];
      for (let i = 0; i < size && idx < lineup.starters.length; i++) {
        row.push(lineup.starters[idx]);
        idx++;
      }
      rows.push(row);
    }
    return rows;
  }

  const homeRows = buildRows(lineups.home);
  const awayRows = buildRows(lineups.away);

  return (
    <div className="space-y-4">
      {/* Full pitch */}
      <div className="relative bg-gradient-to-b from-emerald-900/50 via-emerald-800/30 to-emerald-900/50 rounded-2xl overflow-hidden">
        {/* Pitch markings */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Center line */}
          <div className="absolute left-4 right-4 top-1/2 h-px bg-white/10" />
          {/* Center circle */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-28 sm:h-28 rounded-full border border-white/10" />
          {/* Center dot */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/15" />
          {/* Top box */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 sm:w-48 h-12 sm:h-16 border-b border-l border-r border-white/10 rounded-b-sm" />
          {/* Bottom box */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 sm:w-48 h-12 sm:h-16 border-t border-l border-r border-white/10 rounded-t-sm" />
        </div>

        {/* Home team — top half */}
        <div className="relative z-10 px-3 pt-4 pb-2">
          <div className="flex items-center justify-center gap-2 mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={match.homeTeam.badge} alt="" className="w-4 h-4 object-contain" />
            <span className="text-[10px] font-bold text-white/50">{match.homeTeam.shortName} ({lineups.home.formation})</span>
          </div>
          <div className="flex flex-col gap-3 sm:gap-4">
            {homeRows.map((row, i) => (
              <FormationRow key={i} players={row} color="bg-blue-accent/80" />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-3 sm:h-4" />

        {/* Away team — bottom half (reversed) */}
        <div className="relative z-10 px-3 pt-2 pb-4">
          <div className="flex flex-col-reverse gap-3 sm:gap-4">
            {awayRows.map((row, i) => (
              <FormationRow key={i} players={row} color="bg-live-red/70" />
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 mt-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={match.awayTeam.badge} alt="" className="w-4 h-4 object-contain" />
            <span className="text-[10px] font-bold text-white/50">{match.awayTeam.shortName} ({lineups.away.formation})</span>
          </div>
        </div>
      </div>

      {/* Substitutes — side by side */}
      <div className="grid grid-cols-2 gap-4">
        {(["home", "away"] as const).map((side) => {
          const lineup = lineups[side];
          const team = side === "home" ? match.homeTeam : match.awayTeam;
          return (
            <div key={side}>
              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2 font-bold">
                {team.shortName} Subs
              </p>
              <div className="space-y-0.5">
                {lineup.substitutes.map((player) => (
                  <div key={player.number} className="flex items-center gap-1.5 py-0.5">
                    <span className="text-[10px] text-white/20 w-4 tabular-nums text-right">{player.number}</span>
                    <span className="text-[11px] text-white/40 truncate">{player.name}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// — Head-to-Head —

interface H2HData {
  aggregates: {
    numberOfMatches: number;
    totalGoals: number;
    homeTeam: { name: string; wins: number; draws: number; losses: number };
    awayTeam: { name: string; wins: number; draws: number; losses: number };
  };
  matches: {
    utcDate: string;
    homeTeam: { name: string; shortName: string };
    awayTeam: { name: string; shortName: string };
    score: { fullTime: { home: number | null; away: number | null } };
  }[];
}

function Head2HeadTab({ match }: { match: Match }) {
  const [h2h, setH2h] = useState<H2HData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!match.id.startsWith("fd-")) {
      setLoading(false);
      return;
    }
    const matchId = match.id.replace("fd-", "");
    fetch(`/api/v1/h2h?matchId=${matchId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setH2h(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [match.id]);

  if (loading) {
    return <div className="text-center py-12 text-white/30 animate-pulse">Loading head-to-head...</div>;
  }

  if (!h2h || !h2h.aggregates) {
    return <div className="text-center py-12 text-white/30">Head-to-head data not available</div>;
  }

  const agg = h2h.aggregates;
  const totalMatches = agg.numberOfMatches;
  const homeWins = agg.homeTeam.wins;
  const draws = agg.homeTeam.draws;
  const awayWins = agg.awayTeam.wins;

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div>
        <p className="text-xs text-white/40 text-center mb-3">{totalMatches} previous meetings</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-blue-accent tabular-nums w-8 text-right">{homeWins}</span>
          <div className="flex-1 flex h-3 rounded-full overflow-hidden gap-0.5">
            {homeWins > 0 && <div className="bg-blue-accent/60 rounded-full" style={{ width: `${(homeWins / totalMatches) * 100}%` }} />}
            {draws > 0 && <div className="bg-white/20 rounded-full" style={{ width: `${(draws / totalMatches) * 100}%` }} />}
            {awayWins > 0 && <div className="bg-gold-spark/60 rounded-full" style={{ width: `${(awayWins / totalMatches) * 100}%` }} />}
          </div>
          <span className="text-sm font-bold text-gold-spark tabular-nums w-8">{awayWins}</span>
        </div>
        <div className="flex justify-between text-[10px] text-white/30 mt-1">
          <span>{match.homeTeam.shortName} wins</span>
          <span>{draws} draws</span>
          <span>{match.awayTeam.shortName} wins</span>
        </div>
      </div>

      {/* Recent matches */}
      {h2h.matches.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Recent Matches</h3>
          <div className="space-y-2">
            {h2h.matches.slice(0, 5).map((m, i) => (
              <div key={i} className="flex items-center justify-between py-2 px-3 bg-white/[0.02] rounded-lg">
                <span className="text-[10px] text-white/30 w-20">
                  {new Date(m.utcDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "2-digit" })}
                </span>
                <div className="flex items-center gap-2 flex-1 justify-center">
                  <span className="text-xs text-white/70 text-right flex-1 truncate">{m.homeTeam.shortName}</span>
                  <span className="text-sm font-bold text-white tabular-nums px-2">
                    {m.score.fullTime.home ?? "-"} - {m.score.fullTime.away ?? "-"}
                  </span>
                  <span className="text-xs text-white/70 text-left flex-1 truncate">{m.awayTeam.shortName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Goals stat */}
      <div className="text-center">
        <p className="text-xs text-white/30">
          Total goals in H2H: <span className="text-white/60 font-medium">{agg.totalGoals}</span>
          <span className="text-white/20"> ({(agg.totalGoals / Math.max(totalMatches, 1)).toFixed(1)} per match)</span>
        </p>
      </div>
    </div>
  );
}

// — American sports summary —

function PlayerLeaders({ match }: { match: Match }) {
  const leaders = match.sportDetail?.leaders;
  if (!leaders || leaders.length === 0) return null;

  const homeLeaders = leaders.filter((l) => l.teamSide === "home");
  const awayLeaders = leaders.filter((l) => l.teamSide === "away");

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
        Player Leaders
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {/* Home leaders */}
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-white/50">{match.homeTeam.shortName}</p>
          {homeLeaders.map((l, i) => (
            <div key={i} className="bg-white/5 rounded-lg p-2">
              <p className="text-[10px] text-white/30 uppercase">{l.category}</p>
              <p className="text-sm text-white/80 font-medium truncate">{l.playerName}</p>
              <p className="text-xs text-gold-spark tabular-nums">{l.displayValue}</p>
            </div>
          ))}
        </div>
        {/* Away leaders */}
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-white/50">{match.awayTeam.shortName}</p>
          {awayLeaders.map((l, i) => (
            <div key={i} className="bg-white/5 rounded-lg p-2">
              <p className="text-[10px] text-white/30 uppercase">{l.category}</p>
              <p className="text-sm text-white/80 font-medium truncate">{l.playerName}</p>
              <p className="text-xs text-gold-spark tabular-nums">{l.displayValue}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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

      {/* Player Leaders / Player Stats */}
      {match.status === "finished" && <PlayerLeaders match={match} />}

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

// — Betting Lines for upcoming games —

interface BettingLine {
  book: string;
  spread: { home: string; away: string };
  moneyline: { home: string; away: string };
  overUnder: string;
}

function generateBettingLines(match: Match): BettingLine[] {
  // Generate realistic looking betting lines based on sport
  // These are sample lines — in production these would come from an odds API
  const sport = match.sport;

  if (sport === "soccer") {
    return [
      {
        book: "DraftKings",
        spread: { home: "-0.5 (-110)", away: "+0.5 (-110)" },
        moneyline: { home: "+120", away: "+240" },
        overUnder: "O/U 2.5",
      },
      {
        book: "FanDuel",
        spread: { home: "-0.5 (-115)", away: "+0.5 (-105)" },
        moneyline: { home: "+125", away: "+235" },
        overUnder: "O/U 2.5",
      },
    ];
  }

  if (sport === "nba") {
    return [
      {
        book: "DraftKings",
        spread: { home: "-4.5 (-110)", away: "+4.5 (-110)" },
        moneyline: { home: "-185", away: "+155" },
        overUnder: "O/U 224.5",
      },
      {
        book: "FanDuel",
        spread: { home: "-4 (-108)", away: "+4 (-112)" },
        moneyline: { home: "-180", away: "+152" },
        overUnder: "O/U 225",
      },
    ];
  }

  if (sport === "nfl") {
    return [
      {
        book: "DraftKings",
        spread: { home: "-3 (-110)", away: "+3 (-110)" },
        moneyline: { home: "-150", away: "+130" },
        overUnder: "O/U 47.5",
      },
      {
        book: "FanDuel",
        spread: { home: "-2.5 (-105)", away: "+2.5 (-115)" },
        moneyline: { home: "-148", away: "+126" },
        overUnder: "O/U 48",
      },
    ];
  }

  if (sport === "nhl") {
    return [
      {
        book: "DraftKings",
        spread: { home: "-1.5 (+155)", away: "+1.5 (-180)" },
        moneyline: { home: "-140", away: "+120" },
        overUnder: "O/U 6.5",
      },
      {
        book: "FanDuel",
        spread: { home: "-1.5 (+150)", away: "+1.5 (-175)" },
        moneyline: { home: "-135", away: "+115" },
        overUnder: "O/U 6.5",
      },
    ];
  }

  // MLB
  return [
    {
      book: "DraftKings",
      spread: { home: "-1.5 (+130)", away: "+1.5 (-150)" },
      moneyline: { home: "-130", away: "+110" },
      overUnder: "O/U 8.5",
    },
    {
      book: "FanDuel",
      spread: { home: "-1.5 (+135)", away: "+1.5 (-155)" },
      moneyline: { home: "-125", away: "+108" },
      overUnder: "O/U 8.5",
    },
  ];
}

function BettingLinesCard({ match }: { match: Match }) {
  const lines = generateBettingLines(match);

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider text-center">
        Betting Lines
      </h3>
      {lines.map((line) => (
        <div key={line.book} className="bg-surface rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gold-spark">{line.book}</span>
            <span className="text-[10px] text-white/20">{line.overUnder}</span>
          </div>

          {/* Spread + Moneyline grid */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[10px] text-white/30 mb-1">Spread</p>
            </div>
            <div>
              <p className="text-[10px] text-white/30 mb-1">Moneyline</p>
            </div>
            <div>
              <p className="text-[10px] text-white/30 mb-1">O/U</p>
            </div>
          </div>

          {/* Home team row */}
          <div className="grid grid-cols-3 gap-2 text-center mt-1">
            <div className="bg-white/5 rounded-lg py-1.5 px-2">
              <p className="text-[10px] text-white/40 mb-0.5">{match.homeTeam.shortName}</p>
              <p className="text-xs font-bold text-white/80 tabular-nums">{line.spread.home}</p>
            </div>
            <div className="bg-white/5 rounded-lg py-1.5 px-2">
              <p className="text-[10px] text-white/40 mb-0.5">{match.homeTeam.shortName}</p>
              <p className="text-xs font-bold text-white/80 tabular-nums">{line.moneyline.home}</p>
            </div>
            <div className="bg-white/5 rounded-lg py-1.5 px-2">
              <p className="text-[10px] text-white/40 mb-0.5">Over</p>
              <p className="text-xs font-bold text-white/80 tabular-nums">{line.overUnder.replace("O/U ", "O ")}</p>
            </div>
          </div>

          {/* Away team row */}
          <div className="grid grid-cols-3 gap-2 text-center mt-1">
            <div className="bg-white/5 rounded-lg py-1.5 px-2">
              <p className="text-[10px] text-white/40 mb-0.5">{match.awayTeam.shortName}</p>
              <p className="text-xs font-bold text-white/80 tabular-nums">{line.spread.away}</p>
            </div>
            <div className="bg-white/5 rounded-lg py-1.5 px-2">
              <p className="text-[10px] text-white/40 mb-0.5">{match.awayTeam.shortName}</p>
              <p className="text-xs font-bold text-white/80 tabular-nums">{line.moneyline.away}</p>
            </div>
            <div className="bg-white/5 rounded-lg py-1.5 px-2">
              <p className="text-[10px] text-white/40 mb-0.5">Under</p>
              <p className="text-xs font-bold text-white/80 tabular-nums">{line.overUnder.replace("O/U ", "U ")}</p>
            </div>
          </div>
        </div>
      ))}

      <p className="text-[9px] text-white/15 text-center">
        Lines for reference only. Check sportsbook for current odds.
      </p>
    </div>
  );
}

// — Shared —

function UpcomingMessage({ match }: { match: Match }) {
  const hype = generateHypePrimer(match);

  return (
    <div className="py-6">
      <div className="text-center">
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

      {/* Betting lines for upcoming games */}
      <BettingLinesCard match={match} />
    </div>
  );
}

/** Get tabs based on sport */
function getTabsForSport(sport: string, hasStats: boolean, hasLineups: boolean, isFDMatch: boolean): { id: Tab; label: string }[] {
  if (sport === "soccer") {
    const tabs: { id: Tab; label: string }[] = [
      { id: "summary", label: "Summary" },
      { id: "stats", label: "Stats" },
      { id: "lineups", label: "Lineups" },
      { id: "events", label: "Events" },
    ];
    if (isFDMatch) {
      tabs.push({ id: "h2h", label: "H2H" });
    }
    return tabs;
  }
  // American sports
  const tabs: { id: Tab; label: string }[] = [
    { id: "summary", label: "Summary" },
    { id: "boxscore", label: "Box Score" },
    { id: "plays", label: "Plays" },
  ];
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
  const isFDMatch = match.id.startsWith("fd-");
  const tabs = getTabsForSport(match.sport, hasTeamStats, !!lineups, isFDMatch);
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

        {/* Score display — FotMob-style: home left, score center, away right */}
        <div className="flex items-center justify-center gap-4">
          {/* Home team */}
          <div className="flex-1 flex flex-col items-center min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={match.homeTeam.badge}
              alt={match.homeTeam.name}
              width={64}
              height={64}
              className="w-16 h-16 object-contain mb-2"
            />
            <p className="text-sm font-semibold text-white/90 text-center truncate w-full">
              {match.homeTeam.shortName}
            </p>
            {match.sportDetail?.homeRecord && (
              <p className="text-[11px] text-white/30 mt-0.5">
                {match.sportDetail.homeRecord}
              </p>
            )}
          </div>

          {/* Score — centered */}
          <div className="flex-shrink-0 min-w-[100px] text-center">
            {match.status === "upcoming" ? (
              <p className="text-2xl font-bold text-white/30">vs</p>
            ) : (
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-bold text-white tabular-nums">
                  {match.homeScore}
                </span>
                <span className="text-2xl font-medium text-white/20">-</span>
                <span className="text-5xl font-bold text-white tabular-nums">
                  {match.awayScore}
                </span>
              </div>
            )}
          </div>

          {/* Away team */}
          <div className="flex-1 flex flex-col items-center min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={match.awayTeam.badge}
              alt={match.awayTeam.name}
              width={64}
              height={64}
              className="w-16 h-16 object-contain mb-2"
            />
            <p className="text-sm font-semibold text-white/90 text-center truncate w-full">
              {match.awayTeam.shortName}
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
        {match.sport === "soccer" && activeTab === "h2h" && <Head2HeadTab match={match} />}

        {/* American sport tabs */}
        {match.sport !== "soccer" && activeTab === "summary" && (
          <AmericanSportSummary match={match} />
        )}
        {match.sport !== "soccer" && activeTab === "boxscore" && (
          <BoxScore match={match} />
        )}
        {match.sport !== "soccer" && activeTab === "plays" && (
          <PlayByPlay match={match} />
        )}
      </div>
    </div>
  );
}
