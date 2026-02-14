import Foundation

enum MatchStatus: String, Sendable {
    case live = "LIVE"
    case upcoming = "UPCOMING"
    case finished = "FT"
    case halfTime = "HT"
    case postponed = "PPD"
}

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

    var isLive: Bool { status == .live || status == .halfTime }
    var displayTime: String {
        switch status {
        case .live: return "\(minute ?? 0)'"
        case .halfTime: return "HT"
        case .finished: return "FT"
        case .upcoming:
            let formatter = DateFormatter()
            formatter.dateFormat = "HH:mm"
            return formatter.string(from: startTime)
        case .postponed: return "PPD"
        }
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
