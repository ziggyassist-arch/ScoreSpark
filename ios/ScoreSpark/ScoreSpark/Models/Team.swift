import Foundation

struct Team: Identifiable, Hashable, Sendable {
    let id: String
    let name: String
    let shortName: String
    let logoURL: URL?
    let sport: Sport

    static let preview = Team(
        id: "1", name: "Manchester City", shortName: "MCI",
        logoURL: nil, sport: .soccer
    )
    static let preview2 = Team(
        id: "2", name: "Arsenal", shortName: "ARS",
        logoURL: nil, sport: .soccer
    )
}
