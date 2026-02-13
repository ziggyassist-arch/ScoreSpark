import Foundation

struct Standing: Identifiable, Sendable {
    let id: String
    let position: Int
    let team: Team
    let played: Int
    let won: Int
    let drawn: Int
    let lost: Int
    let goalsFor: Int
    let goalsAgainst: Int
    let points: Int

    var goalDifference: Int { goalsFor - goalsAgainst }

    static let preview = Standing(
        id: "s1", position: 1, team: .preview,
        played: 20, won: 15, drawn: 3, lost: 2,
        goalsFor: 48, goalsAgainst: 15, points: 48
    )
}
