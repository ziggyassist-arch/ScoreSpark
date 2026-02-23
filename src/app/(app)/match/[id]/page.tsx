import { notFound } from "next/navigation";
import { getMatchDetailById } from "@/lib/services/match-service";
import { allMatches } from "@/lib/mock-data";
import MatchDetail from "./MatchDetail";

export function generateStaticParams() {
  // Pre-generate paths for mock matches; real matches use dynamic rendering
  return allMatches.map((m) => ({ id: m.id }));
}

export function generateMetadata() {
  return { title: "Match — ScoreSpark" };
}

export const dynamic = "force-dynamic";

export default async function MatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getMatchDetailById(id);
  if (!result) notFound();

  return <MatchDetail match={result.match} lineups={result.lineups} />;
}
