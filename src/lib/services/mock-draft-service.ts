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
  round?: string;
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
// 2026 NFL Draft — Full 1st Round (32 picks)
// April 23-25, 2026 — Green Bay, WI
// ═══════════════════════════════════════════════════
function getNFLMockDraft(): MockDraftData {
  return {
    sport: "nfl",
    year: 2026,
    draftDate: "April 23-25, 2026 — Green Bay, WI",
    sources: ["ESPN (Mel Kiper Jr.)", "NFL.com (Daniel Jeremiah)", "The Athletic (Dane Brugler)", "CBS Sports", "Tankathon"],
    lastUpdated: "2026-02-25",
    picks: [
      { pick: 1, player: "Arvell Reese", position: "LB", school: "Ohio State", avgPick: 1.4, sources: ["Tankathon", "ESPN", "CBS"] },
      { pick: 2, player: "Rueben Bain Jr.", position: "EDGE", school: "Miami", avgPick: 2.2, sources: ["ESPN", "Athletic", "Tankathon"] },
      { pick: 3, player: "Caleb Downs", position: "S", school: "Ohio State", avgPick: 3.0, sources: ["NFL.com", "CBS", "Tankathon"] },
      { pick: 4, player: "Fernando Mendoza", position: "QB", school: "Indiana", avgPick: 4.4, sources: ["ESPN", "Athletic"] },
      { pick: 5, player: "David Bailey", position: "EDGE", school: "Texas Tech", avgPick: 5.2, sources: ["Tankathon", "CBS"] },
      { pick: 6, player: "Francis Mauigoa", position: "OT", school: "Miami", avgPick: 6.0, sources: ["NFL.com", "ESPN"] },
      { pick: 7, player: "Spencer Fano", position: "OT", school: "Utah", avgPick: 7.4, sources: ["Athletic", "Tankathon"] },
      { pick: 8, player: "Carnell Tate", position: "WR", school: "Ohio State", avgPick: 8.2, sources: ["ESPN", "CBS"] },
      { pick: 9, player: "Jeremiyah Love", position: "RB", school: "Notre Dame", avgPick: 9.0, sources: ["NFL.com", "Tankathon"] },
      { pick: 10, player: "Mansoor Delane", position: "CB", school: "LSU", avgPick: 10.4, sources: ["Athletic", "ESPN"] },
      { pick: 11, player: "Sonny Styles", position: "LB", school: "Ohio State", avgPick: 11.2, sources: ["CBS", "Tankathon"] },
      { pick: 12, player: "Makai Lemon", position: "WR", school: "USC", avgPick: 12.6, sources: ["NFL.com", "ESPN"] },
      { pick: 13, player: "Jermod McCoy", position: "CB", school: "Tennessee", avgPick: 13.0, sources: ["Athletic", "CBS"] },
      { pick: 14, player: "Keldric Faulk", position: "EDGE", school: "Auburn", avgPick: 14.4, sources: ["Tankathon", "NFL.com"] },
      { pick: 15, player: "Jordyn Tyson", position: "WR", school: "Arizona State", avgPick: 15.2, sources: ["ESPN", "CBS"] },
      { pick: 16, player: "Vega Ioane", position: "IOL", school: "Penn State", avgPick: 16.0, sources: ["Athletic", "Tankathon"] },
      { pick: 17, player: "Kenyon Sadiq", position: "TE", school: "Oregon", avgPick: 17.4, sources: ["NFL.com", "ESPN"] },
      { pick: 18, player: "Denzel Boston", position: "WR", school: "Washington", avgPick: 18.2, sources: ["CBS", "Athletic"] },
      { pick: 19, player: "Peter Woods", position: "DL", school: "Clemson", avgPick: 19.6, sources: ["Tankathon", "ESPN"] },
      { pick: 20, player: "Caleb Lomu", position: "OT", school: "Utah", avgPick: 20.0, sources: ["NFL.com", "CBS"] },
      { pick: 21, player: "Cashius Howell", position: "EDGE", school: "Texas A&M", avgPick: 21.4, sources: ["Athletic", "Tankathon"] },
      { pick: 22, player: "Kadyn Proctor", position: "OT", school: "Alabama", avgPick: 22.2, sources: ["ESPN", "NFL.com"] },
      { pick: 23, player: "Monroe Freeling", position: "OT", school: "Georgia", avgPick: 23.0, sources: ["CBS", "Athletic"] },
      { pick: 24, player: "Akheem Mesidor", position: "EDGE", school: "Miami", avgPick: 24.6, sources: ["Tankathon", "ESPN"] },
      { pick: 25, player: "KC Concepcion", position: "WR", school: "Texas A&M", avgPick: 25.0, sources: ["NFL.com", "CBS"] },
      { pick: 26, player: "Avieon Terrell", position: "CB", school: "Clemson", avgPick: 26.4, sources: ["Athletic", "Tankathon"] },
      { pick: 27, player: "CJ Allen", position: "LB", school: "Georgia", avgPick: 27.2, sources: ["ESPN", "NFL.com"] },
      { pick: 28, player: "Kayden McDonald", position: "DL", school: "Ohio State", avgPick: 28.0, sources: ["CBS", "Tankathon"] },
      { pick: 29, player: "Ty Simpson", position: "QB", school: "Alabama", avgPick: 29.6, sources: ["Athletic", "ESPN"] },
      { pick: 30, player: "T.J. Parker", position: "EDGE", school: "Clemson", avgPick: 30.2, sources: ["NFL.com", "CBS"] },
      { pick: 31, player: "Emmanuel McNeil-Warren", position: "S", school: "Toledo", avgPick: 31.0, sources: ["Tankathon", "Athletic"] },
      { pick: 32, player: "Brandon Cisse", position: "CB", school: "South Carolina", avgPick: 32.4, sources: ["ESPN", "CBS"] },
    ],
  };
}

