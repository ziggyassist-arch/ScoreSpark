import type { Match } from "./types";

/**
 * Generate a contextual hype primer for a match based on available data.
 * Uses templates — no LLM needed for MVP.
 */
export function generateHypePrimer(match: Match): string | null {
  // Only for upcoming or live matches
  if (match.status === "finished") return null;

  const home = match.homeTeam.shortName;
  const away = match.awayTeam.shortName;
  const detail = match.sportDetail;

  // If we have records, generate record-based primers
  if (detail?.homeRecord && detail?.awayRecord) {
    return generateRecordPrimer(home, away, detail.homeRecord, detail.awayRecord, match);
  }

  // Generic primers for matches without records
  return generateGenericPrimer(home, away, match);
}

function parseRecord(record: string): { wins: number; losses: number } | null {
  const parts = record.split("-").map(Number);
  if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { wins: parts[0], losses: parts[1] };
  }
  return null;
}

function generateRecordPrimer(
  home: string,
  away: string,
  homeRecord: string,
  awayRecord: string,
  match: Match
): string {
  const homeRec = parseRecord(homeRecord);
  const awayRec = parseRecord(awayRecord);

  if (!homeRec || !awayRec) {
    return `${home} (${homeRecord}) hosts ${away} (${awayRecord})`;
  }

  const homeWinPct = homeRec.wins / (homeRec.wins + homeRec.losses);
  const awayWinPct = awayRec.wins / (awayRec.wins + awayRec.losses);

  // Both top teams
  if (homeWinPct > 0.65 && awayWinPct > 0.65) {
    const templates = [
      `Clash of titans! ${home} (${homeRecord}) and ${away} (${awayRecord}) are both among the best in the ${match.league}.`,
      `Two of the league's best meet as ${home} (${homeRecord}) welcomes ${away} (${awayRecord}).`,
      `Marquee matchup: ${home} vs ${away}. Combined record: ${homeRec.wins + awayRec.wins}-${homeRec.losses + awayRec.losses}.`,
    ];
    return templates[Math.floor(deterministicRandom(home + away) * templates.length)];
  }

  // Upset potential (underdog at home)
  if (homeWinPct < 0.4 && awayWinPct > 0.6) {
    return `Upset watch: ${home} (${homeRecord}) looks to play spoiler against ${away} (${awayRecord}).`;
  }

  // Dominant home team
  if (homeWinPct > 0.7) {
    return `${home} (${homeRecord}) is on a tear this season. ${away} faces a tough road test.`;
  }

  // Close matchup
  if (Math.abs(homeWinPct - awayWinPct) < 0.1) {
    return `Evenly matched: ${home} (${homeRecord}) and ${away} (${awayRecord}) should be a tight contest.`;
  }

  return `${home} (${homeRecord}) hosts ${away} (${awayRecord}) in ${match.league} action.`;
}

function generateGenericPrimer(home: string, away: string, match: Match): string {
  const templates = [
    `${home} welcomes ${away} in today's ${match.league} action.`,
    `${match.league}: ${home} vs ${away} — don't miss it.`,
    `${away} travels to face ${home} in ${match.league} play.`,
  ];
  return templates[Math.floor(deterministicRandom(home + away + match.startTime) * templates.length)];
}

/** Simple deterministic hash to avoid random flicker on re-renders */
function deterministicRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash % 1000) / 1000;
}
