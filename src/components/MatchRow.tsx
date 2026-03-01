"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Match } from "@/lib/types";
import { useFavorites } from "@/lib/favorites";
import { useSpoilerMode } from "@/lib/spoiler-mode";

function Badge({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={18}
      height={18}
      className="w-[18px] h-[18px] rounded-sm object-contain flex-shrink-0"
      onError={(e) => {
        const t = e.target as HTMLImageElement;
        if (!t.dataset.fb) {
          t.dataset.fb = "1";
          t.src = `https://placehold.co/36x36/1E1B3A/7EB6E6?text=${encodeURIComponent(alt.slice(0, 2))}`;
        }
      }}
    />
  );
}

function formatTime(match: Match): string {
  if (match.clock?.displayValue) return match.clock.displayValue;
  const min = match.clock?.value ?? match.minute;
  if (!min) return "LIVE";
  switch (match.sport) {
    case "soccer": return `${min}'`;
    case "nba": return `Q${min}`;
    case "nfl": return `Q${min}`;
    case "nhl": return `P${min}`;
    case "mlb": return `Inn ${min}`;
    default: return `${min}`;
  }
}

function statusText(match: Match): string {
  switch (match.statusDetail) {
    case "aet": return "AET";
    case "pen": return "PEN";
    case "postponed": return "PPD";
    case "cancelled": return "CAN";
    case "suspended": return "SUS";
    case "abandoned": return "ABD";
    case "walkover": return "W/O";
    default: return "FT";
  }
}

function StatusCell({ match }: { match: Match }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (match.status !== "upcoming") return;
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, [match.status]);

  if (match.status === "live") {
    return (
      <div className="flex items-center gap-1">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-live-red opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-live-red" />
        </span>
        <span className="text-[11px] font-bold text-live-green tabular-nums">
          {formatTime(match)}
        </span>
      </div>
    );
  }

  if (match.status === "finished") {
    return <span className="text-[11px] font-semibold text-white/40">{statusText(match)}</span>;
  }

  // Upcoming
  const time = new Date(match.startTime);
  const ms = time.getTime() - now;
  if (ms > 0 && ms <= 3600_000) {
    const m = Math.floor(ms / 60_000);
    return <span className="text-[11px] font-medium text-emerald-400/70">{m}m</span>;
  }
  return (
    <span className="text-[11px] text-white/40 tabular-nums">
      {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </span>
  );
}

function TeamLink({ teamId, children, className }: { teamId: string; children: React.ReactNode; className?: string }) {
  const router = useRouter();
  return (
    <span
      role="link"
      className={`cursor-pointer hover:underline decoration-white/20 underline-offset-2 ${className ?? ""}`}
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); router.push(`/team/${teamId}`); }}
    >
      {children}
    </span>
  );
}

