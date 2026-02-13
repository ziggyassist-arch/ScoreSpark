import Foundation

@Observable @MainActor
final class StandingsViewModel {
    var leagues: [League] = [.premierLeague, .laLiga, .nba]
    var selectedLeague: League = .premierLeague
    var standings: [Standing] = []
    var isLoading = false

    func load() async {
        isLoading = true
        try? await Task.sleep(for: .milliseconds(300))
        standings = (1...20).map { i in
            Standing(
                id: "s\(i)", position: i,
                team: Team(id: "t\(i)", name: "Team \(i)", shortName: "T\(i)", logoURL: nil, sport: .soccer),
                played: 20, won: max(0, 20 - i), drawn: min(i, 5),
                lost: max(0, i - 5), goalsFor: 50 - i * 2,
                goalsAgainst: 10 + i * 2, points: max(0, 60 - i * 3)
            )
        }
        isLoading = false
    }
}
