"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FormResult, StandingRow, NBAStandingRow, NHLStandingRow } from "@/lib/types";

const leagueTabs = [
  { id: "epl", label: "EPL", href: "/standings/epl" },
  { id: "laliga", label: "La Liga", href: "/standings/laliga" },
  { id: "bundesliga", label: "Bundesliga", href: "/standings/bundesliga" },
  { id: "seriea", label: "Serie A", href: "/standings/seriea" },
  { id: "ligue1", label: "Ligue 1", href: "/standings/ligue1" },
  { id: "ucl", label: "UCL", href: "/standings/ucl" },
  { id: "uel", label: "UEL", href: "/standings/uel" },
  { id: "championship", label: "Champ.", href: "/standings/championship" },
  { id: "eredivisie", label: "Eredivisie", href: "/standings/eredivisie" },
  { id: "ligapt", label: "Liga PT", href: "/standings/ligapt" },
  { id: "nba-east", label: "NBA East", href: "/standings/nba-east" },
  { id: "nba-west", label: "NBA West", href: "/standings/nba-west" },
  { id: "nfl-afc", label: "NFL AFC", href: "/standings/nfl-afc" },
  { id: "nfl-nfc", label: "NFL NFC", href: "/standings/nfl-nfc" },
  { id: "nhl", label: "NHL", href: "/standings/nhl" },
  { id: "mlb-al", label: "MLB AL", href: "/standings/mlb-al" },
  { id: "mlb-nl", label: "MLB NL", href: "/standings/mlb-nl" },
];

