import type { Sport } from "@/lib/types";

export interface MockDraftPick {
  pick: number;
  player: string;
  position: string;
  school: string;
  team?: string;
  avgPick: number;
  sources: string[];
}

export interface MockDraftData {
  sport: Sport;
  year: number;
  draftDate: string;
  picks: MockDraftPick[];
  sources: string[];
  lastUpdated: string;
}

export function getMockDraft(sport: Sport): MockDraftData | null {
  switch (sport) {
    case "nfl": return getNFLMockDraft();
    case "nba": return getNBAMockDraft();
    case "nhl": return getNHLMockDraft();
    case "mlb": return getMLBMockDraft();
    case "soccer": return getMLSSuperDraft();
    default: return null;
  }
}

// ═══════════════════════════════════════════════════
// NFL — Full 1st Round (32 picks)
// ═══════════════════════════════════════════════════
function getNFLMockDraft(): MockDraftData {
  return {
    sport: "nfl",
    year: 2025,
    draftDate: "April 24-26, 2025",
    sources: ["ESPN (Mel Kiper Jr.)", "NFL.com (Daniel Jeremiah)", "The Athletic (Dane Brugler)", "CBS Sports (Ryan Wilson)", "Pro Football Focus"],
    lastUpdated: "2025-02-25",
    picks: [
      { pick: 1, player: "Cam Ward", position: "QB", school: "Miami", team: "Tennessee Titans", avgPick: 1.2, sources: ["ESPN", "NFL.com", "CBS"] },
      { pick: 2, player: "Shedeur Sanders", position: "QB", school: "Colorado", team: "Cleveland Browns", avgPick: 2.4, sources: ["ESPN", "Athletic", "PFF"] },
      { pick: 3, player: "Travis Hunter", position: "CB/WR", school: "Colorado", team: "New York Giants", avgPick: 2.8, sources: ["NFL.com", "CBS", "PFF"] },
      { pick: 4, player: "Abdul Carter", position: "EDGE", school: "Penn State", team: "New England Patriots", avgPick: 4.2, sources: ["ESPN", "Athletic"] },
      { pick: 5, player: "Mason Graham", position: "DT", school: "Michigan", team: "Jacksonville Jaguars", avgPick: 5.0, sources: ["NFL.com", "CBS"] },
      { pick: 6, player: "Will Johnson", position: "CB", school: "Michigan", team: "Las Vegas Raiders", avgPick: 6.4, sources: ["ESPN", "PFF"] },
      { pick: 7, player: "Tetairoa McMillan", position: "WR", school: "Arizona", team: "New York Jets", avgPick: 7.2, sources: ["Athletic", "CBS"] },
      { pick: 8, player: "Malaki Starks", position: "S", school: "Georgia", team: "Carolina Panthers", avgPick: 8.6, sources: ["ESPN", "NFL.com"] },
      { pick: 9, player: "Kelvin Banks Jr.", position: "OT", school: "Texas", team: "New Orleans Saints", avgPick: 9.4, sources: ["CBS", "PFF"] },
      { pick: 10, player: "Luther Burden III", position: "WR", school: "Missouri", team: "Chicago Bears", avgPick: 10.8, sources: ["Athletic", "NFL.com"] },
      { pick: 11, player: "Will Campbell", position: "OT", school: "LSU", team: "San Francisco 49ers", avgPick: 11.2, sources: ["ESPN", "CBS"] },
      { pick: 12, player: "Mykel Williams", position: "EDGE", school: "Georgia", team: "Dallas Cowboys", avgPick: 12.4, sources: ["NFL.com", "PFF"] },
      { pick: 13, player: "Tyler Warren", position: "TE", school: "Penn State", team: "Miami Dolphins", avgPick: 13.6, sources: ["ESPN", "Athletic"] },
      { pick: 14, player: "James Pearce Jr.", position: "EDGE", school: "Tennessee", team: "Indianapolis Colts", avgPick: 14.2, sources: ["CBS", "PFF"] },
      { pick: 15, player: "Ashton Jeanty", position: "RB", school: "Boise State", team: "Atlanta Falcons", avgPick: 14.8, sources: ["ESPN", "NFL.com"] },
      { pick: 16, player: "Derrick Harmon", position: "DT", school: "Oregon", team: "Arizona Cardinals", avgPick: 16.2, sources: ["Athletic", "CBS"] },
      { pick: 17, player: "Emeka Egbuka", position: "WR", school: "Ohio State", team: "Cincinnati Bengals", avgPick: 17.4, sources: ["NFL.com", "PFF"] },
      { pick: 18, player: "Nick Scourton", position: "EDGE", school: "Texas A&M", team: "Seattle Seahawks", avgPick: 18.0, sources: ["ESPN", "CBS"] },
      { pick: 19, player: "Colston Loveland", position: "TE", school: "Michigan", team: "Tampa Bay Buccaneers", avgPick: 19.6, sources: ["Athletic", "PFF"] },
      { pick: 20, player: "Jahdae Barron", position: "CB", school: "Texas", team: "Denver Broncos", avgPick: 20.2, sources: ["ESPN", "NFL.com"] },
      { pick: 21, player: "Shemar Stewart", position: "DL", school: "Texas A&M", team: "Pittsburgh Steelers", avgPick: 21.4, sources: ["CBS", "PFF"] },
      { pick: 22, player: "Benjamin Morrison", position: "CB", school: "Notre Dame", team: "Los Angeles Chargers", avgPick: 22.0, sources: ["ESPN", "Athletic"] },
      { pick: 23, player: "Nic Scourton", position: "EDGE", school: "Texas A&M", team: "Green Bay Packers", avgPick: 23.2, sources: ["NFL.com", "CBS"] },
      { pick: 24, player: "Tre Harris", position: "WR", school: "Ole Miss", team: "Minnesota Vikings", avgPick: 24.6, sources: ["ESPN", "PFF"] },
      { pick: 25, player: "Kenneth Grant", position: "DT", school: "Michigan", team: "Houston Texans", avgPick: 25.0, sources: ["Athletic", "NFL.com"] },
      { pick: 26, player: "Tyleik Williams", position: "DT", school: "Ohio State", team: "Los Angeles Rams", avgPick: 26.4, sources: ["CBS", "PFF"] },
      { pick: 27, player: "Aireontae Ersery", position: "OT", school: "Minnesota", team: "Baltimore Ravens", avgPick: 27.2, sources: ["ESPN", "Athletic"] },
      { pick: 28, player: "Jalon Walker", position: "LB", school: "Georgia", team: "Buffalo Bills", avgPick: 28.8, sources: ["NFL.com", "CBS"] },
      { pick: 29, player: "Isaiah Bond", position: "WR", school: "Texas", team: "Philadelphia Eagles", avgPick: 29.0, sources: ["ESPN", "PFF"] },
      { pick: 30, player: "Oronde Gadsden II", position: "TE", school: "Syracuse", team: "Washington Commanders", avgPick: 30.4, sources: ["Athletic", "NFL.com"] },
      { pick: 31, player: "Cam Skattebo", position: "RB", school: "Arizona State", team: "Kansas City Chiefs", avgPick: 31.2, sources: ["CBS", "PFF"] },
      { pick: 32, player: "Grey Zabel", position: "OL", school: "North Dakota State", team: "Detroit Lions", avgPick: 32.0, sources: ["ESPN", "Athletic"] },
    ],
  };
}

