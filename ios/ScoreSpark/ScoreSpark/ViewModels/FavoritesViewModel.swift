import Foundation
import SwiftUI

@Observable @MainActor
final class FavoritesViewModel {
    var favoriteTeamIds: Set<String> = [] {
        didSet { saveFavorites() }
    }
    var browseSport: Sport = .soccer
    var browseTeams: [Team] = []

    var favoriteTeams: [Team] {
        MockDataService.allTeams(for: .all).filter { favoriteTeamIds.contains($0.id) }
    }

    var favoriteMatches: [Match] {
        guard !favoriteTeamIds.isEmpty else { return [] }
        return MockDataService.allMatches.filter {
            favoriteTeamIds.contains($0.homeTeam.id) || favoriteTeamIds.contains($0.awayTeam.id)
        }
    }

    func load() async {
        loadFavorites()
        browseTeams = MockDataService.allTeams(for: browseSport)
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
