import Foundation

@Observable @MainActor
final class HomeViewModel {
    var liveMatches: [Match] = []
    var upcomingMatches: [Match] = []
    var myTeamMatches: [Match] = []
    var isLoading = false

    func load(sport: Sport) async {
        isLoading = true
        try? await Task.sleep(for: .milliseconds(300))
        let all = MockDataService.matches(for: sport)
        liveMatches = all.filter { $0.isLive }
        upcomingMatches = all.filter { $0.status == .upcoming }
        myTeamMatches = all.filter { $0.status == .finished }.prefix(4).map { $0 }
        isLoading = false
    }
}