// ═══════════════════════════════════════════════════
// NBA — Full 2 Rounds (58 picks, 2024 draft had 58)
// ═══════════════════════════════════════════════════
function getNBAMockDraft(): MockDraftData {
  return {
    sport: "nba",
    year: 2025,
    draftDate: "June 25-26, 2025",
    sources: ["ESPN (Jonathan Givony)", "The Ringer (Kevin O'Connor)", "The Athletic (Sam Vecenie)", "CBS Sports (Kyle Boone)", "Bleacher Report"],
    lastUpdated: "2025-02-25",
    picks: [
      // === ROUND 1 ===
      { pick: 1, player: "Cooper Flagg", position: "SF/PF", school: "Duke", avgPick: 1.0, sources: ["ESPN", "Ringer", "Athletic", "CBS", "BR"] },
      { pick: 2, player: "Dylan Harper", position: "SG", school: "Rutgers", avgPick: 2.2, sources: ["ESPN", "Athletic", "CBS"] },
      { pick: 3, player: "Ace Bailey", position: "SF", school: "Rutgers", avgPick: 3.0, sources: ["Ringer", "CBS", "BR"] },
      { pick: 4, player: "VJ Edgecombe", position: "SG", school: "Baylor", avgPick: 4.4, sources: ["ESPN", "Athletic"] },
      { pick: 5, player: "Kon Knueppel", position: "SG/SF", school: "Duke", avgPick: 5.2, sources: ["Ringer", "CBS", "BR"] },
      { pick: 6, player: "Kasparas Jakucionis", position: "PG", school: "Illinois", avgPick: 6.6, sources: ["ESPN", "Athletic"] },
      { pick: 7, player: "Liam McNeeley", position: "SF", school: "UConn", avgPick: 7.0, sources: ["CBS", "BR"] },
      { pick: 8, player: "Egor Demin", position: "PG/SG", school: "BYU", avgPick: 8.4, sources: ["ESPN", "Ringer"] },
      { pick: 9, player: "Nolan Traore", position: "PG", school: "France (pro)", avgPick: 9.2, sources: ["Athletic", "BR"] },
      { pick: 10, player: "Tre Johnson", position: "SG", school: "Texas", avgPick: 10.0, sources: ["ESPN", "CBS"] },
      { pick: 11, player: "Jeremiah Fears", position: "PG", school: "Oklahoma", avgPick: 11.4, sources: ["Ringer", "Athletic"] },
      { pick: 12, player: "Khaman Maluach", position: "C", school: "Duke", avgPick: 12.2, sources: ["ESPN", "CBS"] },
      { pick: 13, player: "Jase Richardson", position: "PG", school: "Michigan State", avgPick: 13.6, sources: ["BR", "Athletic"] },
      { pick: 14, player: "Hugo Gonzalez", position: "PG", school: "Spain (pro)", avgPick: 14.0, sources: ["ESPN", "Ringer"] },
      { pick: 15, player: "Collin Murray-Boyles", position: "PF", school: "South Carolina", avgPick: 15.4, sources: ["CBS", "Athletic"] },
      { pick: 16, player: "Jalil Bethea", position: "SG", school: "Miami", avgPick: 16.2, sources: ["ESPN", "BR"] },
      { pick: 17, player: "Airious Bailey", position: "SF", school: "Alabama", avgPick: 17.0, sources: ["Ringer", "CBS"] },
      { pick: 18, player: "Boogie Fland", position: "PG", school: "Arkansas", avgPick: 18.6, sources: ["ESPN", "Athletic"] },
      { pick: 19, player: "Labaron Philon", position: "SG", school: "Alabama", avgPick: 19.2, sources: ["CBS", "BR"] },
      { pick: 20, player: "Tyler Betsey", position: "SG", school: "Arizona", avgPick: 20.4, sources: ["Ringer", "Athletic"] },
      { pick: 21, player: "Carter Bryant", position: "SF", school: "Arizona", avgPick: 21.0, sources: ["ESPN", "CBS"] },
      { pick: 22, player: "Baye Fall", position: "C", school: "Arkansas", avgPick: 22.4, sources: ["Athletic", "BR"] },
      { pick: 23, player: "Asa Newell", position: "PF", school: "Georgia", avgPick: 23.2, sources: ["ESPN", "Ringer"] },
      { pick: 24, player: "Braylon Mullins", position: "SG", school: "Clemson", avgPick: 24.6, sources: ["CBS", "Athletic"] },
      { pick: 25, player: "Ian Jackson", position: "SG", school: "North Carolina", avgPick: 25.0, sources: ["ESPN", "BR"] },
      { pick: 26, player: "Thomas Sorber", position: "PF/C", school: "Virginia", avgPick: 26.4, sources: ["Ringer", "CBS"] },
      { pick: 27, player: "Caleb Wilson", position: "SF", school: "Kansas", avgPick: 27.2, sources: ["ESPN", "Athletic"] },
      { pick: 28, player: "Tounde Yessoufou", position: "SG", school: "France (pro)", avgPick: 28.8, sources: ["Athletic", "BR"] },
      { pick: 29, player: "Eric Dixon", position: "PF", school: "Villanova", avgPick: 29.0, sources: ["ESPN", "CBS"] },
      { pick: 30, player: "Danny Wolf", position: "C", school: "Michigan", avgPick: 30.4, sources: ["Ringer", "Athletic"] },
      // === ROUND 2 ===
      { pick: 31, player: "Johni Broome", position: "PF/C", school: "Auburn", avgPick: 31.2, sources: ["ESPN", "CBS"] },
      { pick: 32, player: "Derik Queen", position: "C", school: "Maryland", avgPick: 32.6, sources: ["Athletic", "BR"] },
      { pick: 33, player: "Alex Sarr Jr.", position: "PF", school: "Gonzaga", avgPick: 33.0, sources: ["Ringer", "CBS"] },
      { pick: 34, player: "Ben Saraf", position: "PG", school: "Israel (pro)", avgPick: 34.4, sources: ["ESPN", "Athletic"] },
      { pick: 35, player: "Nique Clifford", position: "SF", school: "Colorado State", avgPick: 35.2, sources: ["CBS", "BR"] },
      { pick: 36, player: "JP Pegues", position: "PF", school: "Alabama", avgPick: 36.0, sources: ["ESPN", "Ringer"] },
      { pick: 37, player: "Ryan Kalkbrenner", position: "C", school: "Creighton", avgPick: 37.6, sources: ["Athletic", "CBS"] },
      { pick: 38, player: "Mark Sears", position: "PG", school: "Alabama", avgPick: 38.2, sources: ["ESPN", "BR"] },
      { pick: 39, player: "Koby Brea", position: "SF", school: "Kentucky", avgPick: 39.4, sources: ["Ringer", "Athletic"] },
      { pick: 40, player: "Adou Thiero", position: "SF", school: "Arkansas", avgPick: 40.0, sources: ["CBS", "ESPN"] },
      { pick: 41, player: "Jaylen Wells", position: "SG/SF", school: "Washington State", avgPick: 41.6, sources: ["BR", "Athletic"] },
      { pick: 42, player: "Luka Savo", position: "PF", school: "Serbia (pro)", avgPick: 42.2, sources: ["ESPN", "Ringer"] },
      { pick: 43, player: "Tucker DeVries", position: "SF", school: "Iowa State", avgPick: 43.4, sources: ["CBS", "BR"] },
      { pick: 44, player: "Johni Broome", position: "C", school: "Auburn", avgPick: 44.0, sources: ["Athletic", "ESPN"] },
      { pick: 45, player: "Dink Pate", position: "SF", school: "Florida", avgPick: 45.6, sources: ["Ringer", "CBS"] },
      { pick: 46, player: "Matas Buzelis", position: "SF", school: "Lithuania (pro)", avgPick: 46.2, sources: ["ESPN", "Athletic"] },
      { pick: 47, player: "Tyler Kolek", position: "PG", school: "Marquette", avgPick: 47.4, sources: ["CBS", "BR"] },
      { pick: 48, player: "Miles Byrd", position: "SG", school: "San Diego State", avgPick: 48.0, sources: ["Athletic", "Ringer"] },
      { pick: 49, player: "Darius Acuff Jr.", position: "PG", school: "Baylor", avgPick: 49.6, sources: ["ESPN", "CBS"] },
      { pick: 50, player: "Mouhamed Gueye", position: "PF/C", school: "Pittsburgh", avgPick: 50.2, sources: ["BR", "Athletic"] },
      { pick: 51, player: "RJ Davis", position: "PG", school: "North Carolina", avgPick: 51.4, sources: ["ESPN", "Ringer"] },
      { pick: 52, player: "Kanon Catchings", position: "SF", school: "Auburn", avgPick: 52.0, sources: ["CBS", "Athletic"] },
      { pick: 53, player: "Jaeden Mustaf", position: "PF", school: "NC State", avgPick: 53.6, sources: ["ESPN", "BR"] },
      { pick: 54, player: "Chaz Lanier", position: "SG", school: "Tennessee", avgPick: 54.2, sources: ["Ringer", "CBS"] },
      { pick: 55, player: "Bryce James", position: "SG/SF", school: "Arizona", avgPick: 55.4, sources: ["Athletic", "ESPN"] },
      { pick: 56, player: "Will Riley", position: "SF", school: "Illinois", avgPick: 56.0, sources: ["CBS", "BR"] },
      { pick: 57, player: "Trentyn Flowers", position: "SF", school: "Florida State", avgPick: 57.2, sources: ["ESPN", "Athletic"] },
      { pick: 58, player: "Payton Sandfort", position: "SG/SF", school: "Iowa", avgPick: 58.0, sources: ["Ringer", "CBS"] },
    ],
  };
}

