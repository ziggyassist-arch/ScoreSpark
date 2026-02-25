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

  let team;
  try {
    team = await getTeamDetail(id);
  } catch (err) {
    console.error("[team page] getTeamDetail error:", err);
    notFound();
  }

  if (!team) {
    notFound();
  }

  let matches: Awaited<ReturnType<typeof getTeamMatches>> = [];
  try {
    matches = await getTeamMatches(id);
  } catch (err) {
    console.error("[team page] getTeamMatches error:", err);
    matches = [];
  }

  return <TeamPageClient team={team} matches={matches} />;
}
