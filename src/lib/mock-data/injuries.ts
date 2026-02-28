import type { Sport } from "../types";

export interface MockInjuryReport {
  id: string;
  playerName: string;
  teamName: string;
  teamId: string;
  position: string;
  status: "Out" | "Day-to-Day" | "Questionable" | "Doubtful" | "Probable";
  injury: string;
  returnDate?: string;
  sport: Sport;
}

// Soccer doesn't have injuries endpoint (football-data.org free tier limitation)
// But we include some for mock completeness

export const nbaInjuries: MockInjuryReport[] = [
  { id: "mock-inj-nba-1", playerName: "Kristaps Porziņģis", teamName: "Boston Celtics", teamId: "mock-nba-2", position: "Center", status: "Day-to-Day", injury: "Left knee soreness", sport: "nba" },
  { id: "mock-inj-nba-2", playerName: "Khris Middleton", teamName: "Milwaukee Bucks", teamId: "mock-nba-4", position: "Forward", status: "Out", injury: "Left ankle surgery", returnDate: "Mar 15", sport: "nba" },
  { id: "mock-inj-nba-3", playerName: "Joel Embiid", teamName: "Philadelphia 76ers", teamId: "mock-nba-6", position: "Center", status: "Day-to-Day", injury: "Left knee management", sport: "nba" },
  { id: "mock-inj-nba-4", playerName: "Chris Paul", teamName: "Golden State Warriors", teamId: "mock-nba-3", position: "Guard", status: "Questionable", injury: "Right hamstring tightness", sport: "nba" },
  { id: "mock-inj-nba-5", playerName: "Jarred Vanderbilt", teamName: "Los Angeles Lakers", teamId: "mock-nba-1", position: "Forward", status: "Out", injury: "Right foot surgery", returnDate: "TBD", sport: "nba" },
  { id: "mock-inj-nba-6", playerName: "Bradley Beal", teamName: "Phoenix Suns", teamId: "mock-nba-8", position: "Guard", status: "Questionable", injury: "Left hamstring strain", sport: "nba" },
];

export const nflInjuries: MockInjuryReport[] = [
  { id: "mock-inj-nfl-1", playerName: "Christian McCaffrey", teamName: "San Francisco 49ers", teamId: "mock-nfl-2", position: "Running Back", status: "Questionable", injury: "Calf strain", sport: "nfl" },
  { id: "mock-inj-nfl-2", playerName: "Trevon Diggs", teamName: "Dallas Cowboys", teamId: "mock-nfl-4", position: "Cornerback", status: "Out", injury: "ACL recovery", returnDate: "Season", sport: "nfl" },
  { id: "mock-inj-nfl-3", playerName: "Von Miller", teamName: "Buffalo Bills", teamId: "mock-nfl-5", position: "Linebacker", status: "Doubtful", injury: "Knee sprain", sport: "nfl" },
  { id: "mock-inj-nfl-4", playerName: "Jaelan Phillips", teamName: "Miami Dolphins", teamId: "mock-nfl-8", position: "Linebacker", status: "Out", injury: "Achilles surgery", returnDate: "Season", sport: "nfl" },
  { id: "mock-inj-nfl-5", playerName: "Trent Williams", teamName: "San Francisco 49ers", teamId: "mock-nfl-2", position: "Offensive Line", status: "Probable", injury: "Ankle", sport: "nfl" },
  { id: "mock-inj-nfl-6", playerName: "Dak Prescott", teamName: "Dallas Cowboys", teamId: "mock-nfl-4", position: "Quarterback", status: "Questionable", injury: "Shoulder inflammation", sport: "nfl" },
];

export const nhlInjuries: MockInjuryReport[] = [
  { id: "mock-inj-nhl-1", playerName: "Gabriel Landeskog", teamName: "Colorado Avalanche", teamId: "mock-nhl-4", position: "Left Wing", status: "Out", injury: "Knee surgery", returnDate: "TBD", sport: "nhl" },
  { id: "mock-inj-nhl-2", playerName: "Jack Campbell", teamName: "Edmonton Oilers", teamId: "mock-nhl-1", position: "Goalie", status: "Day-to-Day", injury: "Lower body", sport: "nhl" },
  { id: "mock-inj-nhl-3", playerName: "Spencer Knight", teamName: "Florida Panthers", teamId: "mock-nhl-2", position: "Goalie", status: "Out", injury: "Personal leave", returnDate: "TBD", sport: "nhl" },
  { id: "mock-inj-nhl-4", playerName: "Frederik Andersen", teamName: "Carolina Hurricanes", teamId: "mock-nhl-6", position: "Goalie", status: "Day-to-Day", injury: "Lower body", sport: "nhl" },
  { id: "mock-inj-nhl-5", playerName: "Jacob Trouba", teamName: "New York Rangers", teamId: "mock-nhl-5", position: "Defenseman", status: "Questionable", injury: "Upper body", sport: "nhl" },
];

export const mlbInjuries: MockInjuryReport[] = [
  { id: "mock-inj-mlb-1", playerName: "Ronald Acuña Jr.", teamName: "Atlanta Braves", teamId: "mock-mlb-2", position: "Right Fielder", status: "Out", injury: "ACL tear", returnDate: "TBD", sport: "mlb" },
  { id: "mock-inj-mlb-2", playerName: "Spencer Strider", teamName: "Atlanta Braves", teamId: "mock-mlb-2", position: "Pitcher", status: "Out", injury: "UCL surgery", returnDate: "Mid-season", sport: "mlb" },
  { id: "mock-inj-mlb-3", playerName: "Clayton Kershaw", teamName: "Los Angeles Dodgers", teamId: "mock-mlb-1", position: "Pitcher", status: "Day-to-Day", injury: "Shoulder inflammation", sport: "mlb" },
  { id: "mock-inj-mlb-4", playerName: "Carlos Rodón", teamName: "New York Yankees", teamId: "mock-mlb-4", position: "Pitcher", status: "Questionable", injury: "Hamstring tightness", sport: "mlb" },
  { id: "mock-inj-mlb-5", playerName: "Shane McClanahan", teamName: "Tampa Bay Rays", teamId: "mock-mlb-8", position: "Pitcher", status: "Out", injury: "Tommy John recovery", returnDate: "TBD", sport: "mlb" },
  { id: "mock-inj-mlb-6", playerName: "Kyle Bradish", teamName: "Baltimore Orioles", teamId: "mock-mlb-7", position: "Pitcher", status: "Out", injury: "UCL sprain", returnDate: "Apr", sport: "mlb" },
];

export function getInjuriesForSport(sport: Sport): MockInjuryReport[] {
  switch (sport) {
    case "soccer": return []; // No injury endpoint for soccer in real app
    case "nba": return nbaInjuries;
    case "nfl": return nflInjuries;
    case "nhl": return nhlInjuries;
    case "mlb": return mlbInjuries;
  }
}

export const allMockInjuries: MockInjuryReport[] = [
  ...nbaInjuries,
  ...nflInjuries,
  ...nhlInjuries,
  ...mlbInjuries,
];
