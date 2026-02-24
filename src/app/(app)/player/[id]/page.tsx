import { notFound } from "next/navigation";
import { getPlayerProfile } from "@/lib/services/player-service";
import Link from "next/link";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return { title: "Player — ScoreSpark" };
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const player = await getPlayerProfile(id);
  if (!player) notFound();

  const sportColors: Record<string, string> = {
    soccer: "text-sport-soccer",
    nba: "text-sport-nba",
    nfl: "text-sport-nfl",
    nhl: "text-sport-nhl",
    mlb: "text-sport-mlb",
  };
  const sportBgColors: Record<string, string> = {
    soccer: "bg-sport-soccer/10",
    nba: "bg-sport-nba/10",
    nfl: "bg-sport-nfl/10",
    nhl: "bg-sport-nhl/10",
    mlb: "bg-sport-mlb/10",
  };
  const sportColor = sportColors[player.sport] ?? "text-white";
  const sportBg = sportBgColors[player.sport] ?? "bg-white/5";

  return (
    <div className="animate-slide-up">
      {/* Back button */}
      <Link
        href="/scores"
        className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back
      </Link>

      {/* Player Header */}
      <div className="bg-card rounded-2xl p-6 border border-white/5 mb-6">
        <div className="flex items-start gap-5">
          {/* Photo / Avatar */}
          <div className="shrink-0">
            {player.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={player.photo}
                alt={player.name}
                className="w-24 h-24 rounded-2xl object-cover bg-white/5"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-surface flex items-center justify-center">
                <span className="text-2xl font-bold text-white/20">
                  {player.firstName[0]}{player.lastName[0]}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {player.jersey && (
                <span className={`text-sm font-bold ${sportColor} tabular-nums`}>
                  #{player.jersey}
                </span>
              )}
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${sportColor} ${sportBg}`}>
                {player.position}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white truncate">{player.name}</h1>

            {/* Team */}
            <Link
              href={`/team/${player.team.id}`}
              className="inline-flex items-center gap-2 mt-2 hover:opacity-80 transition-opacity"
            >
              {player.team.badge && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={player.team.badge} alt="" className="w-5 h-5 object-contain" />
              )}
              <span className="text-sm text-white/60">{player.team.name}</span>
            </Link>

            {/* Meta row */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
              {player.age && (
                <span className="text-xs text-white/40">
                  <span className="text-white/60">Age:</span> {player.age}
                </span>
              )}
              {player.nationality && (
                <span className="text-xs text-white/40">
                  <span className="text-white/60">From:</span> {player.nationality}
                </span>
              )}
              {player.height && (
                <span className="text-xs text-white/40">
                  <span className="text-white/60">Height:</span> {player.height}
                </span>
              )}
              {player.weight && (
                <span className="text-xs text-white/40">
                  <span className="text-white/60">Weight:</span> {player.weight}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Season Stats */}
      {player.stats.length > 0 && (
        <div className="bg-card rounded-2xl p-5 border border-white/5">
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">
            Season Stats
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {player.stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-surface rounded-xl px-3 py-3 text-center"
              >
                <p className="text-lg font-bold text-white tabular-nums">
                  {stat.value}
                </p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {player.stats.length === 0 && (
        <div className="bg-card rounded-2xl p-8 border border-white/5 text-center">
          <p className="text-white/30">No season stats available</p>
        </div>
      )}
    </div>
  );
}