export default function MatchRow({ match }: { match: Match }) {
  const { isFavorite } = useFavorites();
  const { isRevealed, revealMatch } = useSpoilerMode();
  const homeIsFav = isFavorite(match.homeTeam.id);
  const awayIsFav = isFavorite(match.awayTeam.id);
  const revealed = isRevealed(match.id);

  const handleReveal = (e: React.MouseEvent) => {
    if (!revealed) {
      e.preventDefault();
      revealMatch(match.id);
    }
  };

  const homeWinning = match.homeScore !== null && match.awayScore !== null && match.homeScore > match.awayScore;
  const awayWinning = match.homeScore !== null && match.awayScore !== null && match.awayScore > match.homeScore;
  const isLive = match.status === "live";
  const isFinished = match.status === "finished";
  const hasScore = match.homeScore !== null;

  const homeRedCard = match.events.some(e => e.type === "red-card" && e.team === "home");
  const awayRedCard = match.events.some(e => e.type === "red-card" && e.team === "away");

  // Goal scorers for soccer
  const goals = match.sport === "soccer" && match.status !== "upcoming"
    ? match.events.filter(e => e.type === "goal" || e.type === "penalty" || e.type === "own-goal")
    : [];
  const homeGoals = goals.filter(g => g.team === "home");
  const awayGoals = goals.filter(g => g.team === "away");

  return (
    <Link href={`/match/${match.id}`} className="block group" onClick={handleReveal}>
      <div className="flex items-center px-2 py-[7px] hover:bg-white/[0.03] transition-colors border-b border-white/[0.04] last:border-b-0">
        {/* Status/Time column */}
        <div className="w-[52px] flex-shrink-0 text-center">
          <StatusCell match={match} />
        </div>

        {/* Home team - right aligned */}
        <div className="flex-1 flex items-center justify-end gap-1.5 min-w-0 pr-2">
          {homeIsFav && (
            <svg className="w-2.5 h-2.5 text-gold-spark flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          )}
          {homeRedCard && (
            <span className="inline-block w-[3px] h-[10px] bg-red-500 rounded-[1px] flex-shrink-0" />
          )}
          <TeamLink teamId={match.homeTeam.id} className={`text-[13px] truncate ${
            homeIsFav ? "text-gold-spark font-semibold" :
            isFinished && homeWinning ? "text-white font-semibold" :
            isLive && homeWinning ? "text-white font-semibold" :
            "text-white/80 font-medium"
          }`}>
            {match.homeTeam.name}
          </TeamLink>
          <TeamLink teamId={match.homeTeam.id}><Badge src={match.homeTeam.badge} alt={match.homeTeam.name} /></TeamLink>
        </div>

        {/* Score column */}
        <div className="w-[48px] flex-shrink-0 text-center">
          {hasScore ? (
            <span className={`text-[14px] tabular-nums font-bold ${
              !revealed ? "blur-sm select-none" :
              isLive ? "text-white" : "text-white/70"
            }`}>
              {revealed ? `${match.homeScore} - ${match.awayScore}` : "? - ?"}
            </span>
          ) : (
            <span className="text-[13px] text-white/20">vs</span>
          )}
        </div>

        {/* Away team - left aligned */}
        <div className="flex-1 flex items-center gap-1.5 min-w-0 pl-2">
          <TeamLink teamId={match.awayTeam.id}><Badge src={match.awayTeam.badge} alt={match.awayTeam.name} /></TeamLink>
          <TeamLink teamId={match.awayTeam.id} className={`text-[13px] truncate ${
            awayIsFav ? "text-gold-spark font-semibold" :
            isFinished && awayWinning ? "text-white font-semibold" :
            isLive && awayWinning ? "text-white font-semibold" :
            "text-white/80 font-medium"
          }`}>
            {match.awayTeam.name}
          </TeamLink>
          {awayRedCard && (
            <span className="inline-block w-[3px] h-[10px] bg-red-500 rounded-[1px] flex-shrink-0" />
          )}
          {awayIsFav && (
            <svg className="w-2.5 h-2.5 text-gold-spark flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          )}
        </div>
      </div>

      {/* Goal scorers row (compact, below the match row) */}
      {revealed && goals.length > 0 && (
        <div className="flex items-start px-2 pb-1 border-b border-white/[0.04]">
          <div className="w-[52px] flex-shrink-0" />
          <div className="flex-1 text-right pr-2">
            {homeGoals.map((g, i) => (
              <span key={i} className="text-[9px] text-white/30 leading-tight">
                {i > 0 && ", "}{g.player} {g.minute}&apos;{g.type === "penalty" ? " (P)" : g.type === "own-goal" ? " (OG)" : ""}
              </span>
            ))}
          </div>
          <div className="w-[48px] flex-shrink-0" />
          <div className="flex-1 pl-2">
            {awayGoals.map((g, i) => (
              <span key={i} className="text-[9px] text-white/30 leading-tight">
                {i > 0 && ", "}{g.player} {g.minute}&apos;{g.type === "penalty" ? " (P)" : g.type === "own-goal" ? " (OG)" : ""}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* HT / Aggregate for finished soccer */}
      {revealed && match.sport === "soccer" && isFinished && (match.sportDetail?.htScore || match.sportDetail?.aggregate) && (
        <div className="flex justify-center pb-1 border-b border-white/[0.04]">
          {match.sportDetail?.htScore && (
            <span className="text-[9px] text-white/20">
              HT {match.sportDetail.htScore.home}-{match.sportDetail.htScore.away}
            </span>
          )}
          {match.sportDetail?.aggregate && (
            <span className="text-[9px] text-purple-400/50 font-medium ml-2">
              Agg {match.sportDetail.aggregate.home}-{match.sportDetail.aggregate.away}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