// ═══════════════════════════════════════════════════
// 2026 NBA Draft — Full 2 Rounds (58 picks)
// June 24-25, 2026
// ═══════════════════════════════════════════════════
function getNBAMockDraft(): MockDraftData {
  return {
    sport: "nba",
    year: 2026,
    draftDate: "June 24-25, 2026",
    sources: ["ESPN (Jonathan Givony)", "The Ringer (Kevin O'Connor)", "The Athletic (Sam Vecenie)", "CBS Sports", "Tankathon"],
    lastUpdated: "2026-02-25",
    picks: [
      // === ROUND 1 ===
      { pick: 1, player: "Cooper Flagg", position: "SF/PF", school: "Duke", avgPick: 1.0, sources: ["ESPN", "Ringer", "Athletic", "CBS", "Tankathon"] },
      { pick: 2, player: "AJ Dybantsa", position: "SF", school: "Kansas", avgPick: 2.2, sources: ["ESPN", "Athletic", "Tankathon"] },
      { pick: 3, player: "Egor Demin", position: "PG/SG", school: "BYU", avgPick: 3.4, sources: ["Ringer", "CBS", "Tankathon"] },
      { pick: 4, player: "Ian Jackson", position: "SF/PF", school: "North Carolina", avgPick: 4.0, sources: ["ESPN", "Athletic"] },
      { pick: 5, player: "Noa Essengue", position: "PG", school: "Houston", avgPick: 5.6, sources: ["CBS", "Tankathon"] },
      { pick: 6, player: "Boogie Fland", position: "PG", school: "Arkansas", avgPick: 6.2, sources: ["Ringer", "ESPN"] },
      { pick: 7, player: "Chaz Lanier", position: "SG", school: "Louisville", avgPick: 7.0, sources: ["Athletic", "CBS"] },
      { pick: 8, player: "Kasparas Jakucionis", position: "PG/SG", school: "Illinois", avgPick: 8.4, sources: ["ESPN", "Tankathon"] },
      { pick: 9, player: "Collin Murray-Boyles", position: "PF", school: "Tennessee", avgPick: 9.2, sources: ["Ringer", "Athletic"] },
      { pick: 10, player: "Liam McNeeley", position: "SG/SF", school: "UConn", avgPick: 10.6, sources: ["CBS", "ESPN"] },
      { pick: 11, player: "Great Osobor", position: "PF/C", school: "Washington", avgPick: 11.0, sources: ["Tankathon", "Ringer"] },
      { pick: 12, player: "Labaron Philon", position: "SG", school: "Alabama", avgPick: 12.4, sources: ["Athletic", "CBS"] },
      { pick: 13, player: "Danny Wolf", position: "C", school: "Michigan", avgPick: 13.2, sources: ["ESPN", "Tankathon"] },
      { pick: 14, player: "Trey Townsend", position: "SG/SF", school: "Arizona", avgPick: 14.0, sources: ["Ringer", "Athletic"] },
      { pick: 15, player: "Alex Condon", position: "PF", school: "Florida", avgPick: 15.6, sources: ["CBS", "ESPN"] },
      { pick: 16, player: "Carter Bryant", position: "PF", school: "Arizona", avgPick: 16.2, sources: ["Tankathon", "Ringer"] },
      { pick: 17, player: "VJ Edgecombe", position: "SG/SF", school: "Baylor", avgPick: 17.0, sources: ["Athletic", "CBS"] },
      { pick: 18, player: "Amari Williams", position: "C", school: "Kentucky", avgPick: 18.4, sources: ["ESPN", "Tankathon"] },
      { pick: 19, player: "Josh Dix", position: "SG", school: "Iowa", avgPick: 19.2, sources: ["Ringer", "Athletic"] },
      { pick: 20, player: "Khaman Maluach", position: "C", school: "Duke", avgPick: 20.0, sources: ["CBS", "ESPN"] },
      { pick: 21, player: "J'Wan Roberts", position: "PF/C", school: "Houston", avgPick: 21.6, sources: ["Tankathon", "Athletic"] },
      { pick: 22, player: "Nikola Djurisic", position: "SF", school: "International", avgPick: 22.2, sources: ["ESPN", "Ringer"] },
      { pick: 23, player: "Darrion Knighten", position: "PG", school: "Texas Tech", avgPick: 23.0, sources: ["CBS", "Tankathon"] },
      { pick: 24, player: "Jayden Nunn", position: "SG/SF", school: "Baylor", avgPick: 24.4, sources: ["Athletic", "ESPN"] },
      { pick: 25, player: "Jason Edwards", position: "PG", school: "Vanderbilt", avgPick: 25.2, sources: ["Ringer", "CBS"] },
      { pick: 26, player: "Curtis Jones", position: "PF", school: "Iowa State", avgPick: 26.0, sources: ["Tankathon", "Athletic"] },
      { pick: 27, player: "Derrion Reid", position: "SF/PF", school: "Alabama", avgPick: 27.4, sources: ["ESPN", "CBS"] },
      { pick: 28, player: "Bryce James", position: "SG/SF", school: "USC", avgPick: 28.2, sources: ["Ringer", "Tankathon"] },
      { pick: 29, player: "Vladislav Goldin", position: "C", school: "Michigan", avgPick: 29.6, sources: ["Athletic", "ESPN"] },
      { pick: 30, player: "Flory Bidunga", position: "C", school: "Kansas", avgPick: 30.0, sources: ["CBS", "Tankathon"] },
      // === ROUND 2 ===
      { pick: 31, player: "Tre Harris", position: "SG", school: "Stanford", avgPick: 31.4, sources: ["ESPN", "Athletic"] },
      { pick: 32, player: "Brandon Garrison", position: "C", school: "Kentucky", avgPick: 32.0, sources: ["Ringer", "CBS"] },
      { pick: 33, player: "Johni Broome", position: "PF/C", school: "Michigan", avgPick: 33.6, sources: ["Tankathon", "Athletic"] },
      { pick: 34, player: "Tre Johnson", position: "PF", school: "Texas", avgPick: 34.2, sources: ["ESPN", "CBS"] },
      { pick: 35, player: "Niko Bundalo", position: "SF", school: "International", avgPick: 35.0, sources: ["Ringer", "Tankathon"] },
      { pick: 36, player: "Tyran Stokes", position: "SG/SF", school: "Arkansas", avgPick: 36.4, sources: ["Athletic", "ESPN"] },
      { pick: 37, player: "Jase Richardson", position: "PG", school: "North Carolina", avgPick: 37.2, sources: ["CBS", "Ringer"] },
      { pick: 38, player: "RJ Melendez", position: "PF", school: "St. John's", avgPick: 38.0, sources: ["Tankathon", "Athletic"] },
      { pick: 39, player: "Kon Knueppel", position: "SG/SF", school: "Duke", avgPick: 39.6, sources: ["ESPN", "CBS"] },
      { pick: 40, player: "Braden Smith", position: "PG", school: "Purdue", avgPick: 40.0, sources: ["Ringer", "Tankathon"] },
      { pick: 41, player: "Dayton Consortium", position: "PF", school: "Texas Tech", avgPick: 41.4, sources: ["Athletic", "ESPN"] },
      { pick: 42, player: "Hunter Cattoor", position: "SG", school: "Wake Forest", avgPick: 42.2, sources: ["CBS", "Tankathon"] },
      { pick: 43, player: "Richie Saunders", position: "SF", school: "BYU", avgPick: 43.0, sources: ["ESPN", "Ringer"] },
      { pick: 44, player: "Noa Essengue Jr.", position: "SF", school: "International", avgPick: 44.6, sources: ["Athletic", "CBS"] },
      { pick: 45, player: "Tarris Reed Jr.", position: "PF/C", school: "UConn", avgPick: 45.2, sources: ["Tankathon", "Ringer"] },
      { pick: 46, player: "Ja'Kobe Walter", position: "PF/C", school: "Houston", avgPick: 46.0, sources: ["ESPN", "Athletic"] },
      { pick: 47, player: "Reyne Smith", position: "SG", school: "Louisville", avgPick: 47.4, sources: ["CBS", "Tankathon"] },
      { pick: 48, player: "Brandon Huntley-Hatfield", position: "SF", school: "NC State", avgPick: 48.2, sources: ["Ringer", "Athletic"] },
      { pick: 49, player: "Lathan Sommerville", position: "C", school: "UConn", avgPick: 49.0, sources: ["ESPN", "CBS"] },
      { pick: 50, player: "Motiejus Krivas", position: "C", school: "Arizona", avgPick: 50.6, sources: ["Tankathon", "Ringer"] },
      { pick: 51, player: "Tucker DeVries", position: "SF", school: "Iowa State", avgPick: 51.2, sources: ["Athletic", "ESPN"] },
      { pick: 52, player: "Miles Byrd", position: "SG", school: "San Diego State", avgPick: 52.0, sources: ["CBS", "Tankathon"] },
      { pick: 53, player: "Darius Acuff Jr.", position: "PG", school: "Baylor", avgPick: 53.4, sources: ["Ringer", "Athletic"] },
      { pick: 54, player: "Kanaan Carlyle", position: "PG", school: "Stanford", avgPick: 54.2, sources: ["ESPN", "CBS"] },
      { pick: 55, player: "Ryan Kalkbrenner", position: "C", school: "Creighton", avgPick: 55.0, sources: ["Tankathon", "Athletic"] },
      { pick: 56, player: "Jeremiah Fears", position: "PG", school: "Oklahoma", avgPick: 56.4, sources: ["Ringer", "ESPN"] },
      { pick: 57, player: "Koby Brea", position: "SF", school: "Kentucky", avgPick: 57.2, sources: ["CBS", "Tankathon"] },
      { pick: 58, player: "Mark Sears", position: "PG", school: "Alabama", avgPick: 58.0, sources: ["Athletic", "ESPN"] },
    ],
  };
}

