import Foundation

actor APIService {
    static let shared = APIService()

    private let session: URLSession
    private let baseURL = URL(string: "https://api.scorespark.app/v1")!

    private init() {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 30
        session = URLSession(configuration: config)
    }

    func fetch<T: Decodable & Sendable>(_ endpoint: String, type: T.Type) async throws -> T {
        let url = baseURL.appendingPathComponent(endpoint)
        let (data, _) = try await session.data(from: url)
        return try JSONDecoder().decode(T.self, from: data)
    }
}
