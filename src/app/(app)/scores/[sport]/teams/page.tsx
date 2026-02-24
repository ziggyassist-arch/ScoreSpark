import { notFound } from "next/navigation";
import TeamsGrid from "./TeamsGrid";

const validSports = new Set<string>(["soccer", "nba", "nfl", "nhl", "mlb"]);

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

  return <TeamsGrid sport={sport} initialLeague={sp?.league} />;
}
