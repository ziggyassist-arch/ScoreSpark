import SwiftUI

/// Top-level content tabs shown above each sport's content
enum ContentTab: Int, CaseIterable {
    case leagues, standings, teams, news, following

    var title: String {
        switch self {
        case .leagues: "Scores"
        case .standings: "Standings"
        case .teams: "Teams"
        case .news: "News"
        case .following: "Following"
        }
    }
}

struct MainTabView: View {
    @Environment(SportSelection.self) private var sportSelection
    @State private var selectedContentTab: ContentTab = .leagues
    @State private var showSettings = false
    @State private var showSearch = false
    @State private var showMenu = false
    @State private var searchText = ""

    var body: some View {
        ZStack(alignment: .trailing) {
            NavigationStack {
                VStack(spacing: 0) {
                    headerBar
                    contentTabBar

                    Group {
                        switch selectedContentTab {
                        case .leagues:
                            HomeView()
                        case .standings:
                            StandingsView()
                        case .teams:
                            TeamsListView()
                        case .news:
                            NewsListView()
                        case .following:
                            FavoritesView()
                        }
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .clipped()
                }
                .background(AppColors.background)
                .ignoresSafeArea(.container, edges: .bottom)
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
                .sheet(isPresented: $showSearch) {
                    searchSheet
                }
            }

            // Hamburger menu overlay
            if showMenu {
                Color.black.opacity(0.5)
                    .ignoresSafeArea()
                    .onTapGesture { withAnimation(.easeOut(duration: 0.25)) { showMenu = false } }

                menuDrawer
                    .transition(.move(edge: .trailing))
            }
        }
        .animation(.easeOut(duration: 0.25), value: showMenu)
    }

    // MARK: - Header Bar (compact 32pt)

    private var headerBar: some View {
        HStack {
            HStack(spacing: 0) {
                Text("Score")
                    .font(.system(size: 16, weight: .bold, design: .rounded))
                    .foregroundStyle(.white)
                Image(systemName: "bolt.fill")
                    .font(.system(size: 9, weight: .bold))
                    .foregroundStyle(Color(hex: "F5C518"))
                    .padding(.horizontal, 1)
                Text("Spark")
                    .font(.system(size: 16, weight: .bold, design: .rounded))
                    .foregroundStyle(Color(hex: "9DCAED"))
            }
            Spacer()
            HStack(spacing: 12) {
                Button { showSearch = true } label: {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 13, weight: .medium))
                        .foregroundStyle(AppColors.textSecondary)
                }
                Button { showSettings = true } label: {
                    Image(systemName: "gearshape")
                        .font(.system(size: 13, weight: .medium))
                        .foregroundStyle(AppColors.textSecondary)
                }
                Button { showMenu = true } label: {
                    Image(systemName: "line.3.horizontal")
                        .font(.system(size: 13, weight: .medium))
                        .foregroundStyle(AppColors.textSecondary)
                }
            }
        }
        .padding(.horizontal, 6)
        .frame(height: 28)
    }

    // MARK: - Search Sheet

    private var searchSheet: some View {
        NavigationStack {
            VStack(spacing: 0) {
                if searchText.isEmpty {
                    VStack(spacing: 8) {
                        Spacer()
                        Image(systemName: "magnifyingglass")
                            .font(.system(size: 32))
                            .foregroundStyle(AppColors.textTertiary)
                        Text("Search teams, leagues, or matches")
                            .font(.system(size: 13, design: .rounded))
                            .foregroundStyle(AppColors.textTertiary)
                        Spacer()
                    }
                } else {
                    Text("Search results for \"\(searchText)\"")
                        .font(.system(size: 13, design: .rounded))
                        .foregroundStyle(AppColors.textTertiary)
                        .padding(12)
                    Spacer()
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(AppColors.background)
            .navigationTitle("Search")
            .toolbarTitleDisplayMode(.inline)
            .searchable(text: $searchText, prompt: "Teams, leagues, matches...")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Done") { showSearch = false }
                        .foregroundStyle(AppColors.gold)
                }
            }
        }
        .presentationDetents([.large])
        .presentationDragIndicator(.visible)
    }

    // MARK: - Hamburger Menu Drawer

    private var menuDrawer: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Header
            HStack {
                HStack(spacing: 0) {
                    Text("Score")
                        .font(.system(size: 14, weight: .bold, design: .rounded))
                        .foregroundStyle(.white)
                    Image(systemName: "bolt.fill")
                        .font(.system(size: 8, weight: .bold))
                        .foregroundStyle(Color(hex: "F5C518"))
                    Text("Spark")
                        .font(.system(size: 14, weight: .bold, design: .rounded))
                        .foregroundStyle(Color(hex: "9DCAED"))
                }
                Spacer()
                Button { withAnimation { showMenu = false } } label: {
                    Image(systemName: "xmark")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundStyle(AppColors.textSecondary)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)

            Rectangle().fill(Color.white.opacity(0.06)).frame(height: 0.5)

            // Menu items
            menuItem(icon: "star.fill", label: "Favorites", color: AppColors.gold) {
                showMenu = false
                selectedContentTab = .following
            }
            menuItem(icon: "gearshape.fill", label: "Settings", color: AppColors.textSecondary) {
                showMenu = false
                showSettings = true
            }
            menuItem(icon: "bell.fill", label: "Notifications", color: AppColors.textSecondary) {
                showMenu = false
            }
            menuItem(icon: "moon.fill", label: "Dark Mode", color: AppColors.textSecondary) {
                // Already dark
            }

            Rectangle().fill(Color.white.opacity(0.06)).frame(height: 0.5).padding(.vertical, 4)

            menuItem(icon: "info.circle.fill", label: "About ScoreSpark", color: AppColors.textSecondary) {
                showMenu = false
            }
            menuItem(icon: "envelope.fill", label: "Send Feedback", color: AppColors.textSecondary) {
                showMenu = false
            }

            Spacer()

            Text("v1.0.0")
                .font(.system(size: 10, design: .rounded))
                .foregroundStyle(AppColors.textTertiary)
                .padding(.horizontal, 16)
                .padding(.bottom, 8)
        }
        .frame(width: 260)
        .frame(maxHeight: .infinity)
        .background(AppColors.surface)
        .ignoresSafeArea(edges: .vertical)
    }

    private func menuItem(icon: String, label: String, color: Color, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: 10) {
                Image(systemName: icon)
                    .font(.system(size: 13))
                    .foregroundStyle(color)
                    .frame(width: 20)
                Text(label)
                    .font(.system(size: 14, weight: .medium, design: .rounded))
                    .foregroundStyle(AppColors.textPrimary)
                Spacer()
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }

    // MARK: - Content Tab Bar (compact 26pt)

    private var contentTabBar: some View {
        HStack(spacing: 0) {
            ForEach(ContentTab.allCases, id: \.rawValue) { tab in
                Button {
                    withAnimation(.easeInOut(duration: 0.2)) {
                        selectedContentTab = tab
                    }
                } label: {
                    VStack(spacing: 2) {
                        Text(tab.title)
                            .font(.system(size: 11, weight: selectedContentTab == tab ? .semibold : .regular, design: .rounded))
                            .foregroundStyle(selectedContentTab == tab ? AppColors.gold : AppColors.textTertiary)
                        Rectangle()
                            .fill(selectedContentTab == tab ? AppColors.gold : Color.clear)
                            .frame(height: 1.5)
                    }
                }
                .frame(maxWidth: .infinity)
            }
        }
        .padding(.horizontal, 2)
        .frame(height: 24)
        .background(AppColors.background)
    }

    // MARK: - Sport Tab Bar (bottom, compact)

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
                    VStack(spacing: 1) {
                        if let url = sportLogoURL(sport) {
                            AsyncImage(url: url) { image in
                                image.resizable().scaledToFit()
                            } placeholder: {
                                Text(sport.emoji)
                                    .font(.system(size: 13))
                            }
                            .frame(width: 18, height: 18)
                            .opacity(isSelected ? 1 : 0.4)
                        }
                        Text(sport == .soccer ? "Soccer" : sport.rawValue)
                            .font(.system(size: 8, weight: .semibold, design: .rounded))
                            .foregroundStyle(isSelected ? Color(hex: sport.accentColor) : AppColors.textTertiary)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 2)
                }
            }
        }
        .padding(.horizontal, 0)
        .padding(.bottom, 0)
        .background(
            Rectangle()
                .fill(AppColors.background)
                .shadow(color: .black.opacity(0.4), radius: 2, y: -1)
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
}

