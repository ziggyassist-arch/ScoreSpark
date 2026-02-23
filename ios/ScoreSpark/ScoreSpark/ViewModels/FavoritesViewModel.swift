import Foundation
import SwiftUI

@Observable @MainActor
final class FavoritesViewModel {
    var favoriteTeamIds: Set<String> = [] {
        didSet { saveFavorites() }
    }
    var browseSport: Sport = .soccer
    var browseTeams: [Team] = []
    var favoriteMatches: [Match] = []

    var favoriteTeams: [Team] {
        MockDataService.allTeams(for: .all).filter { favoriteTeamIds.contains($0.id) }
    }

    func load() async {
        loadFavorites()
        browseTeams = MockDataService.allTeams(for: browseSport)

        // Fetch live matches and filter by favorites
        if !favoriteTeamIds.isEmpty {
            do {
                let apiMatches = try await APIService.shared.fetchMatches()
                let all = apiMatches.map { $0.toMatch() }
                favoriteMatches = all.filter {
                    favoriteTeamIds.contains($0.homeTeam.id) || favoriteTeamIds.contains($0.awayTeam.id)
                }
            } catch {
                favoriteMatches = MockDataService.allMatches.filter {
                    favoriteTeamIds.contains($0.homeTeam.id) || favoriteTeamIds.contains($0.awayTeam.id)
                }
            }
        }
    }

    func updateBrowseSport(_ sport: Sport) {
        browseSport = sport
        browseTeams = MockDataService.allTeams(for: sport)
    }

    func toggleFavorite(_ team: Team) {
        if favoriteTeamIds.contains(team.id) {
            favoriteTeamIds.remove(team.id)
        } else {
            favoriteTeamIds.insert(team.id)
        }
    }

    func isFavorite(_ team: Team) -> Bool {
        favoriteTeamIds.contains(team.id)
    }

    private func saveFavorites() {
        UserDefaults.standard.set(Array(favoriteTeamIds), forKey: "favoriteTeamIds")
    }

    private func loadFavorites() {
        if let ids = UserDefaults.standard.stringArray(forKey: "favoriteTeamIds") {
            favoriteTeamIds = Set(ids)
        }
    }
}
