import Foundation

enum MockDataService {

    // MARK: - Soccer Teams

    static let manCity = Team(id: "mci", name: "Manchester City", shortName: "MCI",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/50.png"), sport: .soccer, primaryColor: "6CABDD")
    static let arsenal = Team(id: "ars", name: "Arsenal", shortName: "ARS",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/42.png"), sport: .soccer, primaryColor: "EF0107")
    static let liverpool = Team(id: "liv", name: "Liverpool", shortName: "LIV",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/40.png"), sport: .soccer, primaryColor: "C8102E")
    static let chelsea = Team(id: "che", name: "Chelsea", shortName: "CHE",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/49.png"), sport: .soccer, primaryColor: "034694")
    static let manUtd = Team(id: "mun", name: "Manchester United", shortName: "MUN",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/33.png"), sport: .soccer, primaryColor: "DA291C")
    static let tottenham = Team(id: "tot", name: "Tottenham", shortName: "TOT",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/47.png"), sport: .soccer, primaryColor: "132257")
    static let newcastle = Team(id: "new", name: "Newcastle United", shortName: "NEW",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/34.png"), sport: .soccer, primaryColor: "241F20")
    static let astonVilla = Team(id: "avl", name: "Aston Villa", shortName: "AVL",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/66.png"), sport: .soccer, primaryColor: "670E36")
    static let brighton = Team(id: "bha", name: "Brighton", shortName: "BHA",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/51.png"), sport: .soccer, primaryColor: "0057B8")
    static let westHam = Team(id: "whu", name: "West Ham", shortName: "WHU",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/48.png"), sport: .soccer, primaryColor: "7A263A")
    static let bournemouth = Team(id: "bou", name: "Bournemouth", shortName: "BOU",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/35.png"), sport: .soccer, primaryColor: "DA291C")
    static let fulham = Team(id: "ful", name: "Fulham", shortName: "FUL",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/36.png"), sport: .soccer, primaryColor: "000000")
    static let wolves = Team(id: "wol", name: "Wolves", shortName: "WOL",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/39.png"), sport: .soccer, primaryColor: "FDB913")
    static let crystalPalace = Team(id: "cry", name: "Crystal Palace", shortName: "CRY",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/52.png"), sport: .soccer, primaryColor: "1B458F")
    static let brentford = Team(id: "bre", name: "Brentford", shortName: "BRE",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/55.png"), sport: .soccer, primaryColor: "E30613")
    static let everton = Team(id: "eve", name: "Everton", shortName: "EVE",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/45.png"), sport: .soccer, primaryColor: "003399")
    static let nottmForest = Team(id: "nfo", name: "Nott'm Forest", shortName: "NFO",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/65.png"), sport: .soccer, primaryColor: "DD0000")
    static let ipswich = Team(id: "ips", name: "Ipswich Town", shortName: "IPS",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/57.png"), sport: .soccer, primaryColor: "0044AA")
    static let leicester = Team(id: "lei", name: "Leicester City", shortName: "LEI",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/46.png"), sport: .soccer, primaryColor: "003090")
    static let southampton = Team(id: "sou", name: "Southampton", shortName: "SOU",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/41.png"), sport: .soccer, primaryColor: "D71920")

    // La Liga
    static let realMadrid = Team(id: "rma", name: "Real Madrid", shortName: "RMA",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/541.png"), sport: .soccer, primaryColor: "FEBE10")
    static let barcelona = Team(id: "bar", name: "Barcelona", shortName: "BAR",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/529.png"), sport: .soccer, primaryColor: "A50044")
    static let atletico = Team(id: "atm", name: "Atletico Madrid", shortName: "ATM",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/530.png"), sport: .soccer, primaryColor: "CB3524")

    // Serie A
    static let interMilan = Team(id: "int", name: "Inter Milan", shortName: "INT",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/505.png"), sport: .soccer, primaryColor: "0068A8")
    static let acMilan = Team(id: "acm", name: "AC Milan", shortName: "ACM",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/489.png"), sport: .soccer, primaryColor: "FB090B")
    static let juventus = Team(id: "juv", name: "Juventus", shortName: "JUV",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/496.png"), sport: .soccer, primaryColor: "000000")
    static let napoli = Team(id: "nap", name: "Napoli", shortName: "NAP",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/492.png"), sport: .soccer, primaryColor: "12A0D7")

    // Champions League
    static let bayernMunich = Team(id: "bay", name: "Bayern Munich", shortName: "BAY",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/157.png"), sport: .soccer, primaryColor: "DC052D")
    static let psg = Team(id: "psg", name: "Paris Saint-Germain", shortName: "PSG",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/85.png"), sport: .soccer, primaryColor: "004170")

    // MARK: - NBA Teams

    static let celtics = Team(id: "bos-nba", name: "Boston Celtics", shortName: "BOS",
        logoURL: URL(string: "https://cdn.nba.com/logos/nba/1610612738/global/L/logo.svg"), sport: .nba, primaryColor: "007A33")
    static let lakers = Team(id: "lal-nba", name: "LA Lakers", shortName: "LAL",
        logoURL: URL(string: "https://cdn.nba.com/logos/nba/1610612747/global/L/logo.svg"), sport: .nba, primaryColor: "552583")
    static let warriors = Team(id: "gsw-nba", name: "Golden State Warriors", shortName: "GSW",
        logoURL: URL(string: "https://cdn.nba.com/logos/nba/1610612744/global/L/logo.svg"), sport: .nba, primaryColor: "1D428A")
    static let bucks = Team(id: "mil-nba", name: "Milwaukee Bucks", shortName: "MIL",
        logoURL: URL(string: "https://cdn.nba.com/logos/nba/1610612749/global/L/logo.svg"), sport: .nba, primaryColor: "00471B")
    static let nuggets = Team(id: "den-nba", name: "Denver Nuggets", shortName: "DEN",
        logoURL: URL(string: "https://cdn.nba.com/logos/nba/1610612743/global/L/logo.svg"), sport: .nba, primaryColor: "0E2240")
    static let heat = Team(id: "mia-nba", name: "Miami Heat", shortName: "MIA",
        logoURL: URL(string: "https://cdn.nba.com/logos/nba/1610612748/global/L/logo.svg"), sport: .nba, primaryColor: "98002E")
    static let sixers = Team(id: "phi-nba", name: "Philadelphia 76ers", shortName: "PHI",
        logoURL: URL(string: "https://cdn.nba.com/logos/nba/1610612755/global/L/logo.svg"), sport: .nba, primaryColor: "006BB6")
    static let knicks = Team(id: "nyk-nba", name: "New York Knicks", shortName: "NYK",
        logoURL: URL(string: "https://cdn.nba.com/logos/nba/1610612752/global/L/logo.svg"), sport: .nba, primaryColor: "F58426")
    static let suns = Team(id: "phx-nba", name: "Phoenix Suns", shortName: "PHX",
        logoURL: URL(string: "https://cdn.nba.com/logos/nba/1610612756/global/L/logo.svg"), sport: .nba, primaryColor: "1D1160")
    static let thunder = Team(id: "okc-nba", name: "Oklahoma City Thunder", shortName: "OKC",
        logoURL: URL(string: "https://cdn.nba.com/logos/nba/1610612760/global/L/logo.svg"), sport: .nba, primaryColor: "007AC1")
    static let cavs = Team(id: "cle-nba", name: "Cleveland Cavaliers", shortName: "CLE",
        logoURL: URL(string: "https://cdn.nba.com/logos/nba/1610612739/global/L/logo.svg"), sport: .nba, primaryColor: "860038")
    static let mavs = Team(id: "dal-nba", name: "Dallas Mavericks", shortName: "DAL",
        logoURL: URL(string: "https://cdn.nba.com/logos/nba/1610612742/global/L/logo.svg"), sport: .nba, primaryColor: "00538C")
    static let pacers = Team(id: "ind-nba", name: "Indiana Pacers", shortName: "IND",
        logoURL: URL(string: "https://cdn.nba.com/logos/nba/1610612754/global/L/logo.svg"), sport: .nba, primaryColor: "002D62")
    static let magic = Team(id: "orl-nba", name: "Orlando Magic", shortName: "ORL",
        logoURL: URL(string: "https://cdn.nba.com/logos/nba/1610612753/global/L/logo.svg"), sport: .nba, primaryColor: "0077C0")
    static let timberwolves = Team(id: "min-nba", name: "Minnesota Timberwolves", shortName: "MIN",
        logoURL: URL(string: "https://cdn.nba.com/logos/nba/1610612750/global/L/logo.svg"), sport: .nba, primaryColor: "0C2340")
    static let clippers = Team(id: "lac-nba", name: "LA Clippers", shortName: "LAC",
        logoURL: URL(string: "https://cdn.nba.com/logos/nba/1610612746/global/L/logo.svg"), sport: .nba, primaryColor: "C8102E")

    // MARK: - NFL Teams

    static let chiefs = Team(id: "kc-nfl", name: "Kansas City Chiefs", shortName: "KC",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/nfl/500/kc.png"), sport: .nfl, primaryColor: "E31837")
    static let eagles = Team(id: "phi-nfl", name: "Philadelphia Eagles", shortName: "PHI",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/nfl/500/phi.png"), sport: .nfl, primaryColor: "004C54")
    static let niners = Team(id: "sf-nfl", name: "San Francisco 49ers", shortName: "SF",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png"), sport: .nfl, primaryColor: "AA0000")
    static let cowboys = Team(id: "dal-nfl", name: "Dallas Cowboys", shortName: "DAL",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/nfl/500/dal.png"), sport: .nfl, primaryColor: "003594")
    static let ravens = Team(id: "bal-nfl", name: "Baltimore Ravens", shortName: "BAL",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png"), sport: .nfl, primaryColor: "241773")
    static let bills = Team(id: "buf-nfl", name: "Buffalo Bills", shortName: "BUF",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png"), sport: .nfl, primaryColor: "00338D")
    static let lions = Team(id: "det-nfl", name: "Detroit Lions", shortName: "DET",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/nfl/500/det.png"), sport: .nfl, primaryColor: "0076B6")
    static let packers = Team(id: "gb-nfl", name: "Green Bay Packers", shortName: "GB",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/nfl/500/gb.png"), sport: .nfl, primaryColor: "203731")
    static let dolphins = Team(id: "mia-nfl", name: "Miami Dolphins", shortName: "MIA",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/nfl/500/mia.png"), sport: .nfl, primaryColor: "008E97")
    static let texans = Team(id: "hou-nfl", name: "Houston Texans", shortName: "HOU",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/nfl/500/hou.png"), sport: .nfl, primaryColor: "03202F")
    static let steelers = Team(id: "pit-nfl", name: "Pittsburgh Steelers", shortName: "PIT",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/nfl/500/pit.png"), sport: .nfl, primaryColor: "FFB612")
    static let bengals = Team(id: "cin-nfl", name: "Cincinnati Bengals", shortName: "CIN",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png"), sport: .nfl, primaryColor: "FB4F14")

    // MARK: - NHL Teams

    static let bruins = Team(id: "bos-nhl", name: "Boston Bruins", shortName: "BOS",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/nhl/500/bos.png"), sport: .nhl, primaryColor: "FFB81C")
    static let mapleLeafs = Team(id: "tor-nhl", name: "Toronto Maple Leafs", shortName: "TOR",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/nhl/500/tor.png"), sport: .nhl, primaryColor: "00205B")
    static let rangers = Team(id: "nyr-nhl", name: "New York Rangers", shortName: "NYR",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/nhl/500/nyr.png"), sport: .nhl, primaryColor: "0038A8")
    static let oilers = Team(id: "edm-nhl", name: "Edmonton Oilers", shortName: "EDM",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/nhl/500/edm.png"), sport: .nhl, primaryColor: "041E42")
    static let panthers = Team(id: "fla-nhl", name: "Florida Panthers", shortName: "FLA",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/nhl/500/fla.png"), sport: .nhl, primaryColor: "041E42")
    static let avalanche = Team(id: "col-nhl", name: "Colorado Avalanche", shortName: "COL",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/nhl/500/col.png"), sport: .nhl, primaryColor: "6F263D")
    static let hurricanes = Team(id: "car-nhl", name: "Carolina Hurricanes", shortName: "CAR",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/nhl/500/car.png"), sport: .nhl, primaryColor: "CC0000")
    static let stars = Team(id: "dal-nhl", name: "Dallas Stars", shortName: "DAL",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/nhl/500/dal.png"), sport: .nhl, primaryColor: "006847")
    static let jets = Team(id: "wpg-nhl", name: "Winnipeg Jets", shortName: "WPG",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/nhl/500/wpg.png"), sport: .nhl, primaryColor: "041E42")
    static let canucks = Team(id: "van-nhl", name: "Vancouver Canucks", shortName: "VAN",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/nhl/500/van.png"), sport: .nhl, primaryColor: "00205B")
    static let lightning = Team(id: "tbl-nhl", name: "Tampa Bay Lightning", shortName: "TBL",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/nhl/500/tb.png"), sport: .nhl, primaryColor: "002868")
    static let goldenKnights = Team(id: "vgk-nhl", name: "Vegas Golden Knights", shortName: "VGK",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/nhl/500/vgk.png"), sport: .nhl, primaryColor: "B4975A")

    // MARK: - MLB Teams

    static let yankees = Team(id: "nyy-mlb", name: "New York Yankees", shortName: "NYY",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/mlb/500/nyy.png"), sport: .mlb, primaryColor: "003087")
    static let dodgers = Team(id: "lad-mlb", name: "Los Angeles Dodgers", shortName: "LAD",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/mlb/500/lad.png"), sport: .mlb, primaryColor: "005A9C")
    static let astros = Team(id: "hou-mlb", name: "Houston Astros", shortName: "HOU",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/mlb/500/hou.png"), sport: .mlb, primaryColor: "002D62")
    static let braves = Team(id: "atl-mlb", name: "Atlanta Braves", shortName: "ATL",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/mlb/500/atl.png"), sport: .mlb, primaryColor: "CE1141")
    static let phillies = Team(id: "phi-mlb", name: "Philadelphia Phillies", shortName: "PHI",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/mlb/500/phi.png"), sport: .mlb, primaryColor: "E81828")
    static let texasRangers = Team(id: "tex-mlb", name: "Texas Rangers", shortName: "TEX",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/mlb/500/tex.png"), sport: .mlb, primaryColor: "003278")
    static let orioles = Team(id: "bal-mlb", name: "Baltimore Orioles", shortName: "BAL",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/mlb/500/bal.png"), sport: .mlb, primaryColor: "DF4601")
    static let twins = Team(id: "min-mlb", name: "Minnesota Twins", shortName: "MIN",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/mlb/500/min.png"), sport: .mlb, primaryColor: "002B5C")
    static let padres = Team(id: "sd-mlb", name: "San Diego Padres", shortName: "SD",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/mlb/500/sd.png"), sport: .mlb, primaryColor: "2F241D")
    static let cubs = Team(id: "chc-mlb", name: "Chicago Cubs", shortName: "CHC",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/mlb/500/chc.png"), sport: .mlb, primaryColor: "0E3386")
    static let guardians = Team(id: "cle-mlb", name: "Cleveland Guardians", shortName: "CLE",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/mlb/500/cle.png"), sport: .mlb, primaryColor: "00385D")
    static let mets = Team(id: "nym-mlb", name: "New York Mets", shortName: "NYM",
        logoURL: URL(string: "https://a.espncdn.com/i/teamlogos/mlb/500/nym.png"), sport: .mlb, primaryColor: "002D72")

    // MARK: - Soccer Matches (15)

    static let soccerMatches: [Match] = {
        let now = Date()
        return [
            // Premier League — 6 matches
            Match(id: "s1", homeTeam: arsenal, awayTeam: manCity,
                  homeScore: 2, awayScore: 1, status: .live, minute: 67,
                  startTime: now, league: .premierLeague,
                  events: [
                      MatchEvent(type: .goal, minute: 12, playerName: "Saka", teamId: "ars"),
                      MatchEvent(type: .goal, minute: 34, playerName: "Haaland", teamId: "mci"),
                      MatchEvent(type: .goal, minute: 58, playerName: "Rice", teamId: "ars"),
                      MatchEvent(type: .yellowCard, minute: 45, playerName: "Rodri", teamId: "mci"),
                  ],
                  stats: MatchStats(items: [
                      StatPair(name: "Possession", home: 45, away: 55),
                      StatPair(name: "Shots", home: 12, away: 9),
                      StatPair(name: "Shots on Target", home: 5, away: 3),
                      StatPair(name: "Corners", home: 4, away: 7),
                      StatPair(name: "Fouls", home: 11, away: 8),
                  ]),
                  lineups: MatchLineup(
                      homeFormation: "4-3-3", awayFormation: "4-2-3-1",
                      homeStarting: [
                          LineupPlayer(name: "Raya", number: 22, position: "GK"),
                          LineupPlayer(name: "White", number: 4, position: "RB"),
                          LineupPlayer(name: "Saliba", number: 2, position: "CB"),
                          LineupPlayer(name: "Gabriel", number: 6, position: "CB"),
                          LineupPlayer(name: "Timber", number: 12, position: "LB"),
                          LineupPlayer(name: "Odegaard", number: 8, position: "CM"),
                          LineupPlayer(name: "Rice", number: 41, position: "CM"),
                          LineupPlayer(name: "Havertz", number: 29, position: "CM"),
                          LineupPlayer(name: "Saka", number: 7, position: "RW"),
                          LineupPlayer(name: "Jesus", number: 9, position: "ST"),
                          LineupPlayer(name: "Martinelli", number: 11, position: "LW"),
                      ],
                      awayStarting: [
                          LineupPlayer(name: "Ederson", number: 31, position: "GK"),
                          LineupPlayer(name: "Walker", number: 2, position: "RB"),
                          LineupPlayer(name: "Dias", number: 3, position: "CB"),
                          LineupPlayer(name: "Akanji", number: 25, position: "CB"),
                          LineupPlayer(name: "Gvardiol", number: 24, position: "LB"),
                          LineupPlayer(name: "Rodri", number: 16, position: "CDM"),
                          LineupPlayer(name: "De Bruyne", number: 17, position: "CDM"),
                          LineupPlayer(name: "Bernardo", number: 20, position: "RAM"),
                          LineupPlayer(name: "Foden", number: 47, position: "CAM"),
                          LineupPlayer(name: "Grealish", number: 10, position: "LAM"),
                          LineupPlayer(name: "Haaland", number: 9, position: "ST"),
                      ],
                      homeSubs: [
                          LineupPlayer(name: "Jorginho", number: 20, position: "CM"),
                          LineupPlayer(name: "Trossard", number: 19, position: "FW"),
                      ],
                      awaySubs: [
                          LineupPlayer(name: "Alvarez", number: 19, position: "FW"),
                          LineupPlayer(name: "Doku", number: 11, position: "FW"),
                      ]
                  )
            ),
            Match(id: "s2", homeTeam: liverpool, awayTeam: chelsea,
                  homeScore: 3, awayScore: 1, status: .finished, minute: nil,
                  startTime: now.addingTimeInterval(-7200), league: .premierLeague,
                  events: [
                      MatchEvent(type: .goal, minute: 15, playerName: "Salah", teamId: "liv"),
                      MatchEvent(type: .goal, minute: 32, playerName: "Palmer", teamId: "che"),
                      MatchEvent(type: .goal, minute: 55, playerName: "Diaz", teamId: "liv"),
                      MatchEvent(type: .goal, minute: 78, playerName: "Szoboszlai", teamId: "liv"),
                  ]),
            Match(id: "s3", homeTeam: tottenham, awayTeam: newcastle,
                  homeScore: nil, awayScore: nil, status: .upcoming, minute: nil,
                  startTime: now.addingTimeInterval(3600), league: .premierLeague),
            Match(id: "s4", homeTeam: astonVilla, awayTeam: brighton,
                  homeScore: 1, awayScore: 1, status: .live, minute: 34,
                  startTime: now, league: .premierLeague,
                  events: [
                      MatchEvent(type: .goal, minute: 11, playerName: "Watkins", teamId: "avl"),
                      MatchEvent(type: .goal, minute: 28, playerName: "Mitoma", teamId: "bha"),
                  ]),
            Match(id: "s5", homeTeam: westHam, awayTeam: bournemouth,
                  homeScore: 0, awayScore: 2, status: .finished, minute: nil,
                  startTime: now.addingTimeInterval(-5400), league: .premierLeague),
            Match(id: "s6", homeTeam: wolves, awayTeam: manUtd,
                  homeScore: nil, awayScore: nil, status: .upcoming, minute: nil,
                  startTime: now.addingTimeInterval(7200), league: .premierLeague),

            // La Liga — 3 matches
            Match(id: "s7", homeTeam: realMadrid, awayTeam: barcelona,
                  homeScore: 2, awayScore: 2, status: .live, minute: 82,
                  startTime: now, league: .laLiga,
                  events: [
                      MatchEvent(type: .goal, minute: 22, playerName: "Vinicius Jr", teamId: "rma"),
                      MatchEvent(type: .goal, minute: 38, playerName: "Lewandowski", teamId: "bar"),
                      MatchEvent(type: .goal, minute: 61, playerName: "Bellingham", teamId: "rma"),
                      MatchEvent(type: .goal, minute: 73, playerName: "Yamal", teamId: "bar"),
                      MatchEvent(type: .yellowCard, minute: 55, playerName: "Araujo", teamId: "bar"),
                      MatchEvent(type: .redCard, minute: 88, playerName: "Tchouameni", teamId: "rma"),
                  ]),
            Match(id: "s8", homeTeam: atletico, awayTeam: realMadrid,
                  homeScore: nil, awayScore: nil, status: .upcoming, minute: nil,
                  startTime: now.addingTimeInterval(86400), league: .laLiga),
            Match(id: "s9", homeTeam: barcelona, awayTeam: atletico,
                  homeScore: 1, awayScore: 0, status: .finished, minute: nil,
                  startTime: now.addingTimeInterval(-10800), league: .laLiga),

            // Champions League — 3 matches
            Match(id: "s10", homeTeam: bayernMunich, awayTeam: arsenal,
                  homeScore: 1, awayScore: 0, status: .halfTime, minute: 45,
                  startTime: now, league: .championsLeague,
                  events: [
                      MatchEvent(type: .goal, minute: 39, playerName: "Musiala", teamId: "bay"),
                  ]),
            Match(id: "s11", homeTeam: psg, awayTeam: manCity,
                  homeScore: nil, awayScore: nil, status: .upcoming, minute: nil,
                  startTime: now.addingTimeInterval(14400), league: .championsLeague),
            Match(id: "s12", homeTeam: liverpool, awayTeam: realMadrid,
                  homeScore: 2, awayScore: 0, status: .finished, minute: nil,
                  startTime: now.addingTimeInterval(-86400), league: .championsLeague),

            // Serie A — 3 matches
            Match(id: "s13", homeTeam: interMilan, awayTeam: acMilan,
                  homeScore: 1, awayScore: 2, status: .live, minute: 55,
                  startTime: now, league: .serieA,
                  events: [
                      MatchEvent(type: .goal, minute: 18, playerName: "Lautaro", teamId: "int"),
                      MatchEvent(type: .goal, minute: 33, playerName: "Leao", teamId: "acm"),
                      MatchEvent(type: .goal, minute: 50, playerName: "Pulisic", teamId: "acm"),
                  ]),
            Match(id: "s14", homeTeam: juventus, awayTeam: napoli,
                  homeScore: nil, awayScore: nil, status: .upcoming, minute: nil,
                  startTime: now.addingTimeInterval(5400), league: .serieA),
            Match(id: "s15", homeTeam: napoli, awayTeam: interMilan,
                  homeScore: 0, awayScore: 0, status: .finished, minute: nil,
                  startTime: now.addingTimeInterval(-14400), league: .serieA),
        ]
    }()

    // MARK: - NBA Matches (8)

    static let nbaMatches: [Match] = {
        let now = Date()
        return [
            Match(id: "n1", homeTeam: celtics, awayTeam: lakers,
                  homeScore: 108, awayScore: 102, status: .live, minute: 4,
                  startTime: now, league: .nba, liveDescription: "Q4 5:42"),
            Match(id: "n2", homeTeam: warriors, awayTeam: bucks,
                  homeScore: 95, awayScore: 91, status: .live, minute: 3,
                  startTime: now, league: .nba, liveDescription: "Q3 2:18"),
            Match(id: "n3", homeTeam: nuggets, awayTeam: heat,
                  homeScore: 112, awayScore: 98, status: .finished, minute: nil,
                  startTime: now.addingTimeInterval(-10800), league: .nba),
            Match(id: "n4", homeTeam: sixers, awayTeam: knicks,
                  homeScore: nil, awayScore: nil, status: .upcoming, minute: nil,
                  startTime: now.addingTimeInterval(3600), league: .nba),
            Match(id: "n5", homeTeam: suns, awayTeam: thunder,
                  homeScore: nil, awayScore: nil, status: .upcoming, minute: nil,
                  startTime: now.addingTimeInterval(7200), league: .nba),
            Match(id: "n6", homeTeam: cavs, awayTeam: mavs,
                  homeScore: 121, awayScore: 119, status: .finished, minute: nil,
                  startTime: now.addingTimeInterval(-7200), league: .nba),
            Match(id: "n7", homeTeam: pacers, awayTeam: magic,
                  homeScore: 88, awayScore: 85, status: .live, minute: 3,
                  startTime: now, league: .nba, liveDescription: "Q3 8:11"),
            Match(id: "n8", homeTeam: timberwolves, awayTeam: clippers,
                  homeScore: nil, awayScore: nil, status: .upcoming, minute: nil,
                  startTime: now.addingTimeInterval(10800), league: .nba),
        ]
    }()

    // MARK: - NFL Matches (6)

    static let nflMatches: [Match] = {
        let now = Date()
        return [
            Match(id: "f1", homeTeam: chiefs, awayTeam: eagles,
                  homeScore: 24, awayScore: 21, status: .live, minute: 4,
                  startTime: now, league: .nfl, liveDescription: "Q4 8:32"),
            Match(id: "f2", homeTeam: niners, awayTeam: cowboys,
                  homeScore: 31, awayScore: 17, status: .finished, minute: nil,
                  startTime: now.addingTimeInterval(-14400), league: .nfl),
            Match(id: "f3", homeTeam: ravens, awayTeam: bills,
                  homeScore: 14, awayScore: 14, status: .halfTime, minute: nil,
                  startTime: now, league: .nfl),
            Match(id: "f4", homeTeam: lions, awayTeam: packers,
                  homeScore: nil, awayScore: nil, status: .upcoming, minute: nil,
                  startTime: now.addingTimeInterval(10800), league: .nfl),
            Match(id: "f5", homeTeam: dolphins, awayTeam: texans,
                  homeScore: 17, awayScore: 10, status: .finished, minute: nil,
                  startTime: now.addingTimeInterval(-7200), league: .nfl),
            Match(id: "f6", homeTeam: steelers, awayTeam: bengals,
                  homeScore: nil, awayScore: nil, status: .upcoming, minute: nil,
                  startTime: now.addingTimeInterval(14400), league: .nfl),
        ]
    }()

    // MARK: - NHL Matches (6)

    static let nhlMatches: [Match] = {
        let now = Date()
        return [
            Match(id: "h1", homeTeam: bruins, awayTeam: mapleLeafs,
                  homeScore: 3, awayScore: 2, status: .live, minute: 3,
                  startTime: now, league: .nhl, liveDescription: "P3 12:44"),
            Match(id: "h2", homeTeam: rangers, awayTeam: oilers,
                  homeScore: 1, awayScore: 1, status: .live, minute: 2,
                  startTime: now, league: .nhl, liveDescription: "P2 8:30"),
            Match(id: "h3", homeTeam: panthers, awayTeam: avalanche,
                  homeScore: 4, awayScore: 2, status: .finished, minute: nil,
                  startTime: now.addingTimeInterval(-10800), league: .nhl),
            Match(id: "h4", homeTeam: hurricanes, awayTeam: stars,
                  homeScore: nil, awayScore: nil, status: .upcoming, minute: nil,
                  startTime: now.addingTimeInterval(3600), league: .nhl),
            Match(id: "h5", homeTeam: jets, awayTeam: canucks,
                  homeScore: 2, awayScore: 3, status: .finished, minute: nil,
                  startTime: now.addingTimeInterval(-7200), league: .nhl),
            Match(id: "h6", homeTeam: lightning, awayTeam: goldenKnights,
                  homeScore: nil, awayScore: nil, status: .upcoming, minute: nil,
                  startTime: now.addingTimeInterval(7200), league: .nhl),
        ]
    }()

    // MARK: - MLB Matches (6)

    static let mlbMatches: [Match] = {
        let now = Date()
        return [
            Match(id: "b1", homeTeam: yankees, awayTeam: dodgers,
                  homeScore: 5, awayScore: 3, status: .live, minute: 7,
                  startTime: now, league: .mlb, liveDescription: "Top 7"),
            Match(id: "b2", homeTeam: astros, awayTeam: braves,
                  homeScore: 2, awayScore: 4, status: .finished, minute: nil,
                  startTime: now.addingTimeInterval(-10800), league: .mlb),
            Match(id: "b3", homeTeam: phillies, awayTeam: texasRangers,
                  homeScore: 1, awayScore: 0, status: .live, minute: 4,
                  startTime: now, league: .mlb, liveDescription: "Bot 4"),
            Match(id: "b4", homeTeam: orioles, awayTeam: twins,
                  homeScore: nil, awayScore: nil, status: .upcoming, minute: nil,
                  startTime: now.addingTimeInterval(3600), league: .mlb),
            Match(id: "b5", homeTeam: padres, awayTeam: cubs,
                  homeScore: 7, awayScore: 6, status: .finished, minute: nil,
                  startTime: now.addingTimeInterval(-7200), league: .mlb),
            Match(id: "b6", homeTeam: guardians, awayTeam: mets,
                  homeScore: nil, awayScore: nil, status: .upcoming, minute: nil,
                  startTime: now.addingTimeInterval(7200), league: .mlb),
        ]
    }()

    // MARK: - All Matches

    static var allMatches: [Match] {
        soccerMatches + nbaMatches + nflMatches + nhlMatches + mlbMatches
    }

    static func matches(for sport: Sport) -> [Match] {
        switch sport {
        case .all: allMatches
        case .soccer: soccerMatches
        case .nba: nbaMatches
        case .nfl: nflMatches
        case .nhl: nhlMatches
        case .mlb: mlbMatches
        }
    }

    // MARK: - League Groups

    static func leagueGroups(for sport: Sport) -> [LeagueGroup] {
        let sportMatches = matches(for: sport)
        let grouped = Dictionary(grouping: sportMatches) { $0.league.id }
        return grouped.map { LeagueGroup(league: $0.value.first!.league, matches: $0.value) }
            .sorted { lhs, rhs in
                let lhsLive = lhs.matches.contains { $0.isLive }
                let rhsLive = rhs.matches.contains { $0.isLive }
                if lhsLive != rhsLive { return lhsLive }
                return lhs.league.name < rhs.league.name
            }
    }

    // MARK: - EPL Standings (20 teams)

    static let eplStandings: [Standing] = {
        let teams: [(Team, Int, Int, Int, Int, Int, Int, [FormResult])] = [
            (liverpool, 25, 19, 4, 2, 58, 18, [.win, .win, .win, .draw, .win]),
            (arsenal, 25, 18, 4, 3, 55, 20, [.win, .win, .draw, .win, .loss]),
            (manCity, 25, 17, 5, 3, 52, 22, [.win, .loss, .win, .win, .draw]),
            (nottmForest, 25, 15, 6, 4, 42, 25, [.draw, .win, .win, .win, .loss]),
            (newcastle, 25, 14, 6, 5, 45, 28, [.win, .draw, .win, .loss, .win]),
            (chelsea, 25, 13, 6, 6, 48, 32, [.win, .loss, .win, .draw, .win]),
            (bournemouth, 25, 13, 5, 7, 40, 30, [.loss, .win, .win, .win, .draw]),
            (astonVilla, 25, 12, 6, 7, 38, 35, [.win, .draw, .loss, .win, .win]),
            (brighton, 25, 11, 7, 7, 38, 33, [.draw, .draw, .win, .loss, .win]),
            (fulham, 25, 10, 8, 7, 35, 30, [.win, .draw, .draw, .loss, .win]),
            (tottenham, 25, 10, 5, 10, 45, 40, [.loss, .win, .loss, .win, .win]),
            (brentford, 25, 9, 7, 9, 38, 38, [.draw, .win, .loss, .draw, .win]),
            (manUtd, 25, 8, 7, 10, 30, 35, [.loss, .loss, .win, .draw, .win]),
            (westHam, 25, 7, 8, 10, 28, 38, [.draw, .loss, .win, .loss, .draw]),
            (crystalPalace, 25, 6, 8, 11, 25, 35, [.loss, .draw, .win, .loss, .loss]),
            (everton, 25, 6, 7, 12, 22, 38, [.loss, .loss, .draw, .win, .loss]),
            (wolves, 25, 5, 7, 13, 28, 45, [.loss, .draw, .loss, .loss, .win]),
            (ipswich, 25, 4, 6, 15, 20, 48, [.loss, .loss, .loss, .draw, .loss]),
            (leicester, 25, 3, 5, 17, 18, 52, [.loss, .loss, .loss, .loss, .draw]),
            (southampton, 25, 2, 4, 19, 15, 58, [.loss, .loss, .loss, .loss, .loss]),
        ]
        return teams.enumerated().map { idx, data in
            Standing(
                id: "epl-\(idx+1)", position: idx + 1, team: data.0,
                played: data.1, won: data.2, drawn: data.3, lost: data.4,
                goalsFor: data.5, goalsAgainst: data.6,
                points: data.2 * 3 + data.3, form: data.7
            )
        }
    }()

    // MARK: - NBA East Standings

    static let nbaEastStandings: [Standing] = {
        let teams: [(Team, Int, Int, Int, Int, Int)] = [
            (celtics,  60, 45, 0, 15, 112),
            (cavs,     60, 42, 0, 18, 110),
            (knicks,   60, 40, 0, 20, 108),
            (bucks,    60, 38, 0, 22, 115),
            (pacers,   60, 36, 0, 24, 118),
            (magic,    60, 35, 0, 25, 106),
            (sixers,   60, 33, 0, 27, 107),
            (heat,     60, 30, 0, 30, 104),
        ]
        return teams.enumerated().map { idx, data in
            Standing(
                id: "nba-e\(idx+1)", position: idx + 1, team: data.0,
                played: data.1, won: data.2, drawn: data.3, lost: data.4,
                goalsFor: data.5 * data.1, goalsAgainst: (data.5 - 5) * data.1,
                points: data.2, form: [.win, .win, .loss, .win, .win]
            )
        }
    }()

    // MARK: - NBA West Standings

    static let nbaWestStandings: [Standing] = {
        let teams: [(Team, Int, Int, Int, Int, Int)] = [
            (thunder,   60, 46, 0, 14, 118),
            (nuggets,   60, 41, 0, 19, 113),
            (timberwolves, 60, 39, 0, 21, 109),
            (mavs,      60, 38, 0, 22, 116),
            (clippers,  60, 36, 0, 24, 110),
            (suns,      60, 35, 0, 25, 112),
            (lakers,    60, 33, 0, 27, 111),
            (warriors,  60, 30, 0, 30, 108),
        ]
        return teams.enumerated().map { idx, data in
            Standing(
                id: "nba-w\(idx+1)", position: idx + 1, team: data.0,
                played: data.1, won: data.2, drawn: data.3, lost: data.4,
                goalsFor: data.5 * data.1, goalsAgainst: (data.5 - 5) * data.1,
                points: data.2, form: [.win, .loss, .win, .win, .loss]
            )
        }
    }()

    // MARK: - Standings by League

    static func standings(for league: League) -> [Standing] {
        switch league.id {
        case "pl": eplStandings
        case "nba-east": nbaEastStandings
        case "nba-west": nbaWestStandings
        default: []
        }
    }

    static func leagues(for sport: Sport) -> [League] {
        switch sport {
        case .all: [.premierLeague, .laLiga, .championsLeague, .serieA, .nba, .nfl, .nhl, .mlb]
        case .soccer: [.premierLeague, .laLiga, .championsLeague, .serieA]
        case .nba: [.nbaEast, .nbaWest]
        case .nfl: [.nfl]
        case .nhl: [.nhl]
        case .mlb: [.mlb]
        }
    }

    // MARK: - Favorite Teams (for browse)

    static func allTeams(for sport: Sport) -> [Team] {
        switch sport {
        case .all:
            return allTeams(for: .soccer) + allTeams(for: .nba) + allTeams(for: .nfl) + allTeams(for: .nhl) + allTeams(for: .mlb)
        case .soccer:
            return [arsenal, manCity, liverpool, chelsea, manUtd, tottenham, newcastle,
                    astonVilla, brighton, westHam, realMadrid, barcelona, interMilan, bayernMunich, psg]
        case .nba:
            return [celtics, lakers, warriors, bucks, nuggets, heat, sixers, knicks, suns, thunder]
        case .nfl:
            return [chiefs, eagles, niners, cowboys, ravens, bills, lions, packers]
        case .nhl:
            return [bruins, mapleLeafs, rangers, oilers, panthers, avalanche, hurricanes, stars]
        case .mlb:
            return [yankees, dodgers, astros, braves, phillies, texasRangers, orioles, twins]
        }
    }
}
