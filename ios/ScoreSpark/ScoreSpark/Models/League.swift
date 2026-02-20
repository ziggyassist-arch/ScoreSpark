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
