"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

/* ── Types ── */

interface PlayoffTeam {
  seed: number;
  name: string;
  abbreviation: string;
  logo: string;
  wins: number;
  losses: number;
  conference: string;
}

interface ConferenceData {
  name: string;
  teams: PlayoffTeam[];
}

interface PlayoffBracketData {
  sport: string;
  season: string;
  conferences: ConferenceData[];
}

interface BracketMatchup {
  topSeed: PlayoffTeam | null;
  bottomSeed: PlayoffTeam | null;
  roundLabel: string;
}

/* ── Sport-specific bracket configs ── */

interface BracketConfig {
  playoffTeams: number; // per conference
  rounds: string[];
  label: string;
  conferenceLabels: [string, string];
}

const BRACKET_CONFIGS: Record<string, BracketConfig> = {
  nba: {
    playoffTeams: 8,
    rounds: ["First Round", "Conf. Semis", "Conf. Finals", "Finals"],
    label: "NBA Playoffs",
    conferenceLabels: ["Eastern Conference", "Western Conference"],
  },
  nfl: {
    playoffTeams: 7,
    rounds: ["Wild Card", "Divisional", "Conf. Championship", "Super Bowl"],
    label: "NFL Playoffs",
    conferenceLabels: ["AFC", "NFC"],
  },
  nhl: {
    playoffTeams: 8,
    rounds: ["First Round", "Second Round", "Conf. Finals", "Stanley Cup Final"],
    label: "NHL Playoffs",
    conferenceLabels: ["Eastern Conference", "Western Conference"],
  },
  mlb: {
    playoffTeams: 6,
    rounds: ["Wild Card", "Division Series", "Championship Series", "World Series"],
    label: "MLB Postseason",
    conferenceLabels: ["American League", "National League"],
  },
};

/* ── Seeding Logic ── */

/**
 * Create bracket matchups from seeded teams.
 * Standard bracket pairing: 1v8, 4v5, 3v6, 2v7 (for 8 teams).
 * NFL: 1 gets bye, 2v7, 3v6, 4v5 (for 7 teams).
 * MLB: top 2 get byes, 3v6, 4v5 (for 6 teams).
 */
function createFirstRoundMatchups(
  teams: PlayoffTeam[],
  sport: string
): BracketMatchup[] {
  const config = BRACKET_CONFIGS[sport];
  if (!config) return [];

  const seeded = teams.slice(0, config.playoffTeams);

  if (sport === "nfl") {
    // NFL: #1 seed gets bye, remaining 6 play wild card
    // 2v7, 3v6, 4v5
    return [
      {
        topSeed: seeded[0] ?? null, // #1 bye
        bottomSeed: null,
        roundLabel: "Bye",
      },
      {
        topSeed: seeded[1] ?? null, // #2
        bottomSeed: seeded[6] ?? null, // #7
        roundLabel: config.rounds[0],
      },
      {
        topSeed: seeded[2] ?? null, // #3
        bottomSeed: seeded[5] ?? null, // #6
        roundLabel: config.rounds[0],
      },
      {
        topSeed: seeded[3] ?? null, // #4
        bottomSeed: seeded[4] ?? null, // #5
        roundLabel: config.rounds[0],
      },
    ];
  }

  if (sport === "mlb") {
    // MLB: top 2 get byes, 3v6, 4v5
    return [
      {
        topSeed: seeded[0] ?? null, // #1 bye
        bottomSeed: null,
        roundLabel: "Bye",
      },
      {
        topSeed: seeded[1] ?? null, // #2 bye
        bottomSeed: null,
        roundLabel: "Bye",
      },
      {
        topSeed: seeded[2] ?? null, // #3
        bottomSeed: seeded[5] ?? null, // #6
        roundLabel: config.rounds[0],
      },
      {
        topSeed: seeded[3] ?? null, // #4
        bottomSeed: seeded[4] ?? null, // #5
        roundLabel: config.rounds[0],
      },
    ];
  }

  // NBA / NHL: 1v8, 4v5, 3v6, 2v7
  return [
    {
      topSeed: seeded[0] ?? null, // #1
      bottomSeed: seeded[7] ?? null, // #8
      roundLabel: config.rounds[0],
    },
    {
      topSeed: seeded[3] ?? null, // #4
      bottomSeed: seeded[4] ?? null, // #5
      roundLabel: config.rounds[0],
    },
    {
      topSeed: seeded[2] ?? null, // #3
      bottomSeed: seeded[5] ?? null, // #6
      roundLabel: config.rounds[0],
    },
    {
      topSeed: seeded[1] ?? null, // #2
      bottomSeed: seeded[6] ?? null, // #7
      roundLabel: config.rounds[0],
    },
  ];
}

