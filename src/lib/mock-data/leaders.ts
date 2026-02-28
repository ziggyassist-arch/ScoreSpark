import type { Sport } from "../types";

export interface MockLeaderEntry {
  rank: number;
  playerName: string;
  teamName: string;
  teamId: string;
  value: string;
  displayValue: string;
}

export interface MockLeaderCategory {
  name: string;
  abbreviation: string;
  entries: MockLeaderEntry[];
}

export interface MockSportLeaders {
  sport: Sport;
  categories: MockLeaderCategory[];
}

// ═══════════════════════════════════════════════════════════════
// SOCCER — Top Scorers (football-data.org /scorers format)
// ═══════════════════════════════════════════════════════════════

export interface MockSoccerScorer {
  rank: number;
  playerName: string;
  teamName: string;
  teamId: string;
  goals: number;
  assists: number;
  playedMatches: number;
}

export const eplScorers: MockSoccerScorer[] = [
  { rank: 1, playerName: "Erling Haaland", teamName: "Manchester City", teamId: "mock-soccer-2", goals: 22, assists: 4, playedMatches: 25 },
  { rank: 2, playerName: "Mohamed Salah", teamName: "Liverpool", teamId: "mock-soccer-3", goals: 18, assists: 10, playedMatches: 27 },
  { rank: 3, playerName: "Alexander Isak", teamName: "Newcastle United", teamId: "mock-soccer-7", goals: 16, assists: 5, playedMatches: 26 },
  { rank: 4, playerName: "Bukayo Saka", teamName: "Arsenal", teamId: "mock-soccer-1", goals: 14, assists: 9, playedMatches: 27 },
  { rank: 5, playerName: "Cole Palmer", teamName: "Chelsea", teamId: "mock-soccer-4", goals: 14, assists: 8, playedMatches: 25 },
  { rank: 6, playerName: "Ollie Watkins", teamName: "Aston Villa", teamId: "mock-soccer-8", goals: 13, assists: 7, playedMatches: 27 },
  { rank: 7, playerName: "Son Heung-min", teamName: "Tottenham Hotspur", teamId: "mock-soccer-6", goals: 12, assists: 5, playedMatches: 24 },
  { rank: 8, playerName: "Phil Foden", teamName: "Manchester City", teamId: "mock-soccer-2", goals: 11, assists: 6, playedMatches: 23 },
  { rank: 9, playerName: "Darwin Núñez", teamName: "Liverpool", teamId: "mock-soccer-3", goals: 10, assists: 3, playedMatches: 22 },
  { rank: 10, playerName: "Nicolas Jackson", teamName: "Chelsea", teamId: "mock-soccer-4", goals: 10, assists: 5, playedMatches: 26 },
];

// ═══════════════════════════════════════════════════════════════
// NBA Leaders
// ═══════════════════════════════════════════════════════════════

