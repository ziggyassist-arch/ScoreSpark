/**
 * PlayerProfile for every player in every roster.
 * Generated from teams.ts roster data with sport-appropriate stats.
 */
import type { Sport } from "../types";
import { allMockTeams, type MockTeamData, type MockSquadPlayer } from "./teams";

export interface PlayerStat {
  label: string;
  value: string;
}

export interface PlayerProfile {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  position: string;
  nationality?: string;
  dateOfBirth?: string;
  age?: number;
  jersey?: string;
  height?: string;
  weight?: string;
  photo?: string;
  team: {
    id: string;
    name: string;
    badge: string;
    sport: Sport;
  };
  stats: PlayerStat[];
  sport: Sport;
}

// ═══════════════════════════════════════════════════════════════
// Sport-specific stat generators
// ═══════════════════════════════════════════════════════════════

function soccerStats(pos: string): PlayerStat[] {
  if (pos === "Goalkeeper") {
    return [
      { label: "Appearances", value: `${18 + Math.floor(Math.random() * 10)}` },
      { label: "Clean Sheets", value: `${4 + Math.floor(Math.random() * 8)}` },
      { label: "Saves", value: `${35 + Math.floor(Math.random() * 40)}` },
      { label: "Goals Conceded", value: `${12 + Math.floor(Math.random() * 20)}` },
      { label: "Save %", value: `${68 + Math.floor(Math.random() * 15)}%` },
    ];
  }
  if (pos === "Defence") {
    return [
      { label: "Appearances", value: `${18 + Math.floor(Math.random() * 10)}` },
      { label: "Goals", value: `${Math.floor(Math.random() * 4)}` },
      { label: "Assists", value: `${Math.floor(Math.random() * 5)}` },
      { label: "Tackles", value: `${25 + Math.floor(Math.random() * 40)}` },
      { label: "Interceptions", value: `${20 + Math.floor(Math.random() * 30)}` },
      { label: "Clean Sheets", value: `${4 + Math.floor(Math.random() * 8)}` },
      { label: "Yellow Cards", value: `${Math.floor(Math.random() * 6)}` },
    ];
  }
  if (pos === "Midfield") {
    return [
      { label: "Appearances", value: `${18 + Math.floor(Math.random() * 10)}` },
      { label: "Goals", value: `${Math.floor(Math.random() * 10)}` },
      { label: "Assists", value: `${2 + Math.floor(Math.random() * 10)}` },
      { label: "Passes", value: `${600 + Math.floor(Math.random() * 800)}` },
      { label: "Pass Accuracy", value: `${78 + Math.floor(Math.random() * 14)}%` },
      { label: "Tackles", value: `${15 + Math.floor(Math.random() * 35)}` },
      { label: "Yellow Cards", value: `${Math.floor(Math.random() * 7)}` },
    ];
  }
  // Offence
  return [
    { label: "Appearances", value: `${18 + Math.floor(Math.random() * 10)}` },
    { label: "Goals", value: `${3 + Math.floor(Math.random() * 18)}` },
    { label: "Assists", value: `${2 + Math.floor(Math.random() * 10)}` },
    { label: "Shots", value: `${25 + Math.floor(Math.random() * 50)}` },
    { label: "Shots on Target", value: `${10 + Math.floor(Math.random() * 25)}` },
    { label: "Dribbles", value: `${15 + Math.floor(Math.random() * 40)}` },
    { label: "Yellow Cards", value: `${Math.floor(Math.random() * 5)}` },
  ];
}

function nbaStats(_pos: string): PlayerStat[] {
  const gp = 40 + Math.floor(Math.random() * 16);
  return [
    { label: "Games Played", value: `${gp}` },
    { label: "PPG", value: `${(5 + Math.random() * 25).toFixed(1)}` },
    { label: "RPG", value: `${(2 + Math.random() * 10).toFixed(1)}` },
    { label: "APG", value: `${(1 + Math.random() * 8).toFixed(1)}` },
    { label: "FG%", value: `${(40 + Math.random() * 18).toFixed(1)}%` },
    { label: "3P%", value: `${(30 + Math.random() * 15).toFixed(1)}%` },
    { label: "FT%", value: `${(65 + Math.random() * 25).toFixed(1)}%` },
    { label: "SPG", value: `${(0.3 + Math.random() * 1.5).toFixed(1)}` },
    { label: "BPG", value: `${(0.1 + Math.random() * 2).toFixed(1)}` },
  ];
}