function FormDot({ result }: { result: FormResult }) {
  const colors: Record<FormResult, string> = {
    W: "bg-live-green",
    D: "bg-yellow-400",
    L: "bg-live-red",
  };
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${colors[result]}`}
      title={result}
    />
  );
}

function SoccerTable({ standings }: { standings: StandingRow[] }) {
  return (
    <div className="overflow-x-auto hide-scrollbar">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-white/30 text-[11px] uppercase tracking-wider">
            <th className="text-left py-3 px-2 w-8">#</th>
            <th className="text-left py-3 px-2">Team</th>
            <th className="text-center py-3 px-1 w-8">P</th>
            <th className="text-center py-3 px-1 w-8">W</th>
            <th className="text-center py-3 px-1 w-8">D</th>
            <th className="text-center py-3 px-1 w-8">L</th>
            <th className="text-center py-3 px-1 w-10 hidden sm:table-cell">GF</th>
            <th className="text-center py-3 px-1 w-10 hidden sm:table-cell">GA</th>
            <th className="text-center py-3 px-1 w-10">GD</th>
            <th className="text-center py-3 px-1 w-10 font-bold text-white/50">Pts</th>
            <th className="text-center py-3 px-2 hidden sm:table-cell">Form</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, i) => {
            const zoneBorder =
              i === 3
                ? "border-b-2 border-b-sport-soccer/30"
                : i === 5
                ? "border-b border-b-blue-accent/20"
                : i === 16
                ? "border-b-2 border-b-live-red/30"
                : "";

            return (
              <tr
                key={row.team.id}
                className={`border-b border-white/5 hover:bg-white/5 transition-colors ${zoneBorder}`}
              >
                <td className="py-3 px-2 text-white/40 tabular-nums">
                  {row.position}
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={row.team.badge}
                      alt={row.team.shortName}
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded"
                    />
                    <span className="text-white/80 font-medium hidden sm:inline">
                      {row.team.name}
                    </span>
                    <span className="text-white/80 font-medium sm:hidden">
                      {row.team.shortName}
                    </span>
                  </div>
                </td>
                <td className="text-center py-3 px-1 text-white/50 tabular-nums">
                  {row.played}
                </td>
                <td className="text-center py-3 px-1 text-white/50 tabular-nums">
                  {row.won}
                </td>
                <td className="text-center py-3 px-1 text-white/50 tabular-nums">
                  {row.drawn}
                </td>
                <td className="text-center py-3 px-1 text-white/50 tabular-nums">
                  {row.lost}
                </td>
                <td className="text-center py-3 px-1 text-white/50 tabular-nums hidden sm:table-cell">
                  {row.goalsFor}
                </td>
                <td className="text-center py-3 px-1 text-white/50 tabular-nums hidden sm:table-cell">
                  {row.goalsAgainst}
                </td>
                <td
                  className={`text-center py-3 px-1 tabular-nums font-medium ${
                    row.goalDifference > 0
                      ? "text-live-green/80"
                      : row.goalDifference < 0
                      ? "text-live-red/80"
                      : "text-white/50"
                  }`}
                >
                  {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                </td>
                <td className="text-center py-3 px-1 text-white font-bold tabular-nums">
                  {row.points}
                </td>
                <td className="text-center py-3 px-2 hidden sm:table-cell">
                  <div className="flex items-center justify-center gap-1">
                    {row.form.map((f, j) => (
                      <FormDot key={j} result={f} />
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 px-2 text-[11px] text-white/30">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sport-soccer/50" />
          Champions League
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-accent/50" />
          Europa League
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-live-red/50" />
          Relegation
        </div>
      </div>
    </div>
  );
}

function NBATable({ standings }: { standings: NBAStandingRow[] }) {

  return (
    <div className="overflow-x-auto hide-scrollbar">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-white/30 text-[11px] uppercase tracking-wider">
            <th className="text-left py-3 px-2 w-8">#</th>
            <th className="text-left py-3 px-2">Team</th>
            <th className="text-center py-3 px-1 w-8">W</th>
            <th className="text-center py-3 px-1 w-8">L</th>
            <th className="text-center py-3 px-2 w-14">PCT</th>
            <th className="text-center py-3 px-2 w-10">GB</th>
            <th className="text-center py-3 px-2 w-12 hidden sm:table-cell">Streak</th>
            <th className="text-center py-3 px-2 w-14 hidden sm:table-cell">L10</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, i) => {
            const playoffLine = i === 5 ? "border-b-2 border-b-sport-nba/30" : "";
            const playInLine = i === 7 ? "border-b-2 border-b-white/10" : "";

            return (
              <tr
                key={row.team.id}
                className={`border-b border-white/5 hover:bg-white/5 transition-colors ${playoffLine} ${playInLine}`}
              >
                <td className="py-3 px-2 text-white/40 tabular-nums">
                  {row.position}
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={row.team.badge}
                      alt={row.team.shortName}
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded"
                    />
                    <span className="text-white/80 font-medium hidden sm:inline">
                      {row.team.name}
                    </span>
                    <span className="text-white/80 font-medium sm:hidden">
                      {row.team.shortName}
                    </span>
                  </div>
                </td>
                <td className="text-center py-3 px-1 text-white/50 tabular-nums">
                  {row.won}
                </td>
                <td className="text-center py-3 px-1 text-white/50 tabular-nums">
                  {row.lost}
                </td>
                <td className="text-center py-3 px-2 text-white/60 tabular-nums font-medium">
                  {row.winPct}
                </td>
                <td className="text-center py-3 px-2 text-white/40 tabular-nums">
                  {row.gamesBehind}
                </td>
                <td className="text-center py-3 px-2 hidden sm:table-cell">
                  <span
                    className={`text-xs font-medium ${
                      row.streak.startsWith("W")
                        ? "text-live-green/80"
                        : "text-live-red/80"
                    }`}
                  >
                    {row.streak}
                  </span>
                </td>
                <td className="text-center py-3 px-2 text-white/40 tabular-nums hidden sm:table-cell">
                  {row.last10}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function NHLTable({ standings }: { standings: NHLStandingRow[] }) {
  return (
    <div className="overflow-x-auto hide-scrollbar">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-white/30 text-[11px] uppercase tracking-wider">
            <th className="text-left py-3 px-2 w-8">#</th>
            <th className="text-left py-3 px-2">Team</th>
            <th className="text-center py-3 px-1 w-8">GP</th>
            <th className="text-center py-3 px-1 w-8">W</th>
            <th className="text-center py-3 px-1 w-8">L</th>
            <th className="text-center py-3 px-1 w-10">OTL</th>
            <th className="text-center py-3 px-1 w-10 font-bold text-white/50">Pts</th>
            <th className="text-center py-3 px-1 w-10 hidden sm:table-cell">GF</th>
            <th className="text-center py-3 px-1 w-10 hidden sm:table-cell">GA</th>
            <th className="text-center py-3 px-2 w-12 hidden sm:table-cell">Streak</th>
            <th className="text-center py-3 px-2 w-14 hidden sm:table-cell">L10</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, i) => {
            const playoffLine = i === 7 ? "border-b-2 border-b-sport-nhl/30" : "";

            return (
              <tr
                key={row.team.id}
                className={`border-b border-white/5 hover:bg-white/5 transition-colors ${playoffLine}`}
              >
                <td className="py-3 px-2 text-white/40 tabular-nums">
                  {row.position}
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={row.team.badge}
                      alt={row.team.shortName}
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded"
                    />
                    <span className="text-white/80 font-medium hidden sm:inline">
                      {row.team.name}
                    </span>
                    <span className="text-white/80 font-medium sm:hidden">
                      {row.team.shortName}
                    </span>
                  </div>
                </td>
                <td className="text-center py-3 px-1 text-white/50 tabular-nums">
                  {row.played}
                </td>
                <td className="text-center py-3 px-1 text-white/50 tabular-nums">
                  {row.won}
                </td>
                <td className="text-center py-3 px-1 text-white/50 tabular-nums">
                  {row.lost}
                </td>
                <td className="text-center py-3 px-1 text-white/50 tabular-nums">
                  {row.otLosses}
                </td>
                <td className="text-center py-3 px-1 text-white font-bold tabular-nums">
                  {row.points}
                </td>
                <td className="text-center py-3 px-1 text-white/50 tabular-nums hidden sm:table-cell">
                  {row.goalsFor}
                </td>
                <td className="text-center py-3 px-1 text-white/50 tabular-nums hidden sm:table-cell">
                  {row.goalsAgainst}
                </td>
                <td className="text-center py-3 px-2 hidden sm:table-cell">
                  <span
                    className={`text-xs font-medium ${
                      row.streak.startsWith("W")
                        ? "text-live-green/80"
                        : "text-live-red/80"
                    }`}
                  >
                    {row.streak}
                  </span>
                </td>
                <td className="text-center py-3 px-2 text-white/40 tabular-nums hidden sm:table-cell">
                  {row.last10}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 px-2 text-[11px] text-white/30">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sport-nhl/50" />
          Playoff Cutoff
        </div>
      </div>
    </div>
  );
}

function MLBTable({ standings }: { standings: NBAStandingRow[] }) {

  return (
    <div className="overflow-x-auto hide-scrollbar">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-white/30 text-[11px] uppercase tracking-wider">
            <th className="text-left py-3 px-2 w-8">#</th>
            <th className="text-left py-3 px-2">Team</th>
            <th className="text-center py-3 px-1 w-8">W</th>
            <th className="text-center py-3 px-1 w-8">L</th>
            <th className="text-center py-3 px-2 w-14">PCT</th>
            <th className="text-center py-3 px-2 w-10">GB</th>
            <th className="text-center py-3 px-2 w-12 hidden sm:table-cell">Streak</th>
            <th className="text-center py-3 px-2 w-14 hidden sm:table-cell">L10</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, i) => {
            const playoffLine = i === 5 ? "border-b-2 border-b-sport-mlb/30" : "";

            return (
              <tr
                key={row.team.id}
                className={`border-b border-white/5 hover:bg-white/5 transition-colors ${playoffLine}`}
              >
                <td className="py-3 px-2 text-white/40 tabular-nums">
                  {row.position}
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={row.team.badge}
                      alt={row.team.shortName}
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded"
                    />
                    <span className="text-white/80 font-medium hidden sm:inline">
                      {row.team.name}
                    </span>
                    <span className="text-white/80 font-medium sm:hidden">
                      {row.team.shortName}
                    </span>
                  </div>
                </td>
                <td className="text-center py-3 px-1 text-white/50 tabular-nums">
                  {row.won}
                </td>
                <td className="text-center py-3 px-1 text-white/50 tabular-nums">
                  {row.lost}
                </td>
                <td className="text-center py-3 px-2 text-white/60 tabular-nums font-medium">
                  {row.winPct}
                </td>
                <td className="text-center py-3 px-2 text-white/40 tabular-nums">
                  {row.gamesBehind}
                </td>
                <td className="text-center py-3 px-2 hidden sm:table-cell">
                  <span
                    className={`text-xs font-medium ${
                      row.streak.startsWith("W")
                        ? "text-live-green/80"
                        : "text-live-red/80"
                    }`}
                  >
                    {row.streak}
                  </span>
                </td>
                <td className="text-center py-3 px-2 text-white/40 tabular-nums hidden sm:table-cell">
                  {row.last10}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const SOCCER_LEAGUES = new Set(["epl", "laliga", "bundesliga", "seriea", "ligue1", "ucl", "uel", "eredivisie", "championship", "ligapt"]);

export default function StandingsView({
  league,
  soccerStandings,
  nbaStandings,
  nhlStandings,
}: {
  league: string;
  soccerStandings?: StandingRow[];
  nbaStandings?: NBAStandingRow[];
  nhlStandings?: NHLStandingRow[];
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white">Standings</h1>
        <p className="text-sm text-white/40 mt-1">League tables and rankings</p>
      </div>

      {/* League tabs */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {leagueTabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                active
                  ? "bg-white/10 text-white ring-1 ring-white/10"
                  : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl p-4 border border-white/5">
        {soccerStandings && <SoccerTable standings={soccerStandings} />}
        {nbaStandings && <NBATable standings={nbaStandings} />}
        {nhlStandings && <NHLTable standings={nhlStandings} />}
      </div>
    </div>
  );
}
