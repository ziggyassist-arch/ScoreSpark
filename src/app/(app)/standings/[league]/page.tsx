"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import StandingsView from "./StandingsView";

const validLeagues = new Set([
  "epl", "laliga", "bundesliga", "seriea", "ligue1", "ucl", "uel", "eredivisie", "championship", "ligapt",
  "nba-east", "nba-west", "nfl-afc", "nfl-nfc", "nhl", "mlb-al", "mlb-nl",
]);

export default function StandingsPage() {
  const params = useParams<{ league: string }>();
  const league = params.league;

  if (!validLeagues.has(league)) {
    notFound();
  }

  return <StandingsView league={league} />;
}
