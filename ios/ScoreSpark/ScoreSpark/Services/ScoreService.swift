import Foundation

actor ScoreService {
    static let shared = ScoreService()

    // TODO: WebSocket connection for live scores
    func connectLiveScores(sport: Sport) async {
        // Placeholder for WebSocket implementation
    }

    func disconnect() {
        // Placeholder
    }
}
