export {
  soccerTeams,
  nbaTeams,
  nflTeams,
  nhlTeams,
  mlbTeams,
  allMockTeams,
  teamById,
  getTeamsForSport,
  type MockTeamData,
  type MockSquadPlayer,
} from "./teams";

export {
  soccerMatches,
  nbaMatches,
  nflMatches,
  nhlMatches,
  mlbMatches,
  allMockMatches,
  getMatchesForSport as getMatchesForSportRaw,
  getMatchById,
} from "./matches";

export {
  eplStandings,
  nbaStandings,
  nflStandings,
  nhlStandings,
  mlbStandings,
  getStandingsForLeague,
  type StandingsResult,
} from "./standings";

export {
  allPlayerProfiles,
  playerById,
  getPlayersForTeam,
  getPlayerProfile,
  type PlayerProfile,
  type PlayerStat,
} from "./players";

export {
  soccerNews,
  nbaNews,
  nflNews,
  nhlNews,
  mlbNews,
  allMockNews,
  getNewsForSport,
  type MockNewsArticle,
} from "./news";

export {
  nbaInjuries,
  nflInjuries,
  nhlInjuries,
  mlbInjuries,
  allMockInjuries,
  getInjuriesForSport,
  type MockInjuryReport,
} from "./injuries";

export {
  nbaLeaders,
  nflLeaders,
  nhlLeaders,
  mlbLeaders,
  getLeadersForSport,
  mockSoccerScorers,
  type MockLeaderEntry,
  type MockLeaderCategory,
  type MockSportLeaders,
  type MockSoccerScorer,
} from "./leaders";
