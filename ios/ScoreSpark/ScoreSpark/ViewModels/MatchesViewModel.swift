import Foundation

struct LeagueGroup: Identifiable, Sendable {
    let league: League
    let matches: [Match]
    var id: String { league.id }
}

@Observable @MainActor
final class MatchesViewModel {
    var groups: [LeagueGroup] = []
    var selectedDate = Date()
    var isLoading = false

    func load(sport: Sport) async {
        isLoading = true
        try? await Task.sleep(for: .milliseconds(300))
        groups = [
            LeagueGroup(league: .premierLeague, matches: [.previewLive, .previewFinished]),
            LeagueGroup(league: .laLiga, matches: [.previewUpcoming]),
        ]
        isLoading = false
    }
}
