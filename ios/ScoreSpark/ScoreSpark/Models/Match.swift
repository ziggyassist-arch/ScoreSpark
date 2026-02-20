import Foundation

// MARK: - Match Event

enum MatchEventType: String, Sendable {
    case goal
    case yellowCard
    case redCard
    case substitution
    case penalty
    case ownGoal

    var icon: String {
        switch self {
        case .goal, .penalty: "soccerball"
        case .yellowCard: "square.fill"
        case .redCard: "square.fill"
        case .substitution: "arrow.left.arrow.right"
        case .ownGoal: "soccerball"
        }
    }

    var label: String {
        switch self {
        case .goal: "Goal"
        case .penalty: "Penalty"
        case .yellowCard: "Yellow Card"
        case .redCard: "Red Card"
        case .substitution: "Substitution"
        case .ownGoal: "Own Goal"
        }
    }
}

struct MatchEvent: Identifiable, Sendable {
    let id: String
    let type: MatchEventType
    let minute: Int
    let playerName: String
    let teamId: String
    let detail: String?

    init(id: String = UUID().uuidString, type: MatchEventType, minute: Int,
         playerName: String, teamId: String, detail: String? = nil) {
        self.id = id
        self.type = type
        self.minute = minute
        self.playerName = playerName
        self.teamId = teamId
        self.detail = detail
    }
}

// MARK: - Match Stats

struct StatPair: Identifiable, Sendable {
    let id: String
    let name: String
    let home: Int
    let away: Int

    init(name: String, home: Int, away: Int) {
        self.id = name
        self.name = name
        self.home = home
        self.away = away
    }
}

struct MatchStats: Sendable {
    let items: [StatPair]
}

// MARK: - Match Lineup

struct LineupPlayer: Identifiable, Sendable {
    let id: String
    let name: String
    let number: Int
    let position: String

    init(id: String = UUID().uuidString, name: String, number: Int, position: String) {
        self.id = id
        self.name = name
        self.number = number
        self.position = position
    }
}

struct MatchLineup: Sendable {
    let homeFormation: String
    let awayFormation: String
    let homeStarting: [LineupPlayer]
    let awayStarting: [LineupPlayer]
    let homeSubs: [LineupPlayer]
    let awaySubs: [LineupPlayer]
}

// MARK: - Match Status

enum MatchStatus: String, Sendable {
    case live = "LIVE"
    case upcoming = "UPCOMING"
    case finished = "FT"
    case halfTime = "HT"
    case postponed = "PPD"
}

// MARK: - Match

struct Match: Identifiable, Sendable {
    let id: String
    let homeTeam: Team
    let awayTeam: Team
    let homeScore: Int?
    let awayScore: Int?
    let status: MatchStatus
    let minute: Int?
    let startTime: Date
    let league: League
    let events: [MatchEvent]
    let stats: MatchStats?
    let lineups: MatchLineup?
    let liveDescription: String?

    var isLive: Bool { status == .live || status == .halfTime }

    var displayTime: String {
        switch status {
        case .live:
            if let desc = liveDescription { return desc }
            switch league.sport {
            case .nba, .nfl: return "Q\(minute ?? 1)"
            case .nhl: return "P\(minute ?? 1)"
            case .mlb: return minute.map { "Inn \($0)" } ?? "Live"
            default: return "\(minute ?? 0)'"
            }
        case .halfTime: return "HT"
        case .finished:
            return league.sport == .soccer ? "FT" : "Final"
        case .upcoming:
            let formatter = DateFormatter()
            formatter.dateFormat = "HH:mm"
            return formatter.string(from: startTime)
        case .postponed: return "PPD"
        }
    }

    init(id: String, homeTeam: Team, awayTeam: Team, homeScore: Int?, awayScore: Int?,
         status: MatchStatus, minute: Int?, startTime: Date, league: League,
         events: [MatchEvent] = [], stats: MatchStats? = nil, lineups: MatchLineup? = nil,
         liveDescription: String? = nil) {
        self.id = id
        self.homeTeam = homeTeam
        self.awayTeam = awayTeam
        self.homeScore = homeScore
        self.awayScore = awayScore
        self.status = status
        self.minute = minute
        self.startTime = startTime
        self.league = league
        self.events = events
        self.stats = stats
        self.lineups = lineups
        self.liveDescription = liveDescription
    }

    static let previewLive = Match(
        id: "m1", homeTeam: .preview, awayTeam: .preview2,
        homeScore: 2, awayScore: 1, status: .live, minute: 67,
        startTime: Date(), league: .premierLeague
    )
    static let previewUpcoming = Match(
        id: "m2", homeTeam: .preview2, awayTeam: .preview,
        homeScore: nil, awayScore: nil, status: .upcoming, minute: nil,
        startTime: Date().addingTimeInterval(3600), league: .laLiga
    )
    static let previewFinished = Match(
        id: "m3", homeTeam: .preview, awayTeam: .preview2,
        homeScore: 3, awayScore: 3, status: .finished, minute: nil,
        startTime: Date().addingTimeInterval(-7200), league: .premierLeague
    )
}
