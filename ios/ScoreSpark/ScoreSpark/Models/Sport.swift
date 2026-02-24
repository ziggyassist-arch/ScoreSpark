import Foundation

enum Sport: String, CaseIterable, Identifiable, Sendable {
    case all = "All"
    case soccer = "Soccer"
    case nba = "NBA"
    case nfl = "NFL"
    case nhl = "NHL"
    case mlb = "MLB"

    var id: String { rawValue }

    var icon: String {
        switch self {
        case .all: "sportscourt.fill"
        case .soccer: "soccerball"
        case .nba: "basketball.fill"
        case .nfl: "football.fill"
        case .nhl: "hockey.puck.fill"
        case .mlb: "baseball.fill"
        }
    }

    var emoji: String {
        switch self {
        case .all: "🏆"
        case .soccer: "⚽"
        case .nba: "🏀"
        case .nfl: "🏈"
        case .nhl: "🏒"
        case .mlb: "⚾"
        }
    }

    var accentColor: String {
        switch self {
        case .all: "F5C542"
        case .soccer: "22C55E"
        case .nba: "F97316"
        case .nfl: "3B82F6"
        case .nhl: "A855F7"
        case .mlb: "EF4444"
        }
    }

    /// The specific sports (excluding .all)
    static var sports: [Sport] {
        allCases.filter { $0 != .all }
    }
}

@Observable
final class SportSelection: @unchecked Sendable {
    var current: Sport = .soccer
}