/* ── Sub-components ── */

function TeamSlot({
  team,
  isBye,
  position,
}: {
  team: PlayoffTeam | null;
  isBye?: boolean;
  position: "top" | "bottom";
}) {
  if (!team) {
    return (
      <div
        className={`flex items-center gap-2 px-3 py-2 bg-white/[0.02] ${
          position === "top" ? "rounded-t-lg border-b border-white/5" : "rounded-b-lg"
        }`}
      >
        <div className="w-5 h-5 rounded-full bg-white/5" />
        <span className="text-xs text-white/15 italic">TBD</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 transition-colors hover:bg-white/5 ${
        position === "top" ? "rounded-t-lg border-b border-white/5" : "rounded-b-lg"
      } ${isBye ? "bg-gold-spark/5" : ""}`}
    >
      <span className="text-[10px] font-bold text-white/25 w-3 text-center tabular-nums">
        {team.seed}
      </span>
      {team.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={team.logo} alt="" className="w-5 h-5 object-contain flex-shrink-0" />
      ) : (
        <div className="w-5 h-5 rounded-full bg-white/10 flex-shrink-0" />
      )}
      <span className="text-xs font-semibold text-white/80 truncate flex-1">
        {team.abbreviation}
      </span>
      <span className="text-[10px] text-white/30 tabular-nums">
        {team.wins}-{team.losses}
      </span>
    </div>
  );
}

function MatchupCard({
  matchup,
  showConnector,
}: {
  matchup: BracketMatchup;
  showConnector?: boolean;
}) {
  const isBye = matchup.bottomSeed === null;

  return (
    <div className="flex items-center">
      <div className={`w-44 sm:w-48 rounded-lg border overflow-hidden ${
        isBye ? "border-gold-spark/20" : "border-white/10"
      } bg-card`}>
        <TeamSlot team={matchup.topSeed} isBye={isBye} position="top" />
        {isBye ? (
          <div className="px-3 py-1.5 text-center">
            <span className="text-[9px] font-bold text-gold-spark/60 uppercase tracking-wider">
              BYE
            </span>
          </div>
        ) : (
          <TeamSlot team={matchup.bottomSeed} position="bottom" />
        )}
      </div>
      {showConnector && (
        <div className="w-4 sm:w-6 border-t border-white/10" />
      )}
    </div>
  );
}

function EmptyRoundSlot({ label }: { label: string }) {
  return (
    <div className="w-44 sm:w-48 rounded-lg border border-white/5 bg-card">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5">
        <div className="w-5 h-5 rounded-full bg-white/5" />
        <span className="text-xs text-white/15 italic">Winner of {label}</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="w-5 h-5 rounded-full bg-white/5" />
        <span className="text-xs text-white/15 italic">Winner of {label}</span>
      </div>
    </div>
  );
}

function ConferenceBracket({
  conference,
  teams,
  sport,
  isRight,
}: {
  conference: string;
  teams: PlayoffTeam[];
  sport: string;
  isRight?: boolean;
}) {
  const config = BRACKET_CONFIGS[sport];
  if (!config) return null;

  const firstRound = createFirstRoundMatchups(teams, sport);
  const numSecondRound = Math.ceil(firstRound.length / 2);

  return (
    <div className="flex-1 min-w-0">
      {/* Conference header */}
      <div className={`mb-4 ${isRight ? "text-right" : ""}`}>
        <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider">
          {conference}
        </h3>
      </div>

      {/* Bracket rounds flow */}
      <div className={`flex items-start gap-2 sm:gap-3 ${isRight ? "flex-row-reverse" : ""}`}>
        {/* Round 1 — First Round / Wild Card */}
        <div className="flex flex-col gap-3">
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-wider mb-1 text-center">
            {config.rounds[0]}
          </p>
          {firstRound.map((matchup, i) => (
            <MatchupCard key={`r1-${i}`} matchup={matchup} showConnector />
          ))}
        </div>

        {/* Connector column */}
        <div className="flex flex-col justify-around h-full pt-6">
          {Array.from({ length: numSecondRound }).map((_, i) => (
            <div key={`conn-${i}`} className="h-[88px] flex items-center">
              <div className="w-0 h-full border-r border-white/10" />
            </div>
          ))}
        </div>

        {/* Round 2 */}
        <div className="flex flex-col justify-around pt-6" style={{ gap: `${firstRound.length > 2 ? 88 + 12 : 88}px` }}>
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-wider mb-1 text-center">
            {config.rounds[1]}
          </p>
          {Array.from({ length: numSecondRound }).map((_, i) => (
            <EmptyRoundSlot key={`r2-${i}`} label={config.rounds[0]} />
          ))}
        </div>

        {/* Round 3 — Conference Finals */}
        <div className="flex flex-col justify-center pt-6" style={{ marginTop: numSecondRound > 1 ? "60px" : "0" }}>
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-wider mb-1 text-center">
            {config.rounds[2]}
          </p>
          <EmptyRoundSlot label={config.rounds[1]} />
        </div>
      </div>
    </div>
  );
}

/* ── Compact Mobile View ── */

function CompactBracketView({
  data,
  sport,
}: {
  data: PlayoffBracketData;
  sport: string;
}) {
  const config = BRACKET_CONFIGS[sport];
  if (!config) return null;

  return (
    <div className="space-y-8">
      {data.conferences.map((conf) => {
        const matchups = createFirstRoundMatchups(conf.teams, sport);
        return (
          <div key={conf.name}>
            <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-3">
              {conf.name}
            </h3>

            {/* Round labels */}
            <div className="flex gap-1.5 overflow-x-auto hide-scrollbar mb-4 pb-1">
              {config.rounds.map((round) => (
                <span
                  key={round}
                  className="px-2.5 py-1 rounded-md text-[10px] font-semibold text-white/25 bg-white/5 whitespace-nowrap"
                >
                  {round}
                </span>
              ))}
            </div>

            {/* First round matchups */}
            <div className="space-y-2">
              {matchups.map((matchup, i) => (
                <MatchupCard key={`${conf.name}-${i}`} matchup={matchup} />
              ))}
            </div>

            {/* Later rounds placeholders */}
            <div className="mt-4 space-y-3">
              {config.rounds.slice(1).map((round) => (
                <div key={round} className="border-t border-white/5 pt-3">
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-wider mb-2">
                    {round}
                  </p>
                  <div className="flex items-center gap-2 px-3 py-3 bg-card rounded-lg border border-dashed border-white/10">
                    <div className="w-4 h-4 rounded-full bg-white/5" />
                    <span className="text-xs text-white/20 italic">
                      Matchups determined by earlier rounds
                    </span>
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

/* ── Full Desktop Bracket View ── */

function DesktopBracketView({
  data,
  sport,
}: {
  data: PlayoffBracketData;
  sport: string;
}) {
  const config = BRACKET_CONFIGS[sport];
  if (!config) return null;

  const leftConf = data.conferences[0];
  const rightConf = data.conferences[1];

  return (
    <div>
      {/* Bracket area */}
      <div className="flex gap-6">
        {leftConf && (
          <ConferenceBracket
            conference={leftConf.name}
            teams={leftConf.teams}
            sport={sport}
          />
        )}

        {/* Finals column */}
        <div className="flex flex-col items-center justify-center min-w-[180px] pt-6">
          <p className="text-[9px] font-bold text-gold-spark/50 uppercase tracking-wider mb-2">
            {config.rounds[config.rounds.length - 1]}
          </p>
          <div className="w-44 sm:w-48 rounded-lg border border-gold-spark/20 bg-card relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-gold-spark/5 to-transparent pointer-events-none" />
            <div className="flex items-center gap-2 px-3 py-3 border-b border-white/5 relative">
              <div className="w-5 h-5 rounded-full bg-white/5" />
              <span className="text-xs text-white/20 italic">{config.conferenceLabels[0]} Champ</span>
            </div>
            <div className="px-3 py-1 text-center relative">
              <span className="text-[8px] font-bold text-gold-spark/30 uppercase tracking-widest">
                VS
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-3 relative">
              <div className="w-5 h-5 rounded-full bg-white/5" />
              <span className="text-xs text-white/20 italic">{config.conferenceLabels[1]} Champ</span>
            </div>
          </div>
          {/* Trophy icon */}
          <div className="mt-3 flex flex-col items-center">
            <svg className="w-8 h-8 text-gold-spark/30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 3h14v2h-1v1a7.003 7.003 0 01-4.764 6.636A1.5 1.5 0 0114.5 14h.5a2 2 0 012 2v1h1a1 1 0 110 2H6a1 1 0 110-2h1v-1a2 2 0 012-2h.5a1.5 1.5 0 011.264-1.364A7.003 7.003 0 016 6V5H5V3zm3 2v1a5 5 0 005 5 5 5 0 005-5V5H8z" />
            </svg>
            <span className="text-[9px] text-gold-spark/30 font-bold uppercase tracking-wider mt-1">
              Champion
            </span>
          </div>
        </div>

        {rightConf && (
          <ConferenceBracket
            conference={rightConf.name}
            teams={rightConf.teams}
            sport={sport}
            isRight
          />
        )}
      </div>
    </div>
  );
}

/* ── Seeding Table ── */

function SeedingTable({
  conferences,
  sport,
}: {
  conferences: ConferenceData[];
  sport: string;
}) {
  const config = BRACKET_CONFIGS[sport];
  if (!config) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
      {conferences.map((conf) => {
        const playoffTeams = conf.teams.slice(0, config.playoffTeams);
        const bubbleTeams = conf.teams.slice(config.playoffTeams, config.playoffTeams + 3);

        return (
          <div key={conf.name} className="bg-card rounded-xl border border-white/5 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5">
              <h4 className="text-sm font-bold text-white/60">{conf.name}</h4>
            </div>

            {/* Playoff-bound teams */}
            {playoffTeams.map((team, i) => {
              const isByeTeam =
                (sport === "nfl" && i === 0) ||
                (sport === "mlb" && i < 2);

              return (
                <div
                  key={team.abbreviation}
                  className={`flex items-center gap-3 px-4 py-2.5 border-b border-white/5 ${
                    isByeTeam ? "bg-gold-spark/5" : ""
                  }`}
                >
                  <span
                    className={`w-5 text-center text-xs font-bold tabular-nums ${
                      i < 3 ? "text-gold-spark" : "text-white/30"
                    }`}
                  >
                    {team.seed}
                  </span>
                  {team.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={team.logo} alt="" className="w-6 h-6 object-contain flex-shrink-0" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-white/10 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/90 truncate">{team.name}</p>
                  </div>
                  <span className="text-xs text-white/40 tabular-nums">
                    {team.wins}-{team.losses}
                  </span>
                  {isByeTeam && (
                    <span className="text-[9px] font-bold text-gold-spark/60 uppercase tracking-wider">
                      BYE
                    </span>
                  )}
                </div>
              );
            })}

            {/* Bubble teams */}
            {bubbleTeams.length > 0 && (
              <>
                <div className="px-4 py-1.5 bg-white/[0.02]">
                  <span className="text-[9px] font-bold text-white/15 uppercase tracking-wider">
                    Outside looking in
                  </span>
                </div>
                {bubbleTeams.map((team) => (
                  <div
                    key={team.abbreviation}
                    className="flex items-center gap-3 px-4 py-2 border-b border-white/5 opacity-50"
                  >
                    <span className="w-5 text-center text-xs font-bold text-white/20 tabular-nums">
                      {team.seed}
                    </span>
                    {team.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={team.logo} alt="" className="w-6 h-6 object-contain flex-shrink-0" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-white/10 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white/60 truncate">{team.name}</p>
                    </div>
                    <span className="text-xs text-white/30 tabular-nums">
                      {team.wins}-{team.losses}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Main Page ── */

type ViewMode = "bracket" | "seeding";

export default function PlayoffsPage() {
  const { sport } = useParams<{ sport: string }>();
  const [data, setData] = useState<PlayoffBracketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("bracket");

  useEffect(() => {
    if (!sport || sport === "soccer") return;
    setLoading(true);
    setError(null);
    fetch(`/api/v1/playoffs?sport=${sport}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
      })
      .then((d) => setData(d))
      .catch(() => setError("Failed to load playoff data"))
      .finally(() => setLoading(false));
  }, [sport]);

  if (sport === "soccer") {
    return (
      <div className="py-16 text-center">
        <p className="text-white/30">Playoff brackets are for American sports</p>
        <p className="text-white/20 text-sm mt-2">Soccer uses a league table format</p>
      </div>
    );
  }

  const config = BRACKET_CONFIGS[sport];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold text-white">
          {config?.label ?? "Playoff Bracket"}
        </h1>
      </div>
      <p className="text-xs text-white/30 mb-5">
        {data?.season ? `${data.season} Season` : "Current season"} — Projected seeding based on standings
      </p>

      {/* View mode toggle */}
      <div className="flex gap-1.5 mb-6">
        <button
          onClick={() => setViewMode("bracket")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            viewMode === "bracket"
              ? "bg-white/10 text-white ring-1 ring-white/10"
              : "text-white/30 hover:text-white/50 hover:bg-white/5"
          }`}
        >
          Bracket
        </button>
        <button
          onClick={() => setViewMode("seeding")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            viewMode === "seeding"
              ? "bg-white/10 text-white ring-1 ring-white/10"
              : "text-white/30 hover:text-white/50 hover:bg-white/5"
          }`}
        >
          Seeding
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-12">
          <Image
            src="/scorespark_white_transparent_bg.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 object-contain animate-pulse-glow opacity-40"
          />
        </div>
      )}

      {/* Error state */}
      {error && (
        <p className="text-red-400 text-sm text-center py-8">{error}</p>
      )}

      {/* Content */}
      {!loading && data && viewMode === "bracket" && (
        <>
          {/* Desktop: full bracket */}
          <div className="hidden lg:block overflow-x-auto">
            <DesktopBracketView data={data} sport={sport} />
          </div>
          {/* Mobile/tablet: compact view */}
          <div className="lg:hidden">
            <CompactBracketView data={data} sport={sport} />
          </div>
        </>
      )}

      {!loading && data && viewMode === "seeding" && (
        <SeedingTable conferences={data.conferences} sport={sport} />
      )}

      {/* Legend */}
      {!loading && data && (
        <div className="mt-8 flex flex-wrap items-center gap-4 text-[10px] text-white/20">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-gold-spark/10 border border-gold-spark/20" />
            <span>First-round bye</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-white/5 border border-white/10" />
            <span>Matchup</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm border border-dashed border-white/10" />
            <span>TBD</span>
          </div>
          <span className="ml-auto text-white/15">
            Seeding updates with standings
          </span>
        </div>
      )}
    </div>
  );
}
