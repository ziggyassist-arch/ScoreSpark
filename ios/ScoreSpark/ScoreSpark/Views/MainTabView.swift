import SwiftUI

/// Top-level content tabs shown above each sport's content
enum ContentTab: Int, CaseIterable {
    case leagues, teams, news, following, mockDraft

    var title: String {
        switch self {
        case .leagues: "Leagues"
        case .teams: "Teams"
        case .news: "News"
        case .following: "Following"
        case .mockDraft: "Mock Draft"
        }
    }
}

struct MainTabView: View {
    @Environment(SportSelection.self) private var sportSelection
    @State private var selectedContentTab: ContentTab = .leagues
    @State private var showSettings = false

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                headerBar
                contentTabBar

                Group {
                    switch selectedContentTab {
                    case .leagues:
                        HomeView()
                    case .teams:
                        TeamsListView()
                    case .news:
                        NewsListView()
                    case .following:
                        FavoritesView()
                    case .mockDraft:
                        mockDraftPlaceholder
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
            .background(AppColors.background)
            .toolbar(.hidden, for: .navigationBar)
            .navigationDestination(for: String.self) { matchId in
                MatchDetailView(matchId: matchId)
            }
            .navigationDestination(isPresented: $showSettings) {
                SettingsView()
            }
            .safeAreaInset(edge: .bottom) {
                sportTabBar
            }
        }
    }

    // MARK: - Header Bar (44pt, logo left, icons right)

    private var headerBar: some View {
        HStack {
            HStack(spacing: 2) {
                Text("Score")
                    .font(.system(size: 18, weight: .bold, design: .rounded))
                    .foregroundStyle(.white)
                Text("Spark")
                    .font(.system(size: 18, weight: .bold, design: .rounded))
                    .foregroundStyle(AppColors.gold)
            }
            Spacer()
            HStack(spacing: 16) {
                Button {} label: {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 16, weight: .medium))
                        .foregroundStyle(AppColors.textSecondary)
                }
                Button { showSettings = true } label: {
                    Image(systemName: "gearshape")
                        .font(.system(size: 16, weight: .medium))
                        .foregroundStyle(AppColors.textSecondary)
                }
            }
        }
        .padding(.horizontal, 16)
        .frame(height: 44)
    }

    // MARK: - Content Tab Bar (Leagues/Teams/News/Following/Mock Draft)

    private var contentTabBar: some View {
        HStack(spacing: 0) {
            ForEach(ContentTab.allCases, id: \.rawValue) { tab in
                Button {
                    withAnimation(.easeInOut(duration: 0.2)) {
                        selectedContentTab = tab
                    }
                } label: {
                    VStack(spacing: 4) {
                        Text(tab.title)
                            .font(.system(size: 12, weight: selectedContentTab == tab ? .semibold : .regular))
                            .foregroundStyle(selectedContentTab == tab ? AppColors.gold : AppColors.textTertiary)
                        Rectangle()
                            .fill(selectedContentTab == tab ? AppColors.gold : Color.clear)
                            .frame(height: 2)
                    }
                }
                .frame(maxWidth: .infinity)
            }
        }
        .padding(.horizontal, 8)
        .frame(height: 36)
        .background(AppColors.background)
    }

    // MARK: - Sport Tab Bar (bottom, 5 sports)

    private var sportTabBar: some View {
        @Bindable var selection = sportSelection
        return HStack(spacing: 0) {
            ForEach(Sport.sports) { sport in
                let isSelected = selection.current == sport
                Button {
                    withAnimation(.snappy(duration: 0.25)) {
                        selection.current = sport
                    }
                } label: {
                    VStack(spacing: 3) {
                        if let url = sportLogoURL(sport) {
                            AsyncImage(url: url) { image in
                                image.resizable().scaledToFit()
                            } placeholder: {
                                Text(sport.emoji)
                                    .font(.system(size: 16))
                            }
                            .frame(width: 24, height: 24)
                            .opacity(isSelected ? 1 : 0.4)
                        }
                        Text(sport == .soccer ? "Soccer" : sport.rawValue)
                            .font(.system(size: 9, weight: .semibold))
                            .foregroundStyle(isSelected ? Color(hex: sport.accentColor) : AppColors.textTertiary)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 6)
                }
            }
        }
        .padding(.horizontal, 4)
        .padding(.bottom, 2)
        .background(
            Rectangle()
                .fill(AppColors.background)
                .shadow(color: .black.opacity(0.3), radius: 8, y: -2)
                .ignoresSafeArea(edges: .bottom)
        )
    }

    private func sportLogoURL(_ sport: Sport) -> URL? {
        switch sport {
        case .soccer: URL(string: "https://images.fotmob.com/image_resources/logo/leaguelogo/dark/47.png")
        case .nba: URL(string: "https://a.espncdn.com/i/teamlogos/leagues/500/nba.png")
        case .nfl: URL(string: "https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png")
        case .nhl: URL(string: "https://a.espncdn.com/i/teamlogos/leagues/500/nhl.png")
        case .mlb: URL(string: "https://a.espncdn.com/i/teamlogos/leagues/500/mlb.png")
        case .all: nil
        }
    }

    // MARK: - Mock Draft Placeholder

    private var mockDraftPlaceholder: some View {
        VStack(spacing: 12) {
            Spacer()
            Image(systemName: "list.number")
                .font(.system(size: 48))
                .foregroundStyle(AppColors.gold.opacity(0.4))
            Text("Mock Draft")
                .font(.system(size: 18, weight: .semibold, design: .rounded))
                .foregroundStyle(AppColors.textSecondary)
            Text("Coming Soon")
                .font(.system(size: 14, design: .rounded))
                .foregroundStyle(AppColors.textTertiary)
            Spacer()
        }
    }
}

