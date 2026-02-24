import { notFound } from "next/navigation";
import Link from "next/link";
import type { Sport } from "@/lib/types";
import { getTeamsForSport, getSoccerTeamsForCompetition, SOCCER_LEAGUES } from "@/lib/services/team-service";
import SoccerLeagueSelector from "./SoccerLeagueSelector";

const validSports = new Set<string>(["soccer", "nba", "nfl", "nhl", "mlb"]);

const sportLabels: Record<Sport, string> = {
  soccer: "Soccer",
  nba: "NBA",
  nfl: "NFL",
  nhl: "NHL",
  mlb: "MLB",
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [{ sport: "soccer" }, { sport: "nba" }, { sport: "nfl" }, { sport: "nhl" }, { sport: "mlb" }];
}

export function generateMetadata() {
  return { title: "Teams — ScoreSpark" };
}

export default async function TeamsPage({
  params,
  searchParams,
}: {
  params: Promise<{ sport: string }>;
  searchParams: Promise<{ league?: string }>;
}) {
  const { sport } = await params;
  const sp = await searchParams;

  if (!validSports.has(sport)) {
    notFound();
  }

  // Soccer: use league selector, default to Champions League
  if (sport === "soccer") {
    const leagueCode = sp?.league || "CL";
    const validCode = SOCCER_LEAGUES.find((l) => l.code === leagueCode) ? leagueCode : "CL";
    const teams = await getSoccerTeamsForCompetition(validCode);
    const currentLeague = SOCCER_LEAGUES.find((l) => l.code === validCode) ?? SOCCER_LEAGUES[0];

    return (
      <div className="space-y-6 animate-slide-up">
        <div>
          <h1 className="text-2xl font-bold text-white">Soccer Teams</h1>
          <p className="text-sm text-white/40 mt-1">{currentLeague.name} — {teams.length} teams</p>
        </div>

        {/* League selector */}
        <SoccerLeagueSelector currentLeague={validCode} />

        {/* Team grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {teams.map((team) => (
            <Link
              key={team.id}
              href={`/team/${team.id}`}
              className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={team.badge}
                alt={team.name}
                className="w-12 h-12 object-contain group-hover:scale-110 transition-transform"
              />
              <span className="text-sm text-white/80 text-center leading-tight group-hover:text-white transition-colors">
                {team.shortName}
              </span>
            </Link>
          ))}
        </div>

        {teams.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/30 text-sm">No teams available for this league</p>
          </div>
        )}
      </div>
    );
  }

  // Non-soccer sports: simple team grid
  const teams = await getTeamsForSport(sport as Sport);

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white">{sportLabels[sport as Sport]} Teams</h1>
        <p className="text-sm text-white/40 mt-1">{teams.length} teams</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {teams.map((team) => (
          <Link
            key={team.id}
            href={`/team/${team.id}`}
            className="flex flex-col items-center gap-2 p-4 bg-card rounded-2xl border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={team.badge}
              alt={team.name}
              className="w-12 h-12 object-contain group-hover:scale-110 transition-transform"
            />
            <span className="text-sm text-white/80 text-center leading-tight group-hover:text-white transition-colors">
              {team.shortName}
            </span>
          </Link>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="text-center py-16">
          <p className="text-white/30 text-sm">No teams available</p>
        </div>
      )}
    </div>
  );
}