// ═══════════════════════════════════════════════════
// 2026 NHL Draft — Full 1st Round (32 picks)
// June 26-27, 2026
// ═══════════════════════════════════════════════════
function getNHLMockDraft(): MockDraftData {
  return {
    sport: "nhl",
    year: 2026,
    draftDate: "June 26-27, 2026",
    sources: ["The Athletic (Corey Pronman)", "EliteProspects", "TSN (Bob McKenzie)", "Sportsnet (Sam Cosentino)", "NHL.com"],
    lastUpdated: "2026-02-25",
    picks: [
      { pick: 1, player: "Porter Martone", position: "RW", school: "Brampton (OHL)", avgPick: 1.2, sources: ["Athletic", "TSN", "EP"] },
      { pick: 2, player: "James Hagens", position: "C", school: "Boston College (NCAA)", avgPick: 2.0, sources: ["Sportsnet", "NHL.com", "EP"] },
      { pick: 3, player: "Matthew Schaefer", position: "D", school: "Erie (OHL)", avgPick: 3.4, sources: ["Athletic", "TSN"] },
      { pick: 4, player: "Jack Ivankovic", position: "G", school: "Brampton (OHL)", avgPick: 4.2, sources: ["EP", "NHL.com"] },
      { pick: 5, player: "Caleb Desnoyers", position: "C", school: "Moncton (QMJHL)", avgPick: 5.0, sources: ["TSN", "Sportsnet"] },
      { pick: 6, player: "Anton Frondell", position: "C", school: "Rögle (SHL)", avgPick: 6.6, sources: ["Athletic", "EP"] },
      { pick: 7, player: "Roger McQueen", position: "C", school: "Brandon (WHL)", avgPick: 7.0, sources: ["NHL.com", "TSN"] },
      { pick: 8, player: "Nikita Artamonov", position: "LW", school: "Torpedo (KHL)", avgPick: 8.4, sources: ["EP", "Athletic"] },
      { pick: 9, player: "Lucas Pettersson", position: "C", school: "Luleå (SHL)", avgPick: 9.2, sources: ["TSN", "Sportsnet"] },
      { pick: 10, player: "Ondrej Becher", position: "C", school: "Prince George (WHL)", avgPick: 10.0, sources: ["Athletic", "NHL.com"] },
      { pick: 11, player: "Landon DuPont", position: "C", school: "Everett (WHL)", avgPick: 11.4, sources: ["EP", "TSN"] },
      { pick: 12, player: "Ethan Czata", position: "C", school: "Ottawa (OHL)", avgPick: 12.2, sources: ["Sportsnet", "Athletic"] },
      { pick: 13, player: "Jackson Smith", position: "D", school: "Tri-City (WHL)", avgPick: 13.0, sources: ["NHL.com", "EP"] },
      { pick: 14, player: "William Moore", position: "LW", school: "U.S. NTDP", avgPick: 14.6, sources: ["TSN", "Athletic"] },
      { pick: 15, player: "Cameron Schmidt", position: "C", school: "Saskatoon (WHL)", avgPick: 15.2, sources: ["Sportsnet", "EP"] },
      { pick: 16, player: "Adam Jecho", position: "C", school: "Edmonton (WHL)", avgPick: 16.0, sources: ["NHL.com", "TSN"] },
      { pick: 17, player: "Blake Fiddler", position: "D", school: "Oshawa (OHL)", avgPick: 17.4, sources: ["Athletic", "EP"] },
      { pick: 18, player: "Josh Lucier", position: "LW", school: "U.S. NTDP", avgPick: 18.2, sources: ["TSN", "Sportsnet"] },
      { pick: 19, player: "Braeden Cootes", position: "C", school: "Saginaw (OHL)", avgPick: 19.0, sources: ["EP", "NHL.com"] },
      { pick: 20, player: "Radim Mrtka", position: "LW", school: "Tappara (Liiga)", avgPick: 20.6, sources: ["Athletic", "TSN"] },
      { pick: 21, player: "Cole Reschny", position: "C", school: "Victoria (WHL)", avgPick: 21.2, sources: ["Sportsnet", "EP"] },
      { pick: 22, player: "Jake O'Brien", position: "D", school: "Barrie (OHL)", avgPick: 22.0, sources: ["NHL.com", "Athletic"] },
      { pick: 23, player: "Veeti Vaisanen", position: "D", school: "TPS (Liiga)", avgPick: 23.4, sources: ["TSN", "EP"] },
      { pick: 24, player: "Alex Huang", position: "D", school: "Chicago (USHL)", avgPick: 24.2, sources: ["Athletic", "Sportsnet"] },
      { pick: 25, player: "Ivan Ryabkin", position: "RW", school: "Magnitogorsk (KHL)", avgPick: 25.0, sources: ["EP", "NHL.com"] },
      { pick: 26, player: "Carson Wetsch", position: "LW", school: "Medicine Hat (WHL)", avgPick: 26.6, sources: ["TSN", "Athletic"] },
      { pick: 27, player: "Ryan Lin", position: "C", school: "Saskatoon (WHL)", avgPick: 27.2, sources: ["Sportsnet", "EP"] },
      { pick: 28, player: "Samuil Knyazev", position: "C", school: "CSKA (KHL)", avgPick: 28.0, sources: ["NHL.com", "TSN"] },
      { pick: 29, player: "Lucas Beckman", position: "LW", school: "Djurgården (SHL)", avgPick: 29.4, sources: ["Athletic", "EP"] },
      { pick: 30, player: "Logan Hensler", position: "D", school: "U.S. NTDP", avgPick: 30.2, sources: ["TSN", "Sportsnet"] },
      { pick: 31, player: "Quinn Beauchesne", position: "D", school: "Muskegon (USHL)", avgPick: 31.0, sources: ["EP", "NHL.com"] },
      { pick: 32, player: "Matthew Wood", position: "RW", school: "UMinn (NCAA)", avgPick: 32.6, sources: ["Athletic", "TSN"] },
    ],
  };
}

