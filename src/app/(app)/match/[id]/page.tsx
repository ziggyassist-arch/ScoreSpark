import { notFound } from "next/navigation";
import { allMatches, sampleLineups } from "@/lib/mock-data";
import MatchDetail from "./MatchDetail";

export function generateStaticParams() {
  return allMatches.map((m) => ({ id: m.id }));
}

export function generateMetadata() {
  return { title: "Match — ScoreSpark" };
}

export default async function MatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const match = allMatches.find((m) => m.id === id);
  if (!match) notFound();

  const lineups = sampleLineups[id] ?? null;

  return <MatchDetail match={match} lineups={lineups} />;
}
