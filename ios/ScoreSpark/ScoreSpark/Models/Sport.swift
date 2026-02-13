import Foundation

enum Sport: String, CaseIterable, Identifiable, Sendable {
    case soccer = "Soccer"
    case nba = "NBA"
    case nfl = "NFL"

    var id: String { rawValue }

    var icon: String {
        switch self {
        case .soccer: "soccerball"
        case .nba: "basketball.fill"
        case .nfl: "football.fill"
        }
    }

    var emoji: String {
        switch self {
        case .soccer: "⚽"
        case .nba: "🏀"
        case .nfl: "🏈"
        }
    }
}

@Observable
final class SportSelection: @unchecked Sendable {
    var current: Sport = .soccer
}