function nflStats(pos: string): PlayerStat[] {
  const gp = 12 + Math.floor(Math.random() * 6);
  if (pos === "Quarterback") {
    return [
      { label: "Games", value: `${gp}` },
      { label: "Comp/Att", value: `${200 + Math.floor(Math.random() * 150)}/${320 + Math.floor(Math.random() * 180)}` },
      { label: "Pass Yards", value: `${2800 + Math.floor(Math.random() * 2000)}` },
      { label: "Pass TD", value: `${18 + Math.floor(Math.random() * 20)}` },
      { label: "INT", value: `${3 + Math.floor(Math.random() * 10)}` },
      { label: "QBR", value: `${60 + Math.floor(Math.random() * 35)}` },
      { label: "Rush Yards", value: `${50 + Math.floor(Math.random() * 500)}` },
    ];
  }
  if (pos === "Running Back") {
    return [
      { label: "Games", value: `${gp}` },
      { label: "Rush Att", value: `${120 + Math.floor(Math.random() * 180)}` },
      { label: "Rush Yards", value: `${500 + Math.floor(Math.random() * 1000)}` },
      { label: "Rush TD", value: `${4 + Math.floor(Math.random() * 12)}` },
      { label: "YPC", value: `${(3.5 + Math.random() * 2.5).toFixed(1)}` },
      { label: "Receptions", value: `${15 + Math.floor(Math.random() * 50)}` },
      { label: "Rec Yards", value: `${100 + Math.floor(Math.random() * 400)}` },
    ];
  }
  if (pos === "Wide Receiver" || pos === "Tight End") {
    return [
      { label: "Games", value: `${gp}` },
      { label: "Receptions", value: `${30 + Math.floor(Math.random() * 80)}` },
      { label: "Rec Yards", value: `${400 + Math.floor(Math.random() * 900)}` },
      { label: "Rec TD", value: `${3 + Math.floor(Math.random() * 10)}` },
      { label: "Targets", value: `${50 + Math.floor(Math.random() * 100)}` },
      { label: "YPR", value: `${(8 + Math.random() * 8).toFixed(1)}` },
    ];
  }
  if (pos === "Kicker" || pos === "Punter") {
    return [
      { label: "Games", value: `${gp}` },
      { label: "FG Made", value: `${15 + Math.floor(Math.random() * 20)}` },
      { label: "FG Att", value: `${18 + Math.floor(Math.random() * 22)}` },
      { label: "FG%", value: `${(80 + Math.random() * 15).toFixed(1)}%` },
      { label: "Long", value: `${42 + Math.floor(Math.random() * 18)}` },
      { label: "Points", value: `${60 + Math.floor(Math.random() * 80)}` },
    ];
  }
  // Defensive players
  return [
    { label: "Games", value: `${gp}` },
    { label: "Tackles", value: `${25 + Math.floor(Math.random() * 75)}` },
    { label: "Sacks", value: `${(Math.random() * 14).toFixed(1)}` },
    { label: "TFL", value: `${2 + Math.floor(Math.random() * 15)}` },
    { label: "INT", value: `${Math.floor(Math.random() * 6)}` },
    { label: "PD", value: `${2 + Math.floor(Math.random() * 12)}` },
    { label: "FF", value: `${Math.floor(Math.random() * 5)}` },
  ];
}

function nhlStats(pos: string): PlayerStat[] {
  const gp = 45 + Math.floor(Math.random() * 13);
  if (pos === "Goalie") {
    return [
      { label: "Games", value: `${gp}` },
      { label: "Wins", value: `${15 + Math.floor(Math.random() * 25)}` },
      { label: "Losses", value: `${8 + Math.floor(Math.random() * 15)}` },
      { label: "GAA", value: `${(2.2 + Math.random() * 1.3).toFixed(2)}` },
      { label: "SV%", value: `.${905 + Math.floor(Math.random() * 30)}` },
      { label: "SO", value: `${Math.floor(Math.random() * 6)}` },
    ];
  }
  if (pos === "Defenseman") {
    return [
      { label: "Games", value: `${gp}` },
      { label: "Goals", value: `${Math.floor(Math.random() * 15)}` },
      { label: "Assists", value: `${5 + Math.floor(Math.random() * 30)}` },
      { label: "Points", value: `${5 + Math.floor(Math.random() * 45)}` },
      { label: "+/-", value: `${-10 + Math.floor(Math.random() * 30)}` },
      { label: "PIM", value: `${10 + Math.floor(Math.random() * 40)}` },
      { label: "Hits", value: `${30 + Math.floor(Math.random() * 100)}` },
      { label: "Blocks", value: `${40 + Math.floor(Math.random() * 80)}` },
    ];
  }
  // Forwards
  return [
    { label: "Games", value: `${gp}` },
    { label: "Goals", value: `${5 + Math.floor(Math.random() * 40)}` },
    { label: "Assists", value: `${5 + Math.floor(Math.random() * 50)}` },
    { label: "Points", value: `${10 + Math.floor(Math.random() * 80)}` },
    { label: "+/-", value: `${-10 + Math.floor(Math.random() * 30)}` },
    { label: "PIM", value: `${5 + Math.floor(Math.random() * 50)}` },
    { label: "SOG", value: `${50 + Math.floor(Math.random() * 200)}` },
    { label: "S%", value: `${(5 + Math.random() * 15).toFixed(1)}%` },
  ];
}

