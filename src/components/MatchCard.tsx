"use client";

import Link from "next/link";
import { Match } from "@/lib/types";
import { useFavorites } from "@/lib/favorites";
import { useSpoilerMode } from "@/lib/spoiler-mode";

function TeamBadge({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={32}
      height={32}
      className="w-8 h-8 rounded-md object-cover"
    />
  );
}

function formatLiveTime(match: Match): string {
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

function StatusBadge({ match }: { match: Match }) {
  if (match.status === "live") {
    return (
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-live-pulse absolute inline-flex h-full w-full rounded-full bg-live-red opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-live-red" />
        </span>
        <span className="text-xs font-bold text-live-green">
          {formatLiveTime(match)}
        </span>
      </div>
    );
  }
  if (match.status === "finished") {
    return <span className="text-xs font-semibold text-white/50">FT</span>;
  }
  const time = new Date(match.startTime);
  return (
    <span className="text-xs text-white/40">
      {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </span>
  );
}

export default function MatchCard({ match }: { match: Match }) {
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

  const sportBorderColors: Record<string, string> = {
    soccer: "border-l-sport-soccer/40",
    nba: "border-l-sport-nba/40",
    nfl: "border-l-sport-nfl/40",
    nhl: "border-l-sport-nhl/40",
    mlb: "border-l-sport-mlb/40",
  };
  const sportBorderColor = sportBorderColors[match.sport] ?? "border-l-sport-nfl/40";

  return (
    <Link href={`/match/${match.id}`} className="block group" onClick={handleReveal}>
      <div
        className={`bg-card hover:bg-card-hover rounded-xl p-4 border border-white/5 border-l-2 ${sportBorderColor} transition-all duration-200 hover:border-white/10 hover:scale-[1.01] active:scale-[0.99]`}
      >
        {/* League + Status row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-medium text-white/40 uppercase tracking-wide">
            {match.leagueShort}
          </span>
          <StatusBadge match={match} />
        </div>

        {/* Teams + Score */}
        <div className="space-y-2">
          {/* Home */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <TeamBadge src={match.homeTeam.badge} alt={match.homeTeam.name} />
              <span className={`text-sm font-medium truncate ${homeIsFav ? "text-gold-spark" : "text-white/90"}`}>
                {match.homeTeam.name}
              </span>
              {homeIsFav && (
                <svg className="w-3.5 h-3.5 text-gold-spark flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              )}
            </div>
            <span
              className={`tabular-nums text-lg font-bold ml-4 ${
                !revealed ? "blur-sm select-none" :
                match.status === "live"
                  ? "text-white"
                  : match.status === "finished"
                  ? "text-white/80"
                  : "text-white/30"
              }`}
            >
              {match.homeScore !== null ? (revealed ? match.homeScore : "?") : "-"}
            </span>
          </div>

          {/* Away */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <TeamBadge src={match.awayTeam.badge} alt={match.awayTeam.name} />
              <span className={`text-sm font-medium truncate ${awayIsFav ? "text-gold-spark" : "text-white/90"}`}>
                {match.awayTeam.name}
              </span>
              {awayIsFav && (
                <svg className="w-3.5 h-3.5 text-gold-spark flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              )}
            </div>
            <span
              className={`tabular-nums text-lg font-bold ml-4 ${
                !revealed ? "blur-sm select-none" :
                match.status === "live"
                  ? "text-white"
                  : match.status === "finished"
                  ? "text-white/80"
                  : "text-white/30"
              }`}
            >
              {match.awayScore !== null ? (revealed ? match.awayScore : "?") : "-"}
            </span>
          </div>
        </div>

        {/* Team records for American sports */}
        {match.sportDetail && (match.sportDetail.homeRecord || match.sportDetail.awayRecord) && (
          <div className="mt-2 flex justify-between text-[10px] text-white/20 px-11">
            <span>{match.sportDetail.homeRecord}</span>
            <span>{match.sportDetail.awayRecord}</span>
          </div>
        )}

        {/* Venue for upcoming games */}
        {match.status === "upcoming" && match.venue && (
          <div className="mt-2 text-center">
            <span className="text-[10px] text-white/15">{match.venue}</span>
          </div>
        )}

        {/* Linescores for finished/live American sports */}
        {revealed && match.sportDetail?.linescores && match.status !== "upcoming" && (
          <div className="mt-3 pt-3 border-t border-white/5">
            <div className="flex items-center gap-2 text-[10px] text-white/30 font-mono tabular-nums">
              <span className="w-8" />
              {match.sportDetail.linescores.home.map((_, i) => (
                <span key={i} className="w-6 text-center">
                  {match.sport === "nba" ? `Q${i + 1}` : match.sport === "nhl" ? `P${i + 1}` : match.sport === "mlb" ? i + 1 : `Q${i + 1}`}
                </span>
              ))}
              <span className="w-8 text-center font-bold">T</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono tabular-nums">
              <span className="w-8 truncate text-white/30">{match.homeTeam.shortName}</span>
              {match.sportDetail.linescores.home.map((s, i) => (
                <span key={i} className="w-6 text-center">{s}</span>
              ))}
              <span className="w-8 text-center font-bold text-white/60">{match.homeScore}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono tabular-nums">
              <span className="w-8 truncate text-white/30">{match.awayTeam.shortName}</span>
              {match.sportDetail.linescores.away.map((s, i) => (
                <span key={i} className="w-6 text-center">{s}</span>
              ))}
              <span className="w-8 text-center font-bold text-white/60">{match.awayScore}</span>
            </div>
          </div>
        )}

        {/* Goal scorers for live/finished soccer (hidden in spoiler mode) */}
        {revealed && match.sport === "soccer" && match.events.length > 0 && match.status !== "upcoming" && (
          <div className="mt-3 pt-3 border-t border-white/5">
            <div className="space-y-0.5">
              {match.events
                .filter((e) => e.type === "goal" || e.type === "penalty" || e.type === "own-goal")
                .map((event, i) => (
                  <div
                    key={i}
                    className={`text-[11px] text-white/40 ${event.team === "away" ? "text-right" : ""}`}
                  >
                    <span className="text-white/20">{event.minute}&apos;</span>{" "}
                    {event.player}
                    {event.type === "penalty" && " (P)"}
                    {event.type === "own-goal" && " (OG)"}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
