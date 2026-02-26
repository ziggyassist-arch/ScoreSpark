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
                .background(AppColors.screenBackground)
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

    // MARK: - Header Bar (50pt below status bar, FotMob style)

    private var headerBar: some View {
        HStack(spacing: 12) {
            // Logo/wordmark left-aligned
            Text("ScoreSpark")
                .font(.system(size: 22, weight: .bold))
                .foregroundStyle(.white)

            Spacer()

            // Capsule buttons right side
            HStack(spacing: 8) {
                Button { showSearch = true } label: {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundStyle(.white)
                        .frame(width: 36, height: 36)
                        .background(AppColors.elevated, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
                }
                Button { showSettings = true } label: {
                    Image(systemName: "gearshape")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundStyle(.white)
                        .frame(width: 36, height: 36)
                        .background(AppColors.elevated, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
                }
                Button { withAnimation { showMenu = true } } label: {
                    Image(systemName: "line.3.horizontal")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundStyle(.white)
                        .frame(width: 36, height: 36)
                        .background(AppColors.elevated, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
                }
            }
        }
        .padding(.horizontal, 16)
        .frame(height: 50)
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
                            .foregroundStyle(AppColors.textSecondary)
                        Text("Search teams, leagues, or matches")
                            .font(.system(size: 14))
                            .foregroundStyle(AppColors.textSecondary)
                        Spacer()
                    }
                } else {
                    Text("Search results for \"\(searchText)\"")
                        .font(.system(size: 14))
                        .foregroundStyle(AppColors.textSecondary)
                        .padding(16)
                    Spacer()
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(AppColors.screenBackground)
            .navigationTitle("Search")
            .toolbarTitleDisplayMode(.inline)
            .searchable(text: $searchText, prompt: "Teams, leagues, matches...")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Done") { showSearch = false }
                        .foregroundStyle(AppColors.accent)
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
                Text("ScoreSpark")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundStyle(.white)
                Spacer()
                Button { withAnimation { showMenu = false } } label: {
                    Image(systemName: "xmark")
                        .font(.system(size: 15, weight: .medium))
                        .foregroundStyle(AppColors.textSecondary)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 14)

            Rectangle().fill(AppColors.separator).frame(height: 0.5)

            // Menu items
            menuItem(icon: "star.fill", label: "Favorites", color: AppColors.accent) {
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

            Rectangle().fill(AppColors.separator).frame(height: 0.5).padding(.vertical, 4)

            menuItem(icon: "info.circle.fill", label: "About ScoreSpark", color: AppColors.textSecondary) {
                showMenu = false
            }
            menuItem(icon: "envelope.fill", label: "Send Feedback", color: AppColors.textSecondary) {
                showMenu = false
            }

            Spacer()

            Text("v1.0.0")
                .font(.system(size: 11))
                .foregroundStyle(AppColors.textSecondary)
                .padding(.horizontal, 16)
                .padding(.bottom, 8)
        }
        .frame(width: 260)
        .frame(maxHeight: .infinity)
        .background(AppColors.cardBackground)
        .ignoresSafeArea(edges: .vertical)
    }

    private func menuItem(icon: String, label: String, color: Color, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.system(size: 15))
                    .foregroundStyle(color)
                    .frame(width: 24)
                Text(label)
                    .font(.system(size: 15, weight: .medium))
                    .foregroundStyle(AppColors.textPrimary)
                Spacer()
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }

    // MARK: - Content Tab Bar (FotMob style)

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
                            .font(.system(size: 13, weight: selectedContentTab == tab ? .semibold : .regular))
                            .foregroundStyle(selectedContentTab == tab ? .white : AppColors.textSecondary)
                        Rectangle()
                            .fill(selectedContentTab == tab ? AppColors.accent : Color.clear)
                            .frame(height: 2)
                    }
                }
                .frame(maxWidth: .infinity)
            }
        }
        .padding(.horizontal, 4)
        .frame(height: 40)
        .background(AppColors.screenBackground)
    }

    // MARK: - Sport Tab Bar (bottom, 49pt + safe area, FotMob style)

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
                    VStack(spacing: 2) {
                        ZStack {
                            // Selected pill background (72x48, 16pt radius, 15% green)
                            if isSelected {
                                RoundedRectangle(cornerRadius: 16, style: .continuous)
                                    .fill(AppColors.accent.opacity(0.15))
                                    .frame(width: 72, height: 48)
                            }

                            VStack(spacing: 2) {
                                if let url = sportLogoURL(sport) {
                                    AsyncImage(url: url) { image in
                                        image.resizable().scaledToFit()
                                    } placeholder: {
                                        Text(sport.emoji)
                                            .font(.system(size: 16))
                                    }
                                    .frame(width: 24, height: 24)
                                    .opacity(isSelected ? 1 : 0.5)
                                }
                                Text(sport == .soccer ? "Soccer" : sport.rawValue)
                                    .font(.system(size: 10, weight: .medium))
                                    .foregroundStyle(isSelected ? AppColors.accent : AppColors.textSecondary)
                            }
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 4)
                }
            }
        }
        .frame(height: 49)
        .background(
            AppColors.cardBackground
                .shadow(color: .black.opacity(0.3), radius: 1, y: -0.5)
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

    private let columns = Array(repeating: GridItem(.flexible(), spacing: 12), count: 4)

    var body: some View {
        ScrollView {
            if isLoading {
                ProgressView()
                    .tint(AppColors.accent)
                    .padding(.top, 20)
            } else if teams.isEmpty {
                ContentUnavailableView("No Teams", systemImage: "person.3",
                    description: Text("No teams available for this sport."))
            } else {
                LazyVGrid(columns: columns, spacing: 16) {
                    ForEach(teams) { team in
                        VStack(spacing: 4) {
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
                            .frame(width: 40, height: 40)

                            Text(team.shortName)
                                .font(.system(size: 11, weight: .medium))
                                .foregroundStyle(AppColors.textSecondary)
                                .lineLimit(1)
                        }
                    }
                }
                .padding(16)
            }
        }
        .background(AppColors.screenBackground)
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
                    .tint(AppColors.accent)
                    .padding(.top, 20)
            } else if articles.isEmpty {
                VStack(spacing: 8) {
                    Spacer().frame(height: 20)
                    Image(systemName: hasError ? "wifi.slash" : "newspaper")
                        .font(.system(size: 28))
                        .foregroundStyle(AppColors.textSecondary)
                    Text(hasError ? "Couldn't Load News" : "No News")
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundStyle(AppColors.textPrimary)
                    Text(hasError ? "Check your connection and try again." : "No news available right now.")
                        .font(.system(size: 13))
                        .foregroundStyle(AppColors.textSecondary)
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
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundStyle(.white)
                                .padding(.horizontal, 16)
                                .padding(.vertical, 8)
                                .background(AppColors.accent, in: Capsule())
                        }
                        .padding(.top, 4)
                    }
                }
            } else {
                VStack(spacing: 0) {
                    ForEach(articles) { article in
                        Link(destination: article.url) {
                            HStack(spacing: 12) {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(article.title)
                                        .font(.system(size: 14, weight: .medium))
                                        .foregroundStyle(AppColors.textPrimary)
                                        .lineLimit(2)
                                        .multilineTextAlignment(.leading)
                                    HStack(spacing: 4) {
                                        Text(article.source)
                                            .font(.system(size: 11))
                                            .foregroundStyle(AppColors.textSecondary)
                                        Text("·")
                                            .font(.system(size: 11))
                                            .foregroundStyle(AppColors.textSecondary)
                                        Text(article.timeAgo)
                                            .font(.system(size: 11))
                                            .foregroundStyle(AppColors.textSecondary)
                                    }
                                }
                                Spacer()
                                if let imageURL = article.imageURL {
                                    AsyncImage(url: imageURL) { image in
                                        image.resizable().scaledToFill()
                                    } placeholder: {
                                        RoundedRectangle(cornerRadius: 8)
                                            .fill(AppColors.cardBackground)
                                            .overlay {
                                                Image(systemName: "photo")
                                                    .font(.system(size: 14))
                                                    .foregroundStyle(AppColors.textSecondary.opacity(0.5))
                                            }
                                    }
                                    .frame(width: 72, height: 48)
                                    .clipShape(RoundedRectangle(cornerRadius: 8))
                                }
                            }
                            .padding(.horizontal, 16)
                            .padding(.vertical, 10)
                        }

                        Rectangle()
                            .fill(AppColors.separator)
                            .frame(height: 0.5)
                            .padding(.leading, 16)
                    }
                }
                .background(AppColors.cardBackground)
                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                .padding(.horizontal, 10)
                .padding(.top, 8)
            }
        }
        .background(AppColors.screenBackground)
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
