export const config = {
  footballData: {
    apiKey: process.env.FOOTBALL_DATA_API_KEY ?? "",
    baseUrl: "https://api.football-data.org/v4",
  },
  cache: {
    matchesTTL: 30_000, // 30s for live scores
    standingsTTL: 300_000, // 5min for standings
    competitionsTTL: 3_600_000, // 1hr for competition list
    teamTTL: 600_000, // 10min for team data
  },
  polling: {
    intervalMs: 30_000, // 30s live polling
  },
} as const;