// ═══════════════════════════════════════════════════
// NHL — Full 1st Round (32 picks)
// ═══════════════════════════════════════════════════
function getNHLMockDraft(): MockDraftData {
  return {
    sport: "nhl",
    year: 2025,
    draftDate: "June 27-28, 2025",
    sources: ["The Athletic (Corey Pronman)", "EliteProspects", "TSN (Bob McKenzie)", "Sportsnet (Sam Cosentino)", "NHL.com (Adam Kimelman)"],
    lastUpdated: "2025-02-25",
    picks: [
      { pick: 1, player: "James Hagens", position: "C", school: "Boston College (NCAA)", avgPick: 1.2, sources: ["Athletic", "TSN", "EP"] },
      { pick: 2, player: "Porter Martone", position: "RW", school: "Brampton (OHL)", avgPick: 2.0, sources: ["Sportsnet", "NHL.com", "EP"] },
      { pick: 3, player: "Matthew Schaefer", position: "D", school: "Erie (OHL)", avgPick: 3.2, sources: ["Athletic", "TSN"] },
      { pick: 4, player: "Anton Frondell", position: "C", school: "Rögle (SHL)", avgPick: 4.4, sources: ["EP", "NHL.com"] },
      { pick: 5, player: "Caleb Desnoyers", position: "C", school: "Moncton (QMJHL)", avgPick: 5.0, sources: ["TSN", "Sportsnet"] },
      { pick: 6, player: "Jack Ivankovic", position: "G", school: "Brampton (OHL)", avgPick: 6.6, sources: ["Athletic", "EP"] },
      { pick: 7, player: "Nikita Artamonov", position: "LW", school: "Torpedo (KHL)", avgPick: 7.4, sources: ["NHL.com", "TSN"] },
      { pick: 8, player: "Roger McQueen", position: "C", school: "Brandon (WHL)", avgPick: 8.2, sources: ["Sportsnet", "Athletic"] },
      { pick: 9, player: "Lucas Pettersson", position: "C", school: "Luleå (SHL)", avgPick: 9.0, sources: ["EP", "TSN"] },
      { pick: 10, player: "Ondrej Becher", position: "C", school: "Prince George (WHL)", avgPick: 10.4, sources: ["Athletic", "NHL.com"] },
      { pick: 11, player: "Ethan Czata", position: "C", school: "Ottawa (OHL)", avgPick: 11.2, sources: ["TSN", "EP"] },
      { pick: 12, player: "Jackson Smith", position: "D", school: "Tri-City (WHL)", avgPick: 12.6, sources: ["Sportsnet", "Athletic"] },
      { pick: 13, player: "Landon DuPont", position: "C", school: "Everett (WHL)", avgPick: 13.0, sources: ["NHL.com", "TSN"] },
      { pick: 14, player: "William Moore", position: "LW", school: "U.S. NTDP", avgPick: 14.4, sources: ["Athletic", "EP"] },
      { pick: 15, player: "Cameron Schmidt", position: "C", school: "Saskatoon (WHL)", avgPick: 15.2, sources: ["Sportsnet", "TSN"] },
      { pick: 16, player: "Adam Jecho", position: "C", school: "Edmonton (WHL)", avgPick: 16.6, sources: ["EP", "NHL.com"] },
      { pick: 17, player: "Blake Fiddler", position: "D", school: "Oshawa (OHL)", avgPick: 17.0, sources: ["Athletic", "TSN"] },
      { pick: 18, player: "Josh Lucier", position: "LW", school: "U.S. NTDP", avgPick: 18.4, sources: ["Sportsnet", "EP"] },
      { pick: 19, player: "Braeden Cootes", position: "C", school: "Saginaw (OHL)", avgPick: 19.2, sources: ["NHL.com", "Athletic"] },
      { pick: 20, player: "Radim Mrtka", position: "LW", school: "Tappara (Liiga)", avgPick: 20.6, sources: ["EP", "TSN"] },
      { pick: 21, player: "Jake O'Brien", position: "D", school: "Barrie (OHL)", avgPick: 21.0, sources: ["Athletic", "Sportsnet"] },
      { pick: 22, player: "Veeti Vaisanen", position: "D", school: "TPS (Liiga)", avgPick: 22.4, sources: ["EP", "NHL.com"] },
      { pick: 23, player: "Cole Reschny", position: "C", school: "Victoria (WHL)", avgPick: 23.2, sources: ["TSN", "Athletic"] },
      { pick: 24, player: "Alex Huang", position: "D", school: "Chicago (USHL)", avgPick: 24.6, sources: ["Sportsnet", "EP"] },
      { pick: 25, player: "Ivan Ryabkin", position: "RW", school: "Magnitogorsk (KHL)", avgPick: 25.0, sources: ["NHL.com", "TSN"] },
      { pick: 26, player: "Carson Wetsch", position: "LW", school: "Medicine Hat (WHL)", avgPick: 26.4, sources: ["Athletic", "EP"] },
      { pick: 27, player: "Matthew Wood", position: "RW", school: "UMinn (NCAA)", avgPick: 27.2, sources: ["Sportsnet", "TSN"] },
      { pick: 28, player: "Samuil Knyazev", position: "C", school: "CSKA (KHL)", avgPick: 28.6, sources: ["EP", "NHL.com"] },
      { pick: 29, player: "Lucas Beckman", position: "LW", school: "Djurgården (SHL)", avgPick: 29.0, sources: ["Athletic", "TSN"] },
      { pick: 30, player: "Ryan Lin", position: "C", school: "Saskatoon (WHL)", avgPick: 30.4, sources: ["Sportsnet", "EP"] },
      { pick: 31, player: "Logan Hensler", position: "D", school: "U.S. NTDP", avgPick: 31.2, sources: ["NHL.com", "Athletic"] },
      { pick: 32, player: "Quinn Beauchesne", position: "D", school: "Muskegon (USHL)", avgPick: 32.0, sources: ["TSN", "EP"] },
    ],
  };
}

