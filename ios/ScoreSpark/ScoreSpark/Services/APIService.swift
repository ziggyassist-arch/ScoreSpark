import Foundation

// MARK: - API Response DTOs (Codable)

struct APIMatchesResponse: Codable, Sendable {
    let matches: [APIMatch]
}

struct APIMatch: Codable, Sendable {
    let id: String
    let sport: String
    let league: String
    let leagueShort: String
    let homeTeam: APITeam
    let awayTeam: APITeam
    let homeScore: Int?
    let awayScore: Int?
    let status: String // "live", "upcoming", "finished"
    let startTime: String
    let events: [APIMatchEvent]
    let clock: APIClock?
    let venue: String?
    let source: String?
}

struct APITeam: Codable, Sendable {
    let id: String
    let name: String
    let shortName: String
    let badge: String
    let sport: String
}

struct APIMatchEvent: Codable, Sendable {
    let minute: Int
    let type: String
    let player: String
    let team: String // "home" or "away"
    let assistedBy: String?
    let playerOut: String?
}

struct APIClock: Codable, Sendable {
    let value: Int?
    let displayValue: String?
}

struct APIStandingsResponse: Codable, Sendable {
    let type: String
    let rows: [APIStandingRow]
}

struct APIStandingRow: Codable, Sendable {
    let position: Int
    let team: APITeam
    let played: Int
    let won: Int
    let drawn: Int?
    let lost: Int
    let goalsFor: Int?
    let goalsAgainst: Int?
    let goalDifference: Int?
    let points: Int?
    let form: [String]?
    // NBA/NFL/MLB fields
    let winPct: String?
    let gamesBehind: String?
    let streak: String?
    let last10: String?
}

// MARK: - API Service

actor APIService {
    static let shared = APIService()

    private let session: URLSession
    private let decoder: JSONDecoder

    #if DEBUG
    // Use localhost for Simulator, Vercel for device
    private let baseURL = URL(string: "https://scorespark.vercel.app/api/v1")!
    #else
    private let baseURL = URL(string: "https://scorespark.vercel.app/api/v1")!
    #endif

    private init() {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 15
        config.urlCache = URLCache(memoryCapacity: 10_000_000, diskCapacity: 50_000_000)
        session = URLSession(configuration: config)
        decoder = JSONDecoder()
    }

    // MARK: - Generic fetch

    private func fetch<T: Decodable & Sendable>(_ endpoint: String, queryItems: [URLQueryItem] = []) async throws -> T {
        var components = URLComponents(url: baseURL.appendingPathComponent(endpoint), resolvingAgainstBaseURL: false)!
        if !queryItems.isEmpty {
            components.queryItems = queryItems
        }

        guard let url = components.url else {
            throw APIError.invalidURL
        }

        let (data, response) = try await session.data(from: url)

        guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
            throw APIError.serverError((response as? HTTPURLResponse)?.statusCode ?? 0)
        }

        return try decoder.decode(T.self, from: data)
    }

    // MARK: - Matches

    func fetchMatches(sport: String? = nil, date: String? = nil) async throws -> [APIMatch] {
        var params: [URLQueryItem] = []
        if let sport { params.append(URLQueryItem(name: "sport", value: sport)) }
        if let date { params.append(URLQueryItem(name: "date", value: date)) }

        let response: APIMatchesResponse = try await fetch("matches", queryItems: params)
        return response.matches
    }

    // MARK: - Standings

    func fetchStandings(league: String) async throws -> APIStandingsResponse {
        return try await fetch("standings/\(league)")
    }

    // MARK: - Competitions

    func fetchCompetitions() async throws -> [String: String] {
        return try await fetch("competitions")
    }
}

// MARK: - Errors

enum APIError: LocalizedError {
    case invalidURL
    case serverError(Int)
    case decodingError(String)

    var errorDescription: String? {
        switch self {
        case .invalidURL: return "Invalid URL"
        case .serverError(let code): return "Server error: \(code)"
        case .decodingError(let msg): return "Decoding error: \(msg)"
        }
    }
}

// MARK: - DTO → Model Converters

extension APIMatch {
    func toMatch() -> Match {
        let sportEnum = Sport(apiString: sport)
        let leagueModel = League(
            id: leagueShort.lowercased(),
            name: league,
            country: "",
            sport: sportEnum,
            logoURL: nil
        )

        let matchStatus: MatchStatus = {
            switch status {
            case "live": return .live
            case "finished": return .finished
            case "upcoming": return .upcoming
            default: return .upcoming
            }
        }()

        let iso8601 = ISO8601DateFormatter()
        let date = iso8601.date(from: startTime) ?? Date()

        return Match(
            id: id,
            homeTeam: homeTeam.toTeam(),
            awayTeam: awayTeam.toTeam(),
            homeScore: homeScore,
            awayScore: awayScore,
            status: matchStatus,
            minute: clock?.value,
            startTime: date,
            league: leagueModel,
            events: events.map { $0.toEvent() },
            liveDescription: clock?.displayValue
        )
    }
}

extension APITeam {
    func toTeam() -> Team {
        Team(
            id: id,
            name: name,
            shortName: shortName,
            logoURL: URL(string: badge),
            sport: Sport(apiString: sport)
        )
    }
}

extension APIMatchEvent {
    func toEvent() -> MatchEvent {
        let eventType: MatchEventType = {
            switch type {
            case "goal": return .goal
            case "yellow-card": return .yellowCard
            case "red-card": return .redCard
            case "substitution": return .substitution
            case "penalty": return .penalty
            case "own-goal": return .ownGoal
            default: return .goal
            }
        }()

        return MatchEvent(
            type: eventType,
            minute: minute,
            playerName: player,
            teamId: team,
            detail: assistedBy
        )
    }
}

extension APIStandingRow {
    func toStanding() -> Standing {
        Standing(
            id: "\(position)-\(team.id)",
            position: position,
            team: team.toTeam(),
            played: played,
            won: won,
            drawn: drawn ?? 0,
            lost: lost,
            goalsFor: goalsFor ?? 0,
            goalsAgainst: goalsAgainst ?? 0,
            points: points ?? 0,
            form: (form ?? []).compactMap { FormResult(rawValue: $0) }
        )
    }
}

extension Sport {
    init(apiString: String) {
        switch apiString.lowercased() {
        case "soccer": self = .soccer
        case "nba": self = .nba
        case "nfl": self = .nfl
        case "nhl": self = .nhl
        case "mlb": self = .mlb
        default: self = .all
        }
    }

    /// The string to pass to the API
    var apiValue: String {
        switch self {
        case .all: return ""
        case .soccer: return "soccer"
        case .nba: return "nba"
        case .nfl: return "nfl"
        case .nhl: return "nhl"
        case .mlb: return "mlb"
        }
    }
}
