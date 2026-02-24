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
    var isLoading = false

    var resolvedFavoriteTeams: [Team] {
        let all = MockDataService.allTeams(for: .all) + browseTeams
        var seen = Set<String>()
        return all.filter { favoriteTeamIds.contains($0.id) && seen.insert($0.id).inserted }
    }

    func load() async {
        isLoading = true
        loadFavorites()
        await loadBrowseTeams()

        if !favoriteTeamIds.isEmpty {
            do {
                let apiMatches = try await APIService.shared.fetchMatches()
                let all = apiMatches.map { $0.toMatch() }
                favoriteMatches = all.filter {
                    favoriteTeamIds.contains($0.homeTeam.id) || favoriteTeamIds.contains($0.awayTeam.id)
                }
            } catch {
                favoriteMatches = []
            }
        }
        isLoading = false
    }

    func updateBrowseSport(_ sport: Sport) {
        browseSport = sport
        Task { await loadBrowseTeams() }
    }

    private func loadBrowseTeams() async {
        let sportParam = browseSport.apiValue
        let leagueKey = sportParam == "soccer" ? "epl"
            : sportParam == "nba" ? "nba-east"
            : sportParam == "nfl" ? "nfl-afc"
            : sportParam == "nhl" ? "nhl"
            : "mlb-al"

        do {
            let response = try await APIService.shared.fetchStandings(league: leagueKey)
            browseTeams = response.rows.map { $0.toStanding().team }
        } catch {
            browseTeams = MockDataService.allTeams(for: browseSport)
        }
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
