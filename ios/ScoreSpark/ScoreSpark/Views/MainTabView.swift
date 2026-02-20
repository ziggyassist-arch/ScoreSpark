import SwiftUI

enum AppTab: Int, CaseIterable {
    case games, news, leagues, following

    var title: String {
        switch self {
        case .games: "Games"
        case .news: "News"
        case .leagues: "Leagues"
        case .following: "Following"
        }
    }
}

struct MainTabView: View {
    @State private var selectedTab: AppTab = .games
    @State private var selectedDateOffset: Int = 0
    @State private var showSettings = false

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                topBar
                tabSelector

                Group {
                    switch selectedTab {
                    case .games:
                        HomeView()
                    case .news:
                        newsPlaceholder
                    case .leagues:
                        LeaguesListView()
                    case .following:
                        FavoritesView()
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)

                if selectedTab == .games {
                    dateBar
                }
            }
            .background(AppColors.background)
            .toolbar(.hidden, for: .navigationBar)
            .navigationDestination(for: String.self) { matchId in
                MatchDetailView(matchId: matchId)
            }
            .navigationDestination(isPresented: $showSettings) {
                SettingsView()
            }
        }
    }

    // MARK: - Top Bar

    private var topBar: some View {
        HStack {
            Image("Logo")
                .resizable()
                .scaledToFit()
                .frame(height: 28)
            Spacer()
            Button { showSettings = true } label: {
                Image(systemName: "gearshape")
                    .font(.system(size: 20, weight: .medium))
                    .foregroundStyle(AppColors.textPrimary)
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
    }

    // MARK: - Tab Selector

    private var tabSelector: some View {
        HStack(spacing: 0) {
            ForEach(AppTab.allCases, id: \.rawValue) { tab in
                Button {
                    withAnimation(.easeInOut(duration: 0.2)) {
                        selectedTab = tab
                    }
                } label: {
                    VStack(spacing: 6) {
                        Text(tab.title)
                            .font(.system(size: 15, weight: selectedTab == tab ? .bold : .medium))
                            .foregroundStyle(selectedTab == tab ? AppColors.textPrimary : AppColors.textTertiary)
                        Rectangle()
                            .fill(selectedTab == tab ? AppColors.gold : Color.clear)
                            .frame(height: 2)
                    }
                }
                .frame(maxWidth: .infinity)
            }
        }
        .padding(.horizontal, 16)
    }

    // MARK: - Date Bar

    private var dateBar: some View {
        VStack(spacing: 0) {
            Rectangle()
                .fill(AppColors.surface)
                .frame(height: 0.5)
            HStack(spacing: 0) {
                dateButton("Yesterday", offset: -1)
                dateButton("Today", offset: 0)
                dateButton("Tomorrow", offset: 1)
            }
            .padding(.vertical, 12)
        }
        .background(AppColors.background)
    }

    private func dateButton(_ title: String, offset: Int) -> some View {
        Button {
            withAnimation(.easeInOut(duration: 0.2)) {
                selectedDateOffset = offset
            }
        } label: {
            Text(title)
                .font(.system(size: 14, weight: selectedDateOffset == offset ? .bold : .regular))
                .foregroundStyle(selectedDateOffset == offset ? AppColors.textPrimary : AppColors.textTertiary)
                .frame(maxWidth: .infinity)
        }
    }

    // MARK: - News Placeholder

    private var newsPlaceholder: some View {
        VStack(spacing: 12) {
            Spacer()
            Image(systemName: "newspaper")
                .font(.system(size: 48))
                .foregroundStyle(AppColors.textTertiary)
            Text("Coming Soon")
                .font(.system(size: 18, weight: .semibold))
                .foregroundStyle(AppColors.textSecondary)
            Spacer()
        }
    }
}

// MARK: - Leagues List View

struct LeaguesListView: View {
    var body: some View {
        ScrollView {
            LazyVStack(alignment: .leading, spacing: 0) {
                ForEach(Sport.sports) { sport in
                    HStack(spacing: 6) {
                        Text(sport.emoji)
                            .font(.system(size: 16))
                        Text(sport.rawValue)
                            .font(.system(size: 15, weight: .bold))
                            .foregroundStyle(Color(hex: sport.accentColor))
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 10)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(AppColors.surface.opacity(0.3))

                    ForEach(MockDataService.leagues(for: sport)) { league in
                        HStack {
                            Text(league.name)
                                .font(.system(size: 15))
                                .foregroundStyle(AppColors.textPrimary)
                            Spacer()
                            Text(league.country)
                                .font(.system(size: 13))
                                .foregroundStyle(AppColors.textTertiary)
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 12)

                        Divider()
                            .overlay(Color.white.opacity(0.06))
                            .padding(.horizontal, 16)
                    }
                }
            }
        }
    }
}
