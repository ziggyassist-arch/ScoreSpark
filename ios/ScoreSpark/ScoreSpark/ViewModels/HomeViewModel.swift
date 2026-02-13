import Foundation

@Observable @MainActor
final class HomeViewModel {
    var liveMatches: [Match] = []
    var upcomingMatches: [Match] = []
    var myTeamMatches: [Match] = []
    var isLoading = false

    func load(sport: Sport) async {
        isLoading = true
        // TODO: Replace with real API calls
        try? await Task.sleep(for: .milliseconds(300))
        liveMatches = [.previewLive]
        upcomingMatches = [.previewUpcoming]
        myTeamMatches = [.previewFinished, .previewLive]
        isLoading = false
    }
}