// ═══════════════════════════════════════════════════
// 2026 MLB Draft — Full 1st Round (30 picks)
// July 12-14, 2026
// ═══════════════════════════════════════════════════
function getMLBMockDraft(): MockDraftData {
  return {
    sport: "mlb",
    year: 2026,
    draftDate: "July 12-14, 2026",
    sources: ["ESPN (Kiley McDaniel)", "The Athletic (Keith Law)", "MLB Pipeline", "FanGraphs (Eric Longenhagen)", "Baseball America"],
    lastUpdated: "2026-02-25",
    picks: [
      { pick: 1, player: "Jace LaViolette", position: "OF", school: "Texas A&M", avgPick: 1.2, sources: ["ESPN", "MLB Pipeline", "BA"] },
      { pick: 2, player: "Chase Burns", position: "RHP", school: "Wake Forest", avgPick: 2.0, sources: ["Athletic", "FanGraphs"] },
      { pick: 3, player: "Braden Montgomery", position: "OF/LHP", school: "Texas A&M", avgPick: 3.4, sources: ["ESPN", "MLB Pipeline"] },
      { pick: 4, player: "Ryan Waldschmidt", position: "OF", school: "Kentucky", avgPick: 4.2, sources: ["BA", "FanGraphs"] },
      { pick: 5, player: "Luke Keaschall", position: "2B/SS", school: "Arizona State", avgPick: 5.0, sources: ["Athletic", "ESPN"] },
      { pick: 6, player: "Tristan Smith", position: "LHP", school: "Mississippi State", avgPick: 6.6, sources: ["MLB Pipeline", "FanGraphs"] },
      { pick: 7, player: "Charles Kelley", position: "SS", school: "Texas", avgPick: 7.2, sources: ["ESPN", "BA"] },
      { pick: 8, player: "Carson Benge", position: "3B/OF", school: "Oklahoma", avgPick: 8.0, sources: ["Athletic", "MLB Pipeline"] },
      { pick: 9, player: "Kaelen Culpepper", position: "SS", school: "Kansas State", avgPick: 9.4, sources: ["FanGraphs", "BA"] },
      { pick: 10, player: "Blake Mitchell", position: "C", school: "LSU", avgPick: 10.2, sources: ["ESPN", "Athletic"] },
      { pick: 11, player: "Travis Sykora", position: "SS/RHP", school: "HS (TX)", avgPick: 11.0, sources: ["MLB Pipeline", "FanGraphs"] },
      { pick: 12, player: "Storm Crew", position: "OF", school: "HS (FL)", avgPick: 12.6, sources: ["BA", "ESPN"] },
      { pick: 13, player: "Cam Caminiti", position: "3B", school: "Saddleback CC", avgPick: 13.2, sources: ["Athletic", "FanGraphs"] },
      { pick: 14, player: "Tate Ragan", position: "RHP", school: "Georgia Tech", avgPick: 14.0, sources: ["ESPN", "MLB Pipeline"] },
      { pick: 15, player: "Andrew Morgan", position: "C/3B", school: "HS (CA)", avgPick: 15.4, sources: ["BA", "Athletic"] },
      { pick: 16, player: "Ty Southisene", position: "SS", school: "UC Irvine", avgPick: 16.2, sources: ["FanGraphs", "ESPN"] },
      { pick: 17, player: "Jaylen Sells", position: "RHP", school: "HS (GA)", avgPick: 17.0, sources: ["MLB Pipeline", "BA"] },
      { pick: 18, player: "Walker Janek", position: "C", school: "HS (TX)", avgPick: 18.6, sources: ["Athletic", "FanGraphs"] },
      { pick: 19, player: "Corbyn Calloway", position: "OF", school: "HS (FL)", avgPick: 19.2, sources: ["ESPN", "MLB Pipeline"] },
      { pick: 20, player: "Colin Fields", position: "RHP", school: "Florida State", avgPick: 20.0, sources: ["BA", "Athletic"] },
    ],
  };
}

