import { notFound } from "next/navigation";
import StandingsView from "./StandingsView";

const validLeagues = new Set(["epl", "nba-east", "nba-west", "nhl", "mlb-al", "mlb-nl"]);

export function generateStaticParams() {
  return [
    { league: "epl" },
    { league: "nba-east" },
    { league: "nba-west" },
    { league: "nhl" },
    { league: "mlb-al" },
    { league: "mlb-nl" },
  ];
}

export function generateMetadata() {
  return { title: "Standings — ScoreSpark" };
}

export default async function StandingsPage({
  params,
}: {
  params: Promise<{ league: string }>;
}) {
  const { league } = await params;

  if (!validLeagues.has(league)) {
    notFound();
  }

  return <StandingsView league={league} />;
}
