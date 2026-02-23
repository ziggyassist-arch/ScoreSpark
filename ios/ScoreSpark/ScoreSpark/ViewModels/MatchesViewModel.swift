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
    var error: String?

    func load(sport: Sport) async {
        isLoading = true
        error = nil

        do {
            let sportParam = sport == .all ? nil : sport.apiValue
            let apiMatches = try await APIService.shared.fetchMatches(sport: sportParam)
            let matches = apiMatches.map { $0.toMatch() }

            // Group by league
            var leagueDict: [String: (League, [Match])] = [:]
            for match in matches {
                let key = match.league.name
                if leagueDict[key] == nil {
                    leagueDict[key] = (match.league, [])
                }
                leagueDict[key]?.1.append(match)
            }

            // Sort: live matches first
            groups = leagueDict.values
                .map { LeagueGroup(league: $0.0, matches: $0.1) }
                .sorted { g1, g2 in
                    let g1Live = g1.matches.contains { $0.isLive }
                    let g2Live = g2.matches.contains { $0.isLive }
                    if g1Live != g2Live { return g1Live }
                    return g1.league.name < g2.league.name
                }
        } catch {
            self.error = error.localizedDescription
            groups = MockDataService.leagueGroups(for: sport)
        }

        isLoading = false
    }
}
