import { notFound } from "next/navigation";
import { getTeamDetail, getTeamMatches } from "@/lib/services/team-service";
import Link from "next/link";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return { title: "Team — ScoreSpark" };
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const team = await getTeamDetail(id);

  if (!team) {
    notFound();
  }

  const matches = await getTeamMatches(id);
  const recent = matches.filter((m) => m.status === "finished").slice(0, 5);
  const upcoming = matches.filter((m) => m.status === "upcoming").slice(0, 5);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Team Header */}
      <div className="flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={team.badge}
          alt={team.name}
          width={64}
          height={64}
          className="w-16 h-16 object-contain"
        />
        <div>
          <h1 className="text-2xl font-bold text-white">{team.name}</h1>
          <p className="text-sm text-white/40">
            {[team.venue, team.coach && `Coach: ${team.coach}`]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {team.competitions.length > 0 && (
            <div className="flex gap-1.5 mt-1.5">
              {team.competitions.map((comp) => (
                <span
                  key={comp}
                  className="px-2 py-0.5 text-[10px] font-medium bg-white/5 text-white/50 rounded-full"
                >
                  {comp}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Results */}
      {recent.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
            Recent Results
          </h2>
          <div className="space-y-2">
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
                <span className="text-[10px] text-white/30 ml-2">{m.competition}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Fixtures */}
      {upcoming.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
            Upcoming
          </h2>
          <div className="space-y-2">
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
          </div>
        </div>
      )}

      {/* Squad */}
      {team.squad.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
            Squad ({team.squad.length})
          </h2>
          <div className="bg-card rounded-2xl border border-white/5 overflow-hidden">
            {["Goalkeeper", "Defence", "Midfield", "Offence"].map((pos) => {
              const players = team.squad.filter((p) => p.position === pos);
              if (players.length === 0) return null;
              return (
                <div key={pos}>
                  <div className="px-4 py-2 bg-white/5">
                    <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                      {pos === "Offence" ? "Attack" : pos}
                    </span>
                  </div>
                  {players.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 px-4 py-2.5 border-t border-white/5"
                    >
                      <span className="text-xs text-white/30 w-6 text-right tabular-nums">
                        {p.shirtNumber ?? "—"}
                      </span>
                      <span className="text-sm text-white/80">{p.name}</span>
                      {p.nationality && (
                        <span className="text-[10px] text-white/30 ml-auto">{p.nationality}</span>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
