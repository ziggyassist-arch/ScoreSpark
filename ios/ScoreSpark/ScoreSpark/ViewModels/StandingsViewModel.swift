import Foundation

@Observable @MainActor
final class StandingsViewModel {
    var leagues: [League] = [.premierLeague, .nbaEast, .nbaWest]
    var selectedLeague: League = .premierLeague
    var standings: [Standing] = []
    var isLoading = false

    func updateLeagues(for sport: Sport) {
        leagues = MockDataService.leagues(for: sport)
        if !leagues.contains(where: { $0.id == selectedLeague.id }) {
            selectedLeague = leagues.first ?? .premierLeague
        }
    }

    func load() async {
        isLoading = true
        try? await Task.sleep(for: .milliseconds(300))
        standings = MockDataService.standings(for: selectedLeague)
        isLoading = false
    }
}