// MARK: - Teams List View

struct TeamsListView: View {
    @Environment(SportSelection.self) private var sportSelection
    @State private var teams: [Team] = []
    @State private var isLoading = true

    private let columns = Array(repeating: GridItem(.flexible(), spacing: 8), count: 4)

    var body: some View {
        ScrollView {
            if isLoading {
                ProgressView()
                    .tint(AppColors.gold)
                    .padding(.top, 20)
            } else if teams.isEmpty {
                ContentUnavailableView("No Teams", systemImage: "person.3",
                    description: Text("No teams available for this sport."))
            } else {
                LazyVGrid(columns: columns, spacing: 8) {
                    ForEach(teams) { team in
                        VStack(spacing: 3) {
                            AsyncImage(url: team.logoURL) { image in
                                image.resizable().scaledToFit()
                            } placeholder: {
                                Circle()
                                    .fill(Color(hex: team.primaryColor).opacity(0.25))
                                    .overlay {
                                        Text(String(team.shortName.prefix(3)))
                                            .font(.system(size: 10, weight: .bold))
                                            .foregroundStyle(Color(hex: team.primaryColor))
                                    }
                            }
                            .frame(width: 36, height: 36)

                            Text(team.shortName)
                                .font(.system(size: 9, weight: .medium, design: .rounded))
                                .foregroundStyle(AppColors.textSecondary)
                                .lineLimit(1)
                        }
                    }
                }
                .padding(.horizontal, 8)
                .padding(.top, 4)
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
        let leagueKey = sportParam == "soccer" ? "epl"
            : sportParam == "nba" ? "nba-east"
            : sportParam == "nfl" ? "nfl-afc"
            : sportParam == "nhl" ? "nhl"
            : "mlb-al"

        do {
            let response = try await APIService.shared.fetchStandings(league: leagueKey)
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
    @State private var hasError = false

    var body: some View {
        ScrollView {
            if isLoading {
                ProgressView()
                    .tint(AppColors.gold)
                    .padding(.top, 20)
            } else if articles.isEmpty {
                VStack(spacing: 6) {
                    Spacer().frame(height: 16)
                    Image(systemName: hasError ? "wifi.slash" : "newspaper")
                        .font(.system(size: 28))
                        .foregroundStyle(AppColors.textTertiary)
                    Text(hasError ? "Couldn't Load News" : "No News")
                        .font(.system(size: 14, weight: .semibold, design: .rounded))
                        .foregroundStyle(AppColors.textSecondary)
                    Text(hasError ? "Check your connection and try again." : "No news available right now.")
                        .font(.system(size: 12, design: .rounded))
                        .foregroundStyle(AppColors.textTertiary)
                    if hasError {
                        Button {
                            Task {
                                isLoading = true
                                let result = await fetchNews(for: sportSelection.current)
                                articles = result.articles
                                hasError = result.error
                                isLoading = false
                            }
                        } label: {
                            Text("Retry")
                                .font(.system(size: 13, weight: .semibold, design: .rounded))
                                .foregroundStyle(AppColors.darkNavy)
                                .padding(.horizontal, 16)
                                .padding(.vertical, 6)
                                .background(AppColors.gold, in: Capsule())
                        }
                        .padding(.top, 2)
                    }
                }
            } else {
                LazyVStack(spacing: 0) {
                    ForEach(articles) { article in
                        Link(destination: article.url) {
                            HStack(spacing: 10) {
                                VStack(alignment: .leading, spacing: 3) {
                                    Text(article.title)
                                        .font(.system(size: 13, weight: .medium, design: .rounded))
                                        .foregroundStyle(AppColors.textPrimary)
                                        .lineLimit(2)
                                        .multilineTextAlignment(.leading)
                                    HStack(spacing: 4) {
                                        Text(article.source)
                                            .font(.system(size: 10, design: .rounded))
                                            .foregroundStyle(AppColors.textTertiary)
                                        Text("·")
                                            .font(.system(size: 10))
                                            .foregroundStyle(AppColors.textTertiary)
                                        Text(article.timeAgo)
                                            .font(.system(size: 10, design: .rounded))
                                            .foregroundStyle(AppColors.textTertiary)
                                    }
                                }
                                Spacer()
                                if let imageURL = article.imageURL {
                                    AsyncImage(url: imageURL) { image in
                                        image.resizable().scaledToFill()
                                    } placeholder: {
                                        RoundedRectangle(cornerRadius: 6)
                                            .fill(AppColors.surface)
                                            .overlay {
                                                Image(systemName: "photo")
                                                    .font(.system(size: 14))
                                                    .foregroundStyle(AppColors.textTertiary.opacity(0.5))
                                            }
                                    }
                                    .frame(width: 72, height: 48)
                                    .clipShape(RoundedRectangle(cornerRadius: 6))
                                }
                            }
                            .padding(.horizontal, 12)
                            .padding(.vertical, 8)
                        }

                        Rectangle()
                            .fill(Color.white.opacity(0.04))
                            .frame(height: 0.33)
                            .padding(.horizontal, 12)
                    }
                }
            }
        }
        .task(id: sportSelection.current) {
            isLoading = true
            let result = await fetchNews(for: sportSelection.current)
            articles = result.articles
            hasError = result.error
            isLoading = false
        }
    }

    private func fetchNews(for sport: Sport) async -> (articles: [NewsArticle], error: Bool) {
        let sportParam = sport == .all ? "soccer" : sport.apiValue
        guard let url = URL(string: "https://scorespark.vercel.app/api/v1/news?sport=\(sportParam)") else {
            return ([], true)
        }

        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            let response = try JSONDecoder().decode(NewsResponse.self, from: data)
            return (response.articles, false)
        } catch {
            return ([], true)
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
