import Foundation

@Observable @MainActor
final class HomeViewModel {
    var liveMatches: [Match] = []
    var upcomingMatches: [Match] = []
    var myTeamMatches: [Match] = []
    var isLoading = false
    var error: String?

    private var pollTimer: Timer?

    func load(sport: Sport) async {
        isLoading = true
        error = nil

        do {
            let sportParam = sport == .all ? nil : sport.apiValue
            let apiMatches = try await APIService.shared.fetchMatches(sport: sportParam)
            let matches = apiMatches.map { $0.toMatch() }

            liveMatches = matches.filter { $0.isLive }
            upcomingMatches = matches.filter { $0.status == .upcoming }
            myTeamMatches = matches.filter { $0.status == .finished }.prefix(4).map { $0 }
        } catch {
            // Fall back to mock data
            self.error = error.localizedDescription
            let all = MockDataService.matches(for: sport)
            liveMatches = all.filter { $0.isLive }
            upcomingMatches = all.filter { $0.status == .upcoming }
            myTeamMatches = all.filter { $0.status == .finished }.prefix(4).map { $0 }
        }

        isLoading = false
    }

    func startPolling(sport: Sport) {
        stopPolling()
        guard !liveMatches.isEmpty else { return }

        pollTimer = Timer.scheduledTimer(withTimeInterval: 30, repeats: true) { [weak self] _ in
            guard let self else { return }
            Task { @MainActor in
                await self.load(sport: sport)
            }
        }
    }

    func stopPolling() {
        pollTimer?.invalidate()
        pollTimer = nil
    }
}