// MARK: - Teams List View

struct TeamsListView: View {
    @Environment(SportSelection.self) private var sportSelection
    @State private var teams: [Team] = []
    @State private var isLoading = true

    private let columns = Array(repeating: GridItem(.flexible(), spacing: 12), count: 4)

    var body: some View {
        ScrollView {
            if isLoading {
                ProgressView()
                    .padding(.top, 60)
            } else if teams.isEmpty {
                ContentUnavailableView("No Teams", systemImage: "person.3",
                    description: Text("No teams available for this sport."))
            } else {
                LazyVGrid(columns: columns, spacing: 16) {
                    ForEach(teams) { team in
                        VStack(spacing: 6) {
                            AsyncImage(url: team.logoURL) { image in
                                image.resizable().scaledToFit()
                            } placeholder: {
                                Circle()
                                    .fill(Color(hex: team.primaryColor).opacity(0.25))
                                    .overlay {
                                        Text(String(team.shortName.prefix(3)))
                                            .font(.system(size: 11, weight: .bold))
                                            .foregroundStyle(Color(hex: team.primaryColor))
                                    }
                            }
                            .frame(width: 48, height: 48)

                            Text(team.shortName)
                                .font(.system(size: 10, weight: .medium, design: .rounded))
                                .foregroundStyle(AppColors.textSecondary)
                                .lineLimit(1)
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.top, 12)
            }
        }
        .task(id: sportSelection.current) {
            isLoading = true
            teams = await fetchTeams(for: sportSelection.current)
            isLoading = false
        }
    }

    private func fetchTeams(for sport: Sport) async -> [Team] {
        let sportParam = sport == .all ? "soccer" : sport.apiValue
        guard let url = URL(string: "https://scorespark.vercel.app/api/v1/standings/\(sportParam == "soccer" ? "epl" : sportParam == "nba" ? "nba-east" : sportParam == "nfl" ? "nfl-afc" : sportParam == "nhl" ? "nhl" : "mlb-al")") else {
            return MockDataService.allTeams(for: sport)
        }

        do {
            let response = try await APIService.shared.fetchStandings(league: sportParam == "soccer" ? "epl" : sportParam == "nba" ? "nba-east" : sportParam == "nfl" ? "nfl-afc" : sportParam == "nhl" ? "nhl" : "mlb-al")
            return response.rows.map { $0.toStanding().team }
        } catch {
            return MockDataService.allTeams(for: sport)
        }
    }
}

// MARK: - News List View

struct NewsListView: View {
    @Environment(SportSelection.self) private var sportSelection
    @State private var articles: [NewsArticle] = []
    @State private var isLoading = true

    var body: some View {
        ScrollView {
            if isLoading {
                ProgressView()
                    .padding(.top, 60)
            } else if articles.isEmpty {
                ContentUnavailableView("No News", systemImage: "newspaper",
                    description: Text("No news available right now."))
            } else {
                LazyVStack(spacing: 0) {
                    ForEach(articles) { article in
                        Link(destination: article.url) {
                            HStack(spacing: 12) {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(article.title)
                                        .font(.system(size: 14, weight: .medium, design: .rounded))
                                        .foregroundStyle(AppColors.textPrimary)
                                        .lineLimit(2)
                                        .multilineTextAlignment(.leading)
                                    HStack(spacing: 4) {
                                        Text(article.source)
                                            .font(.system(size: 11))
                                            .foregroundStyle(AppColors.textTertiary)
                                        Text("·")
                                            .font(.system(size: 11))
                                            .foregroundStyle(AppColors.textTertiary)
                                        Text(article.timeAgo)
                                            .font(.system(size: 11))
                                            .foregroundStyle(AppColors.textTertiary)
                                    }
                                }
                                Spacer()
                                if let imageURL = article.imageURL {
                                    AsyncImage(url: imageURL) { image in
                                        image.resizable().scaledToFill()
                                    } placeholder: {
                                        RoundedRectangle(cornerRadius: 8)
                                            .fill(AppColors.surface)
                                    }
                                    .frame(width: 80, height: 56)
                                    .clipShape(RoundedRectangle(cornerRadius: 8))
                                }
                            }
                            .padding(.horizontal, 16)
                            .padding(.vertical, 12)
                        }

                        Rectangle()
                            .fill(Color.white.opacity(0.04))
                            .frame(height: 0.33)
                            .padding(.horizontal, 16)
                    }
                }
            }
        }
        .task(id: sportSelection.current) {
            isLoading = true
            articles = await fetchNews(for: sportSelection.current)
            isLoading = false
        }
    }

    private func fetchNews(for sport: Sport) async -> [NewsArticle] {
        let sportParam = sport == .all ? "soccer" : sport.apiValue
        guard let url = URL(string: "https://scorespark.vercel.app/api/v1/news?sport=\(sportParam)") else { return [] }

        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            let response = try JSONDecoder().decode(NewsResponse.self, from: data)
            return response.articles
        } catch {
            return []
        }
    }
}

// MARK: - News Models

struct NewsResponse: Codable {
    let articles: [NewsArticle]
}

struct NewsArticle: Codable, Identifiable {
    let id: String
    let title: String
    let source: String
    let url: URL
    let imageUrl: String?
    let timeAgo: String

    var imageURL: URL? {
        guard let imageUrl else { return nil }
        return URL(string: imageUrl)
    }
}
