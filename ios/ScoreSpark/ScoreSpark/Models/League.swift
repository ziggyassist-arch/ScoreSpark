import Foundation

struct League: Identifiable, Hashable, Sendable {
    let id: String
    let name: String
    let country: String
    let sport: Sport
    let logoURL: URL?

    static let premierLeague = League(
        id: "pl", name: "Premier League", country: "England",
        sport: .soccer, logoURL: nil
    )
    static let laLiga = League(
        id: "ll", name: "La Liga", country: "Spain",
        sport: .soccer, logoURL: nil
    )
    static let championsLeague = League(
        id: "ucl", name: "Champions League", country: "Europe",
        sport: .soccer, logoURL: nil
    )
    static let serieA = League(
        id: "sa", name: "Serie A", country: "Italy",
        sport: .soccer, logoURL: nil
    )

    // Top 5 + cups
    static let bundesliga = League(id: "bl", name: "Bundesliga", country: "Germany", sport: .soccer, logoURL: nil)
    static let ligue1 = League(id: "l1", name: "Ligue 1", country: "France", sport: .soccer, logoURL: nil)
    static let eredivisie = League(id: "ered", name: "Eredivisie", country: "Netherlands", sport: .soccer, logoURL: nil)
    static let primeiraLiga = League(id: "ligapt", name: "Primeira Liga", country: "Portugal", sport: .soccer, logoURL: nil)
    static let championship = League(id: "eng-championship", name: "Championship", country: "England", sport: .soccer, logoURL: nil)

    // Rest of Europe
    static let scottish = League(id: "scottish", name: "Premiership", country: "Scotland", sport: .soccer, logoURL: nil)
    static let superLig = League(id: "superlig", name: "Süper Lig", country: "Turkey", sport: .soccer, logoURL: nil)
    static let jupiler = League(id: "jupiler", name: "Jupiler Pro", country: "Belgium", sport: .soccer, logoURL: nil)
    static let austrian = League(id: "austrian", name: "Bundesliga", country: "Austria", sport: .soccer, logoURL: nil)
    static let swiss = League(id: "swiss", name: "Super League", country: "Switzerland", sport: .soccer, logoURL: nil)
    static let greek = League(id: "greek", name: "Super League", country: "Greece", sport: .soccer, logoURL: nil)
    static let danish = League(id: "danish", name: "Superliga", country: "Denmark", sport: .soccer, logoURL: nil)
    static let norwegian = League(id: "norwegian", name: "Eliteserien", country: "Norway", sport: .soccer, logoURL: nil)
    static let swedish = League(id: "swedish", name: "Allsvenskan", country: "Sweden", sport: .soccer, logoURL: nil)
    static let czech = League(id: "czech", name: "First League", country: "Czechia", sport: .soccer, logoURL: nil)
    static let finnish = League(id: "finnish", name: "Veikkausliiga", country: "Finland", sport: .soccer, logoURL: nil)
    static let romanian = League(id: "romanian", name: "Liga I", country: "Romania", sport: .soccer, logoURL: nil)
    static let russian = League(id: "russian", name: "Premier League", country: "Russia", sport: .soccer, logoURL: nil)

    // Americas
    static let mls = League(id: "mls", name: "MLS", country: "USA", sport: .soccer, logoURL: nil)
    static let ligaMX = League(id: "ligamx", name: "Liga MX", country: "Mexico", sport: .soccer, logoURL: nil)
    static let brasileirao = League(id: "brasileirao", name: "Brasileirão", country: "Brazil", sport: .soccer, logoURL: nil)
    static let argentina = League(id: "argentina", name: "Liga Profesional", country: "Argentina", sport: .soccer, logoURL: nil)
    static let colombian = League(id: "colombian", name: "Liga BetPlay", country: "Colombia", sport: .soccer, logoURL: nil)
    static let chilean = League(id: "chilean", name: "Primera División", country: "Chile", sport: .soccer, logoURL: nil)
    static let peruvian = League(id: "peruvian", name: "Liga 1", country: "Peru", sport: .soccer, logoURL: nil)
    static let uruguayan = League(id: "uruguayan", name: "Primera División", country: "Uruguay", sport: .soccer, logoURL: nil)

    // Asia
    static let jLeague = League(id: "jleague", name: "J1 League", country: "Japan", sport: .soccer, logoURL: nil)
    static let saudiPro = League(id: "saudipro", name: "Saudi Pro League", country: "Saudi Arabia", sport: .soccer, logoURL: nil)
    static let indian = League(id: "indian", name: "Indian Super League", country: "India", sport: .soccer, logoURL: nil)
    static let chinese = League(id: "chinese", name: "Chinese Super League", country: "China", sport: .soccer, logoURL: nil)
    static let aLeague = League(id: "aleague", name: "A-League", country: "Australia", sport: .soccer, logoURL: nil)

    static let nba = League(
        id: "nba", name: "NBA", country: "USA",
        sport: .nba, logoURL: nil
    )
    static let nbaEast = League(
        id: "nba-east", name: "NBA Eastern", country: "USA",
        sport: .nba, logoURL: nil
    )
    static let nbaWest = League(
        id: "nba-west", name: "NBA Western", country: "USA",
        sport: .nba, logoURL: nil
    )
    static let nfl = League(
        id: "nfl", name: "NFL", country: "USA",
        sport: .nfl, logoURL: nil
    )

    // NHL
    static let nhl = League(
        id: "nhl", name: "NHL", country: "USA/Canada",
        sport: .nhl, logoURL: nil
    )

    // MLB
    static let mlb = League(
        id: "mlb", name: "MLB", country: "USA",
        sport: .mlb, logoURL: nil
    )
}
