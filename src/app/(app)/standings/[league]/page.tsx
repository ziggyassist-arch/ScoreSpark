import { notFound } from "next/navigation";
import { getStandingsForLeague } from "@/lib/services/standings-service";
import StandingsView from "./StandingsView";
import type { StandingRow, NBAStandingRow, NHLStandingRow } from "@/lib/types";

const validLeagues = new Set([
  "epl", "laliga", "bundesliga", "seriea", "ligue1", "ucl", "uel", "eredivisie", "championship", "ligapt",
  "nba-east", "nba-west", "nfl-afc", "nfl-nfc", "nhl", "mlb-al", "mlb-nl",
]);

export function generateStaticParams() {
  return Array.from(validLeagues).map((league) => ({ league }));
}

export function generateMetadata() {
  return { title: "Standings — ScoreSpark" };
}

export const dynamic = "force-dynamic";

export default async function StandingsPage({
  params,
}: {
  params: Promise<{ league: string }>;
}) {
  const { league } = await params;

  if (!validLeagues.has(league)) {
    notFound();
  }

  const result = await getStandingsForLeague(league);

  let soccerStandings: StandingRow[] | undefined;
  let nbaStandings: NBAStandingRow[] | undefined;
  let nhlStandings: NHLStandingRow[] | undefined;

  if (result.type === "soccer") soccerStandings = result.rows;
  if (result.type === "nba") nbaStandings = result.rows;
  if (result.type === "nhl") nhlStandings = result.rows;

  return (
    <StandingsView
      league={league}
      soccerStandings={soccerStandings}
      nbaStandings={nbaStandings}
      nhlStandings={nhlStandings}
    />
  );
}
