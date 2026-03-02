import { notFound } from "next/navigation";
import { getMatchDetailById } from "@/lib/services/match-service";
import * as mock from "@/lib/services/mock-provider";
import { allMockMatches } from "@/lib/mock-data/index";
import MatchDetail from "./MatchDetail";

export function generateStaticParams() {
  // Pre-generate paths for mock matches; real matches use dynamic rendering
  return allMockMatches.map((m) => ({ id: m.id }));
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
  const result = mock.isMockMode()
    ? await mock.getMatchDetailById(id)
    : await getMatchDetailById(id);
  if (!result) notFound();

  return <MatchDetail match={result.match} lineups={result.lineups} />;
}
