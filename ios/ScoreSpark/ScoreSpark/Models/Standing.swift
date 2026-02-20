import Foundation

enum FormResult: String, Sendable {
    case win = "W"
    case draw = "D"
    case loss = "L"
}

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
    let form: [FormResult]

    var goalDifference: Int { goalsFor - goalsAgainst }

    init(id: String, position: Int, team: Team, played: Int, won: Int, drawn: Int, lost: Int,
         goalsFor: Int, goalsAgainst: Int, points: Int, form: [FormResult] = []) {
        self.id = id
        self.position = position
        self.team = team
        self.played = played
        self.won = won
        self.drawn = drawn
        self.lost = lost
        self.goalsFor = goalsFor
        self.goalsAgainst = goalsAgainst
        self.points = points
        self.form = form
    }

    static let preview = Standing(
        id: "s1", position: 1, team: .preview,
        played: 25, won: 18, drawn: 4, lost: 3,
        goalsFor: 55, goalsAgainst: 18, points: 58,
        form: [.win, .win, .draw, .win, .loss]
    )
}