// ═══════════════════════════════════════════════════
// MLB — Full 1st Round (20 picks)
// ═══════════════════════════════════════════════════
function getMLBMockDraft(): MockDraftData {
  return {
    sport: "mlb",
    year: 2025,
    draftDate: "July 13-15, 2025",
    sources: ["ESPN (Kiley McDaniel)", "The Athletic (Keith Law)", "MLB Pipeline", "FanGraphs (Eric Longenhagen)", "Baseball America"],
    lastUpdated: "2025-02-25",
    picks: [
      { pick: 1, player: "Jac Caglianone", position: "1B/LHP", school: "Florida", avgPick: 1.4, sources: ["ESPN", "MLB Pipeline", "BA"] },
      { pick: 2, player: "Charles Kelley", position: "SS", school: "Texas", avgPick: 2.2, sources: ["Athletic", "FanGraphs"] },
      { pick: 3, player: "Braden Montgomery", position: "OF", school: "Texas A&M", avgPick: 3.0, sources: ["ESPN", "MLB Pipeline"] },
      { pick: 4, player: "Luke Keaschall", position: "2B", school: "Arizona State", avgPick: 4.6, sources: ["BA", "FanGraphs"] },
      { pick: 5, player: "Carson Benge", position: "3B", school: "Oklahoma", avgPick: 5.2, sources: ["Athletic", "ESPN"] },
      { pick: 6, player: "Tristan Smith", position: "LHP", school: "Mississippi State", avgPick: 6.4, sources: ["MLB Pipeline", "FanGraphs"] },
      { pick: 7, player: "Kaelen Culpepper", position: "SS", school: "Kansas State", avgPick: 7.0, sources: ["ESPN", "BA"] },
      { pick: 8, player: "Travis Sykora", position: "SS/RHP", school: "HS (TX)", avgPick: 8.2, sources: ["Athletic", "MLB Pipeline"] },
      { pick: 9, player: "Storm Crew", position: "OF", school: "HS (FL)", avgPick: 9.6, sources: ["FanGraphs", "BA"] },
      { pick: 10, player: "Blake Mitchell", position: "C", school: "LSU", avgPick: 10.0, sources: ["ESPN", "Athletic"] },
      { pick: 11, player: "Tate Ragan", position: "RHP", school: "Georgia Tech", avgPick: 11.4, sources: ["MLB Pipeline", "FanGraphs"] },
      { pick: 12, player: "Seager DeGrom", position: "SS", school: "HS (NC)", avgPick: 12.2, sources: ["BA", "ESPN"] },
      { pick: 13, player: "Andrew Morgan", position: "C/3B", school: "HS (CA)", avgPick: 13.6, sources: ["Athletic", "FanGraphs"] },
      { pick: 14, player: "Cam Caminiti", position: "3B", school: "Saddleback CC", avgPick: 14.0, sources: ["ESPN", "MLB Pipeline"] },
      { pick: 15, player: "Ty Southisene", position: "SS", school: "UC Irvine", avgPick: 15.4, sources: ["BA", "Athletic"] },
      { pick: 16, player: "Jaylen Sells", position: "RHP", school: "HS (GA)", avgPick: 16.2, sources: ["FanGraphs", "ESPN"] },
      { pick: 17, player: "Walker Janek", position: "C", school: "HS (TX)", avgPick: 17.6, sources: ["MLB Pipeline", "BA"] },
      { pick: 18, player: "Corbyn Calloway", position: "OF", school: "HS (FL)", avgPick: 18.0, sources: ["Athletic", "FanGraphs"] },
      { pick: 19, player: "Bryce Eldridge", position: "1B/LHP", school: "James Madison", avgPick: 19.4, sources: ["ESPN", "MLB Pipeline"] },
      { pick: 20, player: "Colin Fields", position: "RHP", school: "Florida State", avgPick: 20.0, sources: ["BA", "Athletic"] },
    ],
  };
}

