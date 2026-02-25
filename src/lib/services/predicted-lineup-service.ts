import { getTeamSquad, type FDSquadPlayer } from "@/lib/api/football-data";
import { cacheGet, cacheSet } from "./cache";
import type { Lineup, LineupPlayer } from "@/lib/types";

/** Common formations with positional slots */
const FORMATION_TEMPLATES: Record<string, string[]> = {
  "4-3-3": ["GK", "RB", "CB", "CB", "LB", "CM", "CM", "CM", "RW", "ST", "LW"],
  "4-4-2": ["GK", "RB", "CB", "CB", "LB", "RM", "CM", "CM", "LM", "ST", "ST"],
  "4-2-3-1": ["GK", "RB", "CB", "CB", "LB", "CDM", "CDM", "RW", "CAM", "LW", "ST"],
  "3-5-2": ["GK", "CB", "CB", "CB", "RM", "CM", "CM", "CM", "LM", "ST", "ST"],
  "3-4-3": ["GK", "CB", "CB", "CB", "RM", "CM", "CM", "LM", "RW", "ST", "LW"],
  "4-1-4-1": ["GK", "RB", "CB", "CB", "LB", "CDM", "RM", "CM", "CM", "LM", "ST"],
  "5-3-2": ["GK", "RWB", "CB", "CB", "CB", "LWB", "CM", "CM", "CM", "ST", "ST"],
};

/** Map football-data position categories to slot preferences */
function positionToSlots(pos: FDSquadPlayer["position"]): string[] {
  switch (pos) {
    case "Goalkeeper":
      return ["GK"];
    case "Defence":
      return ["RB", "CB", "LB", "RWB", "LWB"];
    case "Midfield":
      return ["CM", "CDM", "CAM", "RM", "LM"];
    case "Offence":
      return ["ST", "RW", "LW"];
    default:
      return [];
  }
}

/** Pick the best formation for a squad composition */
function pickFormation(squad: FDSquadPlayer[]): string {
  const gk = squad.filter((p) => p.position === "Goalkeeper").length;
  const def = squad.filter((p) => p.position === "Defence").length;
  const mid = squad.filter((p) => p.position === "Midfield").length;
  const fwd = squad.filter((p) => p.position === "Offence").length;

  // Heuristic: pick formation that best matches available players
  if (fwd >= 3 && mid >= 3) return "4-3-3";
  if (fwd >= 2 && def >= 5) return "3-5-2";
  if (fwd >= 2 && mid >= 4) return "4-4-2";
  if (mid >= 5 && fwd >= 1) return "4-2-3-1";
  return "4-3-3"; // default
}

/** Generate a predicted starting XI from squad data */
function generatePredictedLineup(
  squad: FDSquadPlayer[],
  coach: string | null
): Lineup {
  const formation = pickFormation(squad);
  const template = FORMATION_TEMPLATES[formation] || FORMATION_TEMPLATES["4-3-3"];

  // Sort players by shirt number (lower = more likely starter as a simple heuristic)
  const sortedSquad = [...squad].sort((a, b) => {
    // Prioritize players with shirt numbers
    if (a.shirtNumber && !b.shirtNumber) return -1;
    if (!a.shirtNumber && b.shirtNumber) return 1;
    return (a.shirtNumber ?? 99) - (b.shirtNumber ?? 99);
  });

  const used = new Set<number>();
  const starters: LineupPlayer[] = [];

  // Fill each slot in the formation
  for (const slot of template) {
    let bestPlayer: FDSquadPlayer | null = null;

    for (const player of sortedSquad) {
      if (used.has(player.id)) continue;
      const validSlots = positionToSlots(player.position);
      if (validSlots.includes(slot)) {
        bestPlayer = player;
        break;
      }
    }

    if (bestPlayer) {
      used.add(bestPlayer.id);
      starters.push({
        number: bestPlayer.shirtNumber ?? 0,
        name: bestPlayer.name,
        position: bestPlayer.position ?? "",
      });
    }
  }

  // Remaining players as substitutes
  const substitutes: LineupPlayer[] = sortedSquad
    .filter((p) => !used.has(p.id))
    .slice(0, 9) // bench of 9
    .map((p) => ({
      number: p.shirtNumber ?? 0,
      name: p.name,
      position: p.position ?? "",
    }));

  return { formation, starters, substitutes };
}

/**
 * Get predicted lineups for an upcoming soccer match.
 * Uses football-data.org squad data to build likely starting XIs.
 */
export async function getPredictedLineups(
  homeTeamId: number,
  awayTeamId: number
): Promise<{ home: Lineup; away: Lineup; isPredicted: true } | null> {
  const cacheKey = `predicted:${homeTeamId}:${awayTeamId}`;
  const cached = cacheGet<{ home: Lineup; away: Lineup; isPredicted: true }>(cacheKey);
  if (cached) return cached;

  try {
    const [homeSquad, awaySquad] = await Promise.all([
      getTeamSquad(homeTeamId),
      getTeamSquad(awayTeamId),
    ]);

    if (!homeSquad.squad?.length || !awaySquad.squad?.length) return null;

    const home = generatePredictedLineup(
      homeSquad.squad,
      homeSquad.coach?.name ?? null
    );
    const away = generatePredictedLineup(
      awaySquad.squad,
      awaySquad.coach?.name ?? null
    );

    const result = { home, away, isPredicted: true as const };
    // Cache for 6 hours — squad data rarely changes
    cacheSet(cacheKey, result, 6 * 60 * 60 * 1000);
    return result;
  } catch (err) {
    console.error("[predicted-lineup] Error fetching squads:", err);
    return null;
  }
}
