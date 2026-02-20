import SwiftUI

enum AppTab: Int, CaseIterable {
    case matches, news, leagues, following

    var title: String {
        switch self {
        case .matches: "Matches"
        case .news: "News"
        case .leagues: "Leagues"
        case .following: "Following"
        }
    }
}

struct MainTabView: View {
    @State private var selectedTab: AppTab = .matches
    @State private var selectedDateOffset: Int = 0
    @State private var showSettings = false

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                headerBar
                tabBar

                Group {
                    switch selectedTab {
                    case .matches:
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

                if selectedTab == .matches {
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

    // MARK: - Header Bar (44pt, logo left, icons right)

    private var headerBar: some View {
        HStack {
            Image("Logo")
                .resizable()
                .scaledToFit()
                .frame(height: 24)
            Spacer()
            HStack(spacing: 16) {
                Button {} label: {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: 16, weight: .medium))
                        .foregroundStyle(AppColors.textSecondary)
                }
                Button { showSettings = true } label: {
                    Image(systemName: "line.3.horizontal")
                        .font(.system(size: 16, weight: .medium))
                        .foregroundStyle(AppColors.textSecondary)
                }
            }
        }
        .padding(.horizontal, 16)
        .frame(height: 44)
    }

    // MARK: - Tab Bar (36pt, small text, colored underline)

    private var tabBar: some View {
        HStack(spacing: 0) {
            ForEach(AppTab.allCases, id: \.rawValue) { tab in
                Button {
                    withAnimation(.easeInOut(duration: 0.2)) {
                        selectedTab = tab
                    }
                } label: {
                    VStack(spacing: 4) {
                        Text(tab.title)
                            .font(.system(size: 13, weight: selectedTab == tab ? .semibold : .regular))
                            .foregroundStyle(selectedTab == tab ? .white : AppColors.textTertiary)
                        Rectangle()
                            .fill(selectedTab == tab ? Color(hex: "22C55E") : Color.clear)
                            .frame(height: 2)
                    }
                }
                .frame(maxWidth: .infinity)
            }
        }
        .padding(.horizontal, 16)
        .frame(height: 36)
    }

    // MARK: - Date Bar (bottom, 44pt)

    private var dateBar: some View {
        VStack(spacing: 0) {
            Rectangle()
                .fill(Color.white.opacity(0.08))
                .frame(height: 0.33)
            HStack(spacing: 0) {
                Button {
                    withAnimation(.easeInOut(duration: 0.2)) { selectedDateOffset = -1 }
                } label: {
                    Image(systemName: "chevron.left")
                        .font(.system(size: 11, weight: .medium))
                        .foregroundStyle(AppColors.textTertiary)
                }
                .frame(width: 32)

                dateLabel("Yesterday", offset: -1)
                dateLabel("Today", offset: 0)
                dateLabel("Tomorrow", offset: 1)

                Button {
                    withAnimation(.easeInOut(duration: 0.2)) { selectedDateOffset = 1 }
                } label: {
                    Image(systemName: "chevron.right")
                        .font(.system(size: 11, weight: .medium))
                        .foregroundStyle(AppColors.textTertiary)
                }
                .frame(width: 32)
            }
            .frame(height: 44)
        }
        .background(AppColors.background)
    }

    private func dateLabel(_ title: String, offset: Int) -> some View {
        Button {
            withAnimation(.easeInOut(duration: 0.2)) {
                selectedDateOffset = offset
            }
        } label: {
            Text(title)
                .font(.system(size: 13, weight: selectedDateOffset == offset ? .bold : .regular))
                .foregroundStyle(selectedDateOffset == offset ? .white : AppColors.textTertiary)
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
                            .font(.system(size: 14))
                        Text(sport.rawValue)
                            .font(.system(size: 13, weight: .bold))
                            .foregroundStyle(Color(hex: sport.accentColor))
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 8)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(AppColors.surface.opacity(0.3))

                    ForEach(MockDataService.leagues(for: sport)) { league in
                        HStack {
                            Text(league.name)
                                .font(.system(size: 13))
                                .foregroundStyle(AppColors.textPrimary)
                            Spacer()
                            Text(league.country)
                                .font(.system(size: 11))
                                .foregroundStyle(AppColors.textTertiary)
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)

                        Rectangle()
                            .fill(Color.white.opacity(0.04))
                            .frame(height: 0.33)
                            .padding(.horizontal, 16)
                    }
                }
            }
        }
    }
}