// ═══════════════════════════════════════════════════
// MLS SuperDraft — Full 1st Round (26 picks)
// ═══════════════════════════════════════════════════
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
      { pick: 5, player: "Anthony Quiroz", position: "MF", school: "Western Michigan", team: "CF Montréal", avgPick: 5.0, sources: ["MLS.com"] },
      { pick: 6, player: "Abdi Salad", position: "FW", school: "Vermont", team: "Chicago Fire", avgPick: 6.0, sources: ["MLS.com"] },
      { pick: 7, player: "Renzo Zambrano", position: "MF", school: "West Virginia", team: "Houston Dynamo", avgPick: 7.0, sources: ["MLS.com"] },
      { pick: 8, player: "Jacob Murrell", position: "FW", school: "Indiana", team: "Charlotte FC", avgPick: 8.0, sources: ["MLS.com"] },
      { pick: 9, player: "Gabriel Alves", position: "MF", school: "Syracuse", team: "New England Revolution", avgPick: 9.0, sources: ["MLS.com"] },
      { pick: 10, player: "Ian Matos", position: "FW", school: "UNC Charlotte", team: "Austin FC", avgPick: 10.0, sources: ["MLS.com"] },
      { pick: 11, player: "Owen Goss", position: "DF", school: "Virginia", team: "San Jose Earthquakes", avgPick: 11.0, sources: ["MLS.com"] },
      { pick: 12, player: "Marcus Bontis", position: "MF", school: "Akron", team: "New York Red Bulls", avgPick: 12.0, sources: ["MLS.com"] },
      { pick: 13, player: "Sam Sarver", position: "GK", school: "Clemson", team: "Columbus Crew", avgPick: 13.0, sources: ["MLS.com"] },
      { pick: 14, player: "Carlos Pinto", position: "FW", school: "Loyola Chicago", team: "Nashville SC", avgPick: 14.0, sources: ["MLS.com"] },
      { pick: 15, player: "Kipp Keller", position: "DF", school: "St. Louis U.", team: "CF Montréal", avgPick: 15.0, sources: ["MLS.com"] },
      { pick: 16, player: "Joao Moutinho", position: "DF", school: "Stanford", team: "Minnesota United", avgPick: 16.0, sources: ["MLS.com"] },
      { pick: 17, player: "Luke Brennan", position: "MF", school: "Georgetown", team: "Orlando City", avgPick: 17.0, sources: ["MLS.com"] },
      { pick: 18, player: "Alex Saporiti", position: "FW", school: "Michigan State", team: "FC Cincinnati", avgPick: 18.0, sources: ["MLS.com"] },
      { pick: 19, player: "Mason Visconti", position: "MF", school: "Wake Forest", team: "Charlotte FC", avgPick: 19.0, sources: ["MLS.com"] },
      { pick: 20, player: "Gershon Koffie", position: "MF", school: "Duke", team: "Colorado Rapids", avgPick: 20.0, sources: ["MLS.com"] },
      { pick: 21, player: "Ryan Minnick", position: "FW", school: "Notre Dame", team: "D.C. United", avgPick: 21.0, sources: ["MLS.com"] },
      { pick: 22, player: "Axel Picazo", position: "FW", school: "SMU", team: "Houston Dynamo", avgPick: 22.0, sources: ["MLS.com"] },
      { pick: 23, player: "Damian Rivera", position: "MF", school: "Providence", team: "New England Revolution", avgPick: 23.0, sources: ["MLS.com"] },
      { pick: 24, player: "Tomas Romero", position: "GK", school: "Penn State", team: "Atlanta United", avgPick: 24.0, sources: ["MLS.com"] },
      { pick: 25, player: "David Vazquez", position: "MF", school: "UCLA", team: "LAFC", avgPick: 25.0, sources: ["MLS.com"] },
      { pick: 26, player: "Tyler Hall", position: "DF", school: "Virginia Tech", team: "Austin FC", avgPick: 26.0, sources: ["MLS.com"] },
    ],
  };
}
