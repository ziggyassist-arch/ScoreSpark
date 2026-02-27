"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import StandingsView from "./StandingsView";

const validLeagues = new Set([
  "epl", "laliga", "bundesliga", "seriea", "ligue1", "ucl", "uel", "eredivisie", "championship", "ligapt",
  "nba-east", "nba-west", "nfl-afc", "nfl-nfc", "nhl", "mlb-al", "mlb-nl",
]);

const leagueAliases: Record<string, string> = {
  'premier-league': 'epl',
  'la-liga': 'laliga',
  'serie-a': 'seriea',
  'ligue-1': 'ligue1',
  'nba': 'nba-east',
  'nfl': 'nfl-afc',
  'mlb': 'mlb-al',
};

export default function StandingsPage() {
  const params = useParams<{ league: string }>();
  const league = leagueAliases[params.league] ?? params.league;

  if (!validLeagues.has(league)) {
    notFound();
  }

  return <StandingsView league={league} />;
}
