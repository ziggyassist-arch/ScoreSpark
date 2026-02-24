import type { Sport } from "@/lib/types";

export interface MockDraftPick {
  pick: number;
  player: string;
  position: string;
  school: string; // College or club
  team?: string; // Drafting team (if known)
  avgPick: number; // Consensus average pick position
  sources: string[]; // Which sources have this player at/near this pick
}

export interface MockDraftData {
  sport: Sport;
  year: number;
  draftDate: string;
  picks: MockDraftPick[];
  sources: string[];
  lastUpdated: string;
}

/**
 * Get consensus mock draft for a sport.
 * Aggregated from top 5 sources per sport, averaged picks.
 */
export function getMockDraft(sport: Sport): MockDraftData | null {
  switch (sport) {
    case "nfl":
      return getNFLMockDraft();
    case "nba":
      return getNBAMockDraft();
    case "nhl":
      return getNHLMockDraft();
    case "mlb":
      return getMLBMockDraft();
    case "soccer":
      return getMLSSuperDraft();
    default:
      return null;
  }
}

function getNFLMockDraft(): MockDraftData {
  return {
    sport: "nfl",
    year: 2025,
    draftDate: "April 24-26, 2025",
    sources: ["ESPN (Mel Kiper Jr.)", "NFL.com (Daniel Jeremiah)", "The Athletic (Dane Brugler)", "CBS Sports (Ryan Wilson)", "Pro Football Focus"],
    lastUpdated: "2025-02-20",
    picks: [
      { pick: 1, player: "Cam Ward", position: "QB", school: "Miami", team: "Tennessee Titans", avgPick: 1.2, sources: ["ESPN", "NFL.com", "CBS Sports"] },
      { pick: 2, player: "Shedeur Sanders", position: "QB", school: "Colorado", team: "Cleveland Browns", avgPick: 2.4, sources: ["ESPN", "The Athletic", "PFF"] },
      { pick: 3, player: "Travis Hunter", position: "CB/WR", school: "Colorado", team: "New York Giants", avgPick: 2.8, sources: ["NFL.com", "CBS Sports", "PFF"] },
      { pick: 4, player: "Abdul Carter", position: "EDGE", school: "Penn State", team: "New England Patriots", avgPick: 4.2, sources: ["ESPN", "The Athletic"] },
      { pick: 5, player: "Mason Graham", position: "DT", school: "Michigan", team: "Jacksonville Jaguars", avgPick: 5.0, sources: ["NFL.com", "CBS Sports"] },
      { pick: 6, player: "Will Johnson", position: "CB", school: "Michigan", team: "Las Vegas Raiders", avgPick: 6.4, sources: ["ESPN", "PFF"] },
      { pick: 7, player: "Tetairoa McMillan", position: "WR", school: "Arizona", team: "New York Jets", avgPick: 7.2, sources: ["The Athletic", "CBS Sports"] },
      { pick: 8, player: "Malaki Starks", position: "S", school: "Georgia", team: "Carolina Panthers", avgPick: 8.6, sources: ["ESPN", "NFL.com"] },
      { pick: 9, player: "Kelvin Banks Jr.", position: "OT", school: "Texas", team: "New Orleans Saints", avgPick: 9.4, sources: ["CBS Sports", "PFF"] },
      { pick: 10, player: "Luther Burden III", position: "WR", school: "Missouri", team: "Chicago Bears", avgPick: 10.8, sources: ["The Athletic", "NFL.com"] },
      { pick: 11, player: "Will Campbell", position: "OT", school: "LSU", team: "San Francisco 49ers", avgPick: 11.2, sources: ["ESPN", "CBS Sports"] },
      { pick: 12, player: "Mykel Williams", position: "EDGE", school: "Georgia", team: "Dallas Cowboys", avgPick: 12.4, sources: ["NFL.com", "PFF"] },
      { pick: 13, player: "Tyler Warren", position: "TE", school: "Penn State", team: "Miami Dolphins", avgPick: 13.6, sources: ["ESPN", "The Athletic"] },
      { pick: 14, player: "James Pearce Jr.", position: "EDGE", school: "Tennessee", team: "Indianapolis Colts", avgPick: 14.2, sources: ["CBS Sports", "PFF"] },
      { pick: 15, player: "Ashton Jeanty", position: "RB", school: "Boise State", team: "Atlanta Falcons", avgPick: 14.8, sources: ["ESPN", "NFL.com"] },
      { pick: 16, player: "Derrick Harmon", position: "DT", school: "Oregon", team: "Arizona Cardinals", avgPick: 16.2, sources: ["The Athletic", "CBS Sports"] },
      { pick: 17, player: "Emeka Egbuka", position: "WR", school: "Ohio State", team: "Cincinnati Bengals", avgPick: 17.4, sources: ["NFL.com", "PFF"] },
      { pick: 18, player: "Nick Scourton", position: "EDGE", school: "Texas A&M", team: "Seattle Seahawks", avgPick: 18.0, sources: ["ESPN", "CBS Sports"] },
      { pick: 19, player: "Colston Loveland", position: "TE", school: "Michigan", team: "Tampa Bay Buccaneers", avgPick: 19.6, sources: ["The Athletic", "PFF"] },
      { pick: 20, player: "Jahdae Barron", position: "CB", school: "Texas", team: "Denver Broncos", avgPick: 20.2, sources: ["ESPN", "NFL.com"] },
    ],
  };
}

