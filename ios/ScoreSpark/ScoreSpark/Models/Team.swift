import Foundation

struct Team: Identifiable, Hashable, Sendable {
    let id: String
    let name: String
    let shortName: String
    let logoURL: URL?
    let sport: Sport
    let primaryColor: String

    init(id: String, name: String, shortName: String, logoURL: URL?, sport: Sport, primaryColor: String = "2D2B55") {
        self.id = id
        self.name = name
        self.shortName = shortName
        self.logoURL = logoURL
        self.sport = sport
        self.primaryColor = primaryColor
    }

    static let preview = Team(
        id: "mci", name: "Manchester City", shortName: "MCI",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/50.png"),
        sport: .soccer, primaryColor: "6CABDD"
    )
    static let preview2 = Team(
        id: "ars", name: "Arsenal", shortName: "ARS",
        logoURL: URL(string: "https://media.api-sports.io/football/teams/42.png"),
        sport: .soccer, primaryColor: "EF0107"
    )
}
