import Foundation

struct Player: Identifiable, Sendable {
    let id: String
    let name: String
    let number: Int
    let position: String
    let team: Team
}