function mlbStats(pos: string): PlayerStat[] {
  if (pos === "Pitcher") {
    return [
      { label: "W-L", value: `${5 + Math.floor(Math.random() * 12)}-${2 + Math.floor(Math.random() * 8)}` },
      { label: "ERA", value: `${(2.5 + Math.random() * 2.5).toFixed(2)}` },
      { label: "IP", value: `${80 + Math.floor(Math.random() * 120)}.${Math.floor(Math.random() * 3)}` },
      { label: "SO", value: `${60 + Math.floor(Math.random() * 180)}` },
      { label: "WHIP", value: `${(0.9 + Math.random() * 0.5).toFixed(2)}` },
      { label: "BB", value: `${15 + Math.floor(Math.random() * 45)}` },
      { label: "H", value: `${50 + Math.floor(Math.random() * 100)}` },
    ];
  }
  // Position players
  const gp = 70 + Math.floor(Math.random() * 30);
  const ab = Math.floor(gp * (3.2 + Math.random() * 1));
  return [
    { label: "Games", value: `${gp}` },
    { label: "AVG", value: `.${240 + Math.floor(Math.random() * 70)}` },
    { label: "HR", value: `${5 + Math.floor(Math.random() * 35)}` },
    { label: "RBI", value: `${20 + Math.floor(Math.random() * 80)}` },
    { label: "OPS", value: `.${700 + Math.floor(Math.random() * 250)}` },
    { label: "H", value: `${Math.floor(ab * (0.24 + Math.random() * 0.07))}` },
    { label: "AB", value: `${ab}` },
    { label: "R", value: `${25 + Math.floor(Math.random() * 70)}` },
    { label: "SB", value: `${Math.floor(Math.random() * 30)}` },
  ];
}

function getStatsForSport(sport: Sport, position: string): PlayerStat[] {
  switch (sport) {
    case "soccer": return soccerStats(position);
    case "nba": return nbaStats(position);
    case "nfl": return nflStats(position);
    case "nhl": return nhlStats(position);
    case "mlb": return mlbStats(position);
  }
}

// ═══════════════════════════════════════════════════════════════
// Generate PlayerProfile from roster data
// ═══════════════════════════════════════════════════════════════

function splitName(fullName: string): [string, string] {
  const parts = fullName.split(" ");
  if (parts.length === 1) return [parts[0], parts[0]];
  return [parts[0], parts.slice(1).join(" ")];
}

function buildProfile(
  player: MockSquadPlayer,
  teamData: MockTeamData
): PlayerProfile {
  const [firstName, lastName] = splitName(player.name);
  return {
    id: player.id,
    name: player.name,
    firstName,
    lastName,
    position: player.position,
    nationality: player.nationality,
    age: 20 + Math.floor(Math.random() * 16),
    jersey: player.shirtNumber != null ? String(player.shirtNumber) : undefined,
    height: teamData.team.sport === "nba"
      ? `${6 + Math.floor(Math.random() * 2)}'${Math.floor(Math.random() * 12)}"`
      : teamData.team.sport === "nfl"
        ? `${5 + Math.floor(Math.random() * 3)}'${Math.floor(Math.random() * 12)}"`
        : `${Math.floor(170 + Math.random() * 25)} cm`,
    weight: teamData.team.sport === "nba" || teamData.team.sport === "nfl"
      ? `${180 + Math.floor(Math.random() * 80)} lbs`
      : `${65 + Math.floor(Math.random() * 25)} kg`,
    team: {
      id: teamData.team.id,
      name: teamData.team.name,
      badge: teamData.team.badge,
      sport: teamData.team.sport,
    },
    stats: getStatsForSport(teamData.team.sport, player.position),
    sport: teamData.team.sport,
  };
}

// Build all profiles at import time (deterministic with seeded values)
// Use a fixed seed approach: reset Math.random substitute for determinism
let _seed = 42;
function seededRandom(): number {
  _seed = (_seed * 16807 + 0) % 2147483647;
  return (_seed - 1) / 2147483646;
}

// Monkey-patch during generation for consistency
const origRandom = Math.random;
Math.random = seededRandom;

const _allProfiles: PlayerProfile[] = allMockTeams.flatMap((teamData) =>
  teamData.squad.map((player) => buildProfile(player, teamData))
);

Math.random = origRandom;

export const allPlayerProfiles: PlayerProfile[] = _allProfiles;

/** Quick lookup by player ID */
export const playerById: Record<string, PlayerProfile> = Object.fromEntries(
  allPlayerProfiles.map((p) => [p.id, p])
);

/** Get all players for a team */
export function getPlayersForTeam(teamId: string): PlayerProfile[] {
  return allPlayerProfiles.filter((p) => p.team.id === teamId);
}

/** Get player by ID */
export function getPlayerProfile(playerId: string): PlayerProfile | null {
  return playerById[playerId] ?? null;
}
