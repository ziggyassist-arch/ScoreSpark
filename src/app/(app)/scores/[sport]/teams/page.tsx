"use client";

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import TeamsGrid from "./TeamsGrid";

const validSports = new Set<string>(["soccer", "nba", "nfl", "nhl", "mlb"]);

export default function TeamsPage() {
  const params = useParams<{ sport: string }>();
  const sport = params.sport;

  if (!validSports.has(sport)) {
    notFound();
  }

  return <TeamsGrid sport={sport} />;
}