function getNBAMockDraft(): MockDraftData {
  return {
    sport: "nba",
    year: 2025,
    draftDate: "June 25-26, 2025",
    sources: ["ESPN (Jonathan Givony)", "The Ringer (Kevin O'Connor)", "The Athletic (Sam Vecenie)", "CBS Sports (Kyle Boone)", "Bleacher Report"],
    lastUpdated: "2025-02-18",
    picks: [
      { pick: 1, player: "Cooper Flagg", position: "SF/PF", school: "Duke", avgPick: 1.0, sources: ["ESPN", "The Ringer", "The Athletic", "CBS", "BR"] },
      { pick: 2, player: "Dylan Harper", position: "SG", school: "Rutgers", avgPick: 2.2, sources: ["ESPN", "The Athletic", "CBS"] },
      { pick: 3, player: "Ace Bailey", position: "SF", school: "Rutgers", avgPick: 3.0, sources: ["The Ringer", "CBS", "BR"] },
      { pick: 4, player: "VJ Edgecombe", position: "SG", school: "Baylor", avgPick: 4.4, sources: ["ESPN", "The Athletic"] },
      { pick: 5, player: "Kon Knueppel", position: "SG/SF", school: "Duke", avgPick: 5.2, sources: ["The Ringer", "CBS", "BR"] },
      { pick: 6, player: "Kasparas Jakucionis", position: "PG", school: "Illinois", avgPick: 6.6, sources: ["ESPN", "The Athletic"] },
      { pick: 7, player: "Liam McNeeley", position: "SF", school: "UConn", avgPick: 7.0, sources: ["CBS", "BR"] },
      { pick: 8, player: "Egor Demin", position: "PG/SG", school: "BYU", avgPick: 8.4, sources: ["ESPN", "The Ringer"] },
      { pick: 9, player: "Nolan Traore", position: "PG", school: "France (pro)", avgPick: 9.2, sources: ["The Athletic", "BR"] },
      { pick: 10, player: "Tre Johnson", position: "SG", school: "Texas", avgPick: 10.0, sources: ["ESPN", "CBS"] },
      { pick: 11, player: "Jeremiah Fears", position: "PG", school: "Oklahoma", avgPick: 11.4, sources: ["The Ringer", "The Athletic"] },
      { pick: 12, player: "Khaman Maluach", position: "C", school: "Duke", avgPick: 12.2, sources: ["ESPN", "CBS"] },
      { pick: 13, player: "Jase Richardson", position: "PG", school: "Michigan State", avgPick: 13.6, sources: ["BR", "The Athletic"] },
      { pick: 14, player: "Hugo Gonzalez", position: "PG", school: "Spain (pro)", avgPick: 14.0, sources: ["ESPN", "The Ringer"] },
    ],
  };
}

function getNHLMockDraft(): MockDraftData {
  return {
    sport: "nhl",
    year: 2025,
    draftDate: "June 27-28, 2025",
    sources: ["The Athletic (Corey Pronman)", "EliteProspects", "TSN (Bob McKenzie)", "Sportsnet (Sam Cosentino)", "NHL.com (Adam Kimelman)"],
    lastUpdated: "2025-02-15",
    picks: [
      { pick: 1, player: "James Hagens", position: "C", school: "Boston College (NCAA)", avgPick: 1.2, sources: ["The Athletic", "TSN", "EliteProspects"] },
      { pick: 2, player: "Porter Martone", position: "RW", school: "Brampton (OHL)", avgPick: 2.0, sources: ["Sportsnet", "NHL.com", "EliteProspects"] },
      { pick: 3, player: "Matthew Schaefer", position: "D", school: "Erie (OHL)", avgPick: 3.2, sources: ["The Athletic", "TSN"] },
      { pick: 4, player: "Anton Frondell", position: "C", school: "Rogle (SHL)", avgPick: 4.4, sources: ["EliteProspects", "NHL.com"] },
      { pick: 5, player: "Caleb Desnoyers", position: "C", school: "Moncton (QMJHL)", avgPick: 5.0, sources: ["TSN", "Sportsnet"] },
      { pick: 6, player: "Jack Ivankovic", position: "G", school: "Brampton (OHL)", avgPick: 6.6, sources: ["The Athletic", "EliteProspects"] },
      { pick: 7, player: "Nikita Artamonov", position: "LW", school: "Torpedo (KHL)", avgPick: 7.4, sources: ["NHL.com", "TSN"] },
      { pick: 8, player: "Roger McQueen", position: "C", school: "Brandon (WHL)", avgPick: 8.2, sources: ["Sportsnet", "The Athletic"] },
      { pick: 9, player: "Lucas Pettersson", position: "C", school: "Lulea (SHL)", avgPick: 9.0, sources: ["EliteProspects", "TSN"] },
      { pick: 10, player: "Ondrej Becher", position: "C", school: "Prince George (WHL)", avgPick: 10.4, sources: ["The Athletic", "NHL.com"] },
    ],
  };
}

