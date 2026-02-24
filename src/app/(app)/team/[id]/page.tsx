import { notFound } from "next/navigation";
import { getTeamDetail, getTeamMatches } from "@/lib/services/team-service";
import TeamPageClient from "./TeamPageClient";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  return { title: "Team — ScoreSpark" };
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const team = await getTeamDetail(id);

  if (!team) {
    notFound();
  }

  const matches = await getTeamMatches(id);

  return <TeamPageClient team={team} matches={matches} />;
}
