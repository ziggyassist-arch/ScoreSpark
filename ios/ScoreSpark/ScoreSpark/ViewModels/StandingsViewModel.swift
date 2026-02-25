import Foundation

@Observable @MainActor
final class StandingsViewModel {
    var leagues: [League] = [.premierLeague, .nbaEast, .nbaWest]
    var selectedLeague: League = .premierLeague
    var standings: [Standing] = []
    var isLoading = false
    var error: String?

    /// Map League IDs to API standings slugs
    private static let leagueAPIMap: [String: String] = [
        // Top 5 + European
        "pl": "epl", "ll": "laliga", "bl": "bundesliga", "sa": "seriea", "l1": "ligue1",
        "ucl": "ucl", "ered": "eredivisie", "ligapt": "ligapt",
        // Rest of Europe
        "eng-championship": "eng-championship",
        "scottish": "scottish", "superlig": "superlig", "jupiler": "jupiler",
        "austrian": "austrian", "swiss": "swiss", "greek": "greek",
        "danish": "danish", "norwegian": "norwegian", "swedish": "swedish",
        "czech": "czech", "finnish": "finnish", "romanian": "romanian", "russian": "russian",
        // Americas
        "mls": "mls", "ligamx": "ligamx", "brasileirao": "brasileirao", "argentina": "argentina",
        "colombian": "colombian", "chilean": "chilean", "peruvian": "peruvian", "uruguayan": "uruguayan",
        // Asia & Africa
        "jleague": "jleague", "saudipro": "saudipro", "indian": "indian",
        "chinese": "chinese", "aleague": "aleague",
        // American sports
        "nba-east": "nba-east", "nba-west": "nba-west",
        "nfl-afc": "nfl-afc", "nfl-nfc": "nfl-nfc",
        "nhl": "nhl", "mlb-al": "mlb-al", "mlb-nl": "mlb-nl",
    ]

    func updateLeagues(for sport: Sport) {
        leagues = MockDataService.leagues(for: sport)
        if !leagues.contains(where: { $0.id == selectedLeague.id }) {
            selectedLeague = leagues.first ?? .premierLeague
        }
    }

    func load() async {
        isLoading = true
        error = nil

        let slug = Self.leagueAPIMap[selectedLeague.id] ?? selectedLeague.id

        do {
            let response = try await APIService.shared.fetchStandings(league: slug)
            standings = response.rows.map { $0.toStanding() }
        } catch {
            self.error = error.localizedDescription
            standings = MockDataService.standings(for: selectedLeague)
        }

        isLoading = false
    }
}