function getMLBMockDraft(): MockDraftData {
  return {
    sport: "mlb",
    year: 2025,
    draftDate: "July 13-15, 2025",
    sources: ["ESPN (Kiley McDaniel)", "The Athletic (Keith Law)", "MLB Pipeline", "FanGraphs (Eric Longenhagen)", "Baseball America"],
    lastUpdated: "2025-02-12",
    picks: [
      { pick: 1, player: "Jac Caglianone", position: "1B/LHP", school: "Florida", avgPick: 1.4, sources: ["ESPN", "MLB Pipeline", "Baseball America"] },
      { pick: 2, player: "Charles Kelley", position: "SS", school: "Texas", avgPick: 2.2, sources: ["The Athletic", "FanGraphs"] },
      { pick: 3, player: "Braden Montgomery", position: "OF", school: "Texas A&M", avgPick: 3.0, sources: ["ESPN", "MLB Pipeline"] },
      { pick: 4, player: "Luke Keaschall", position: "2B", school: "Arizona State", avgPick: 4.6, sources: ["Baseball America", "FanGraphs"] },
      { pick: 5, player: "Carson Benge", position: "3B", school: "Oklahoma", avgPick: 5.2, sources: ["The Athletic", "ESPN"] },
      { pick: 6, player: "Tristan Smith", position: "LHP", school: "Mississippi State", avgPick: 6.4, sources: ["MLB Pipeline", "FanGraphs"] },
      { pick: 7, player: "Kaelen Culpepper", position: "SS", school: "Kansas State", avgPick: 7.0, sources: ["ESPN", "Baseball America"] },
      { pick: 8, player: "Travis Sykora", position: "SS/RHP", school: "HS (TX)", avgPick: 8.2, sources: ["The Athletic", "MLB Pipeline"] },
      { pick: 9, player: "Storm Crew", position: "OF", school: "HS (FL)", avgPick: 9.6, sources: ["FanGraphs", "Baseball America"] },
      { pick: 10, player: "Blake Mitchell", position: "C", school: "LSU", avgPick: 10.0, sources: ["ESPN", "The Athletic"] },
    ],
  };
}

function getMLSSuperDraft(): MockDraftData {
  return {
    sport: "soccer",
    year: 2025,
    draftDate: "December 20, 2024 (Completed)",
    sources: ["MLS.com", "SBI Soccer", "American Soccer Analysis", "The Athletic", "MLSsoccer.com"],
    lastUpdated: "2024-12-20",
    picks: [
      { pick: 1, player: "Jaylen Reed", position: "MF", school: "Indiana", team: "San Jose Earthquakes", avgPick: 1.0, sources: ["MLS.com"] },
      { pick: 2, player: "Tyler Bindon", position: "DF", school: "Wake Forest", team: "D.C. United", avgPick: 2.0, sources: ["MLS.com"] },
      { pick: 3, player: "Noah Cobb", position: "DF", school: "Stanford", team: "St. Louis CITY SC", avgPick: 3.0, sources: ["MLS.com"] },
      { pick: 4, player: "Elias Norris", position: "MF", school: "Seton Hall", team: "Nashville SC", avgPick: 4.0, sources: ["MLS.com"] },
      { pick: 5, player: "Anthony Quiroz", position: "MF", school: "Western Michigan", team: "CF Montreal", avgPick: 5.0, sources: ["MLS.com"] },
      { pick: 6, player: "Abdi Salad", position: "FW", school: "Vermont", team: "Chicago Fire", avgPick: 6.0, sources: ["MLS.com"] },
      { pick: 7, player: "Renzo Zambrano", position: "MF", school: "West Virginia", team: "Houston Dynamo", avgPick: 7.0, sources: ["MLS.com"] },
      { pick: 8, player: "Jacob Murrell", position: "FW", school: "Indiana", team: "Charlotte FC", avgPick: 8.0, sources: ["MLS.com"] },
      { pick: 9, player: "Gabriel Alves", position: "MF", school: "Syracuse", team: "New England Revolution", avgPick: 9.0, sources: ["MLS.com"] },
      { pick: 10, player: "Ian Matos", position: "FW", school: "UNC Charlotte", team: "Austin FC", avgPick: 10.0, sources: ["MLS.com"] },
    ],
  };
}
