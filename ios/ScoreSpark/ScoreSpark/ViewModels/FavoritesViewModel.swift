import Foundation

@Observable @MainActor
final class FavoritesViewModel {
    var favoriteTeams: [Team] = []
    var favoriteMatches: [Match] = []

    func load() async {
        try? await Task.sleep(for: .milliseconds(200))
        favoriteTeams = [.preview, .preview2]
        favoriteMatches = [.previewLive]
    }

    func toggleFavorite(_ team: Team) {
        if let idx = favoriteTeams.firstIndex(where: { $0.id == team.id }) {
            favoriteTeams.remove(at: idx)
        } else {
            favoriteTeams.append(team)
        }
    }
}