export const nbaLeaders: MockSportLeaders = {
  sport: "nba",
  categories: [
    {
      name: "Points Per Game",
      abbreviation: "PPG",
      entries: [
        { rank: 1, playerName: "Giannis Antetokounmpo", teamName: "Milwaukee Bucks", teamId: "mock-nba-4", value: "31.8", displayValue: "31.8 PPG" },
        { rank: 2, playerName: "Kevin Durant", teamName: "Phoenix Suns", teamId: "mock-nba-8", value: "29.4", displayValue: "29.4 PPG" },
        { rank: 3, playerName: "LeBron James", teamName: "Los Angeles Lakers", teamId: "mock-nba-1", value: "28.2", displayValue: "28.2 PPG" },
        { rank: 4, playerName: "Jayson Tatum", teamName: "Boston Celtics", teamId: "mock-nba-2", value: "27.5", displayValue: "27.5 PPG" },
        { rank: 5, playerName: "Joel Embiid", teamName: "Philadelphia 76ers", teamId: "mock-nba-6", value: "27.1", displayValue: "27.1 PPG" },
        { rank: 6, playerName: "Stephen Curry", teamName: "Golden State Warriors", teamId: "mock-nba-3", value: "26.8", displayValue: "26.8 PPG" },
        { rank: 7, playerName: "Devin Booker", teamName: "Phoenix Suns", teamId: "mock-nba-8", value: "26.3", displayValue: "26.3 PPG" },
        { rank: 8, playerName: "Damian Lillard", teamName: "Milwaukee Bucks", teamId: "mock-nba-4", value: "25.7", displayValue: "25.7 PPG" },
        { rank: 9, playerName: "Nikola Jokić", teamName: "Denver Nuggets", teamId: "mock-nba-5", value: "25.2", displayValue: "25.2 PPG" },
        { rank: 10, playerName: "Jimmy Butler", teamName: "Miami Heat", teamId: "mock-nba-7", value: "24.1", displayValue: "24.1 PPG" },
      ],
    },
    {
      name: "Rebounds Per Game",
      abbreviation: "RPG",
      entries: [
        { rank: 1, playerName: "Anthony Davis", teamName: "Los Angeles Lakers", teamId: "mock-nba-1", value: "12.8", displayValue: "12.8 RPG" },
        { rank: 2, playerName: "Nikola Jokić", teamName: "Denver Nuggets", teamId: "mock-nba-5", value: "12.4", displayValue: "12.4 RPG" },
        { rank: 3, playerName: "Giannis Antetokounmpo", teamName: "Milwaukee Bucks", teamId: "mock-nba-4", value: "11.9", displayValue: "11.9 RPG" },
        { rank: 4, playerName: "Joel Embiid", teamName: "Philadelphia 76ers", teamId: "mock-nba-6", value: "11.2", displayValue: "11.2 RPG" },
        { rank: 5, playerName: "Bam Adebayo", teamName: "Miami Heat", teamId: "mock-nba-7", value: "10.5", displayValue: "10.5 RPG" },
      ],
    },
    {
      name: "Assists Per Game",
      abbreviation: "APG",
      entries: [
        { rank: 1, playerName: "Nikola Jokić", teamName: "Denver Nuggets", teamId: "mock-nba-5", value: "9.8", displayValue: "9.8 APG" },
        { rank: 2, playerName: "LeBron James", teamName: "Los Angeles Lakers", teamId: "mock-nba-1", value: "8.2", displayValue: "8.2 APG" },
        { rank: 3, playerName: "Damian Lillard", teamName: "Milwaukee Bucks", teamId: "mock-nba-4", value: "7.5", displayValue: "7.5 APG" },
        { rank: 4, playerName: "Stephen Curry", teamName: "Golden State Warriors", teamId: "mock-nba-3", value: "6.8", displayValue: "6.8 APG" },
        { rank: 5, playerName: "Jrue Holiday", teamName: "Boston Celtics", teamId: "mock-nba-2", value: "6.2", displayValue: "6.2 APG" },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// NFL Leaders
// ═══════════════════════════════════════════════════════════════

export const nflLeaders: MockSportLeaders = {
  sport: "nfl",
  categories: [
    {
      name: "Passing Yards",
      abbreviation: "PYDS",
      entries: [
        { rank: 1, playerName: "Patrick Mahomes", teamName: "Kansas City Chiefs", teamId: "mock-nfl-1", value: "4520", displayValue: "4,520 YDS" },
        { rank: 2, playerName: "Josh Allen", teamName: "Buffalo Bills", teamId: "mock-nfl-5", value: "4310", displayValue: "4,310 YDS" },
        { rank: 3, playerName: "Tua Tagovailoa", teamName: "Miami Dolphins", teamId: "mock-nfl-8", value: "4105", displayValue: "4,105 YDS" },
        { rank: 4, playerName: "Jared Goff", teamName: "Detroit Lions", teamId: "mock-nfl-7", value: "3980", displayValue: "3,980 YDS" },
        { rank: 5, playerName: "Lamar Jackson", teamName: "Baltimore Ravens", teamId: "mock-nfl-6", value: "3810", displayValue: "3,810 YDS" },
      ],
    },
    {
      name: "Rushing Yards",
      abbreviation: "RYDS",
      entries: [
        { rank: 1, playerName: "Derrick Henry", teamName: "Baltimore Ravens", teamId: "mock-nfl-6", value: "1680", displayValue: "1,680 YDS" },
        { rank: 2, playerName: "Saquon Barkley", teamName: "Philadelphia Eagles", teamId: "mock-nfl-3", value: "1520", displayValue: "1,520 YDS" },
        { rank: 3, playerName: "Christian McCaffrey", teamName: "San Francisco 49ers", teamId: "mock-nfl-2", value: "1210", displayValue: "1,210 YDS" },
        { rank: 4, playerName: "Jahmyr Gibbs", teamName: "Detroit Lions", teamId: "mock-nfl-7", value: "1105", displayValue: "1,105 YDS" },
        { rank: 5, playerName: "Isiah Pacheco", teamName: "Kansas City Chiefs", teamId: "mock-nfl-1", value: "1030", displayValue: "1,030 YDS" },
      ],
    },
    {
      name: "Receiving Yards",
      abbreviation: "RECYDS",
      entries: [
        { rank: 1, playerName: "Tyreek Hill", teamName: "Miami Dolphins", teamId: "mock-nfl-8", value: "1480", displayValue: "1,480 YDS" },
        { rank: 2, playerName: "CeeDee Lamb", teamName: "Dallas Cowboys", teamId: "mock-nfl-4", value: "1410", displayValue: "1,410 YDS" },
        { rank: 3, playerName: "Amon-Ra St. Brown", teamName: "Detroit Lions", teamId: "mock-nfl-7", value: "1320", displayValue: "1,320 YDS" },
        { rank: 4, playerName: "A.J. Brown", teamName: "Philadelphia Eagles", teamId: "mock-nfl-3", value: "1260", displayValue: "1,260 YDS" },
        { rank: 5, playerName: "Stefon Diggs", teamName: "Buffalo Bills", teamId: "mock-nfl-5", value: "1190", displayValue: "1,190 YDS" },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// NHL Leaders
// ═══════════════════════════════════════════════════════════════

export const nhlLeaders: MockSportLeaders = {
  sport: "nhl",
  categories: [
    {
      name: "Points",
      abbreviation: "PTS",
      entries: [
        { rank: 1, playerName: "Connor McDavid", teamName: "Edmonton Oilers", teamId: "mock-nhl-1", value: "92", displayValue: "92 PTS" },
        { rank: 2, playerName: "Nathan MacKinnon", teamName: "Colorado Avalanche", teamId: "mock-nhl-4", value: "86", displayValue: "86 PTS" },
        { rank: 3, playerName: "Leon Draisaitl", teamName: "Edmonton Oilers", teamId: "mock-nhl-1", value: "82", displayValue: "82 PTS" },
        { rank: 4, playerName: "Artemi Panarin", teamName: "New York Rangers", teamId: "mock-nhl-5", value: "78", displayValue: "78 PTS" },
        { rank: 5, playerName: "David Pastrňák", teamName: "Boston Bruins", teamId: "mock-nhl-7", value: "75", displayValue: "75 PTS" },
      ],
    },
    {
      name: "Goals",
      abbreviation: "G",
      entries: [
        { rank: 1, playerName: "Leon Draisaitl", teamName: "Edmonton Oilers", teamId: "mock-nhl-1", value: "38", displayValue: "38 G" },
        { rank: 2, playerName: "Sam Reinhart", teamName: "Florida Panthers", teamId: "mock-nhl-2", value: "36", displayValue: "36 G" },
        { rank: 3, playerName: "Nathan MacKinnon", teamName: "Colorado Avalanche", teamId: "mock-nhl-4", value: "34", displayValue: "34 G" },
        { rank: 4, playerName: "Zach Hyman", teamName: "Edmonton Oilers", teamId: "mock-nhl-1", value: "33", displayValue: "33 G" },
        { rank: 5, playerName: "Jason Robertson", teamName: "Dallas Stars", teamId: "mock-nhl-3", value: "31", displayValue: "31 G" },
      ],
    },
    {
      name: "Assists",
      abbreviation: "A",
      entries: [
        { rank: 1, playerName: "Connor McDavid", teamName: "Edmonton Oilers", teamId: "mock-nhl-1", value: "62", displayValue: "62 A" },
        { rank: 2, playerName: "Nathan MacKinnon", teamName: "Colorado Avalanche", teamId: "mock-nhl-4", value: "52", displayValue: "52 A" },
        { rank: 3, playerName: "Adam Fox", teamName: "New York Rangers", teamId: "mock-nhl-5", value: "48", displayValue: "48 A" },
        { rank: 4, playerName: "Artemi Panarin", teamName: "New York Rangers", teamId: "mock-nhl-5", value: "46", displayValue: "46 A" },
        { rank: 5, playerName: "Nikita Kucherov", teamName: "Tampa Bay Lightning", teamId: "mock-nhl-8", value: "44", displayValue: "44 A" },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// MLB Leaders
// ═══════════════════════════════════════════════════════════════

export const mlbLeaders: MockSportLeaders = {
  sport: "mlb",
  categories: [
    {
      name: "Batting Average",
      abbreviation: "AVG",
      entries: [
        { rank: 1, playerName: "Shohei Ohtani", teamName: "Los Angeles Dodgers", teamId: "mock-mlb-1", value: ".315", displayValue: ".315" },
        { rank: 2, playerName: "Freddie Freeman", teamName: "Los Angeles Dodgers", teamId: "mock-mlb-1", value: ".308", displayValue: ".308" },
        { rank: 3, playerName: "Corey Seager", teamName: "Texas Rangers", teamId: "mock-mlb-6", value: ".302", displayValue: ".302" },
        { rank: 4, playerName: "Mookie Betts", teamName: "Los Angeles Dodgers", teamId: "mock-mlb-1", value: ".298", displayValue: ".298" },
        { rank: 5, playerName: "José Altuve", teamName: "Houston Astros", teamId: "mock-mlb-3", value: ".295", displayValue: ".295" },
      ],
    },
    {
      name: "Home Runs",
      abbreviation: "HR",
      entries: [
        { rank: 1, playerName: "Aaron Judge", teamName: "New York Yankees", teamId: "mock-mlb-4", value: "35", displayValue: "35 HR" },
        { rank: 2, playerName: "Shohei Ohtani", teamName: "Los Angeles Dodgers", teamId: "mock-mlb-1", value: "32", displayValue: "32 HR" },
        { rank: 3, playerName: "Matt Olson", teamName: "Atlanta Braves", teamId: "mock-mlb-2", value: "30", displayValue: "30 HR" },
        { rank: 4, playerName: "Kyle Schwarber", teamName: "Philadelphia Phillies", teamId: "mock-mlb-5", value: "28", displayValue: "28 HR" },
        { rank: 5, playerName: "Yordan Alvarez", teamName: "Houston Astros", teamId: "mock-mlb-3", value: "27", displayValue: "27 HR" },
      ],
    },
    {
      name: "ERA",
      abbreviation: "ERA",
      entries: [
        { rank: 1, playerName: "Zack Wheeler", teamName: "Philadelphia Phillies", teamId: "mock-mlb-5", value: "2.45", displayValue: "2.45 ERA" },
        { rank: 2, playerName: "Corbin Burnes", teamName: "Baltimore Orioles", teamId: "mock-mlb-7", value: "2.68", displayValue: "2.68 ERA" },
        { rank: 3, playerName: "Framber Valdez", teamName: "Houston Astros", teamId: "mock-mlb-3", value: "2.82", displayValue: "2.82 ERA" },
        { rank: 4, playerName: "Gerrit Cole", teamName: "New York Yankees", teamId: "mock-mlb-4", value: "2.95", displayValue: "2.95 ERA" },
        { rank: 5, playerName: "Yoshinobu Yamamoto", teamName: "Los Angeles Dodgers", teamId: "mock-mlb-1", value: "3.05", displayValue: "3.05 ERA" },
      ],
    },
  ],
};

export function getLeadersForSport(sport: Sport): MockSportLeaders | null {
  switch (sport) {
    case "soccer": return null; // Soccer uses /scorers endpoint instead
    case "nba": return nbaLeaders;
    case "nfl": return nflLeaders;
    case "nhl": return nhlLeaders;
    case "mlb": return mlbLeaders;
  }
}

export { eplScorers as mockSoccerScorers };