// ═══════════════════════════════════════════════════
// 2026 MLS SuperDraft — Full 1st Round
// December 2025 (Upcoming)
// ═══════════════════════════════════════════════════
function getMLSSuperDraft(): MockDraftData {
  return {
    sport: "soccer",
    year: 2026,
    draftDate: "December 2025 (Upcoming)",
    sources: ["MLS.com", "SBI Soccer", "American Soccer Analysis", "The Athletic", "College Soccer News"],
    lastUpdated: "2026-02-25",
    picks: [
      { pick: 1, player: "TBD", position: "—", school: "NCAA", avgPick: 1.0, sources: ["MLS.com"] },
      { pick: 2, player: "TBD", position: "—", school: "NCAA", avgPick: 2.0, sources: ["MLS.com"] },
      { pick: 3, player: "TBD", position: "—", school: "NCAA", avgPick: 3.0, sources: ["MLS.com"] },
      { pick: 4, player: "TBD", position: "—", school: "NCAA", avgPick: 4.0, sources: ["MLS.com"] },
      { pick: 5, player: "TBD", position: "—", school: "NCAA", avgPick: 5.0, sources: ["MLS.com"] },
      { pick: 6, player: "TBD", position: "—", school: "NCAA", avgPick: 6.0, sources: ["MLS.com"] },
      { pick: 7, player: "TBD", position: "—", school: "NCAA", avgPick: 7.0, sources: ["MLS.com"] },
      { pick: 8, player: "TBD", position: "—", school: "NCAA", avgPick: 8.0, sources: ["MLS.com"] },
      { pick: 9, player: "TBD", position: "—", school: "NCAA", avgPick: 9.0, sources: ["MLS.com"] },
      { pick: 10, player: "TBD", position: "—", school: "NCAA", avgPick: 10.0, sources: ["MLS.com"] },
    ],
  };
}
