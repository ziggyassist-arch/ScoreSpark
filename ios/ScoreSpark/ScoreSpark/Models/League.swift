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
    static let nba = League(
        id: "nba", name: "NBA", country: "USA",
        sport: .nba, logoURL: nil
    )
}
