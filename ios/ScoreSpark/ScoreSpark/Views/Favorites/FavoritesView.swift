import SwiftUI

struct FavoritesView: View {
    @State private var viewModel = FavoritesViewModel()

    private let columns = Array(repeating: GridItem(.flexible(), spacing: 12), count: 4)

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // My starred teams
                if !viewModel.favoriteTeams.isEmpty {
                    SectionHeader(title: "My Teams", icon: "star.fill")
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 12) {
                            ForEach(viewModel.favoriteTeams) { team in
                                VStack(spacing: 6) {
                                    ZStack(alignment: .topTrailing) {
                                        Circle()
                                            .fill(Color(hex: team.primaryColor).opacity(0.3))
                                            .frame(width: 56, height: 56)
                                            .overlay {
                                                Text(team.shortName)
                                                    .font(.system(size: 14, weight: .bold, design: .rounded))
                                                    .foregroundStyle(Color(hex: team.primaryColor))
                                            }
                                        Image(systemName: "star.fill")
                                            .font(.system(size: 10))
                                            .foregroundStyle(AppColors.gold)
                                            .offset(x: 4, y: -4)
                                    }
                                    Text(team.shortName)
                                        .font(AppTypography.caption)
                                        .foregroundStyle(AppColors.textSecondary)
                                }
                                .onTapGesture { viewModel.toggleFavorite(team) }
                            }
                        }
                        .padding(.horizontal)
                    }
                }

                // Followed matches
                if !viewModel.favoriteMatches.isEmpty {
                    SectionHeader(title: "Followed Matches", icon: "bell.fill")
                    ForEach(viewModel.favoriteMatches) { match in
                        MatchCard(match: match)
                            .padding(.horizontal)
                    }
                }

                // Browse teams by sport
                SectionHeader(title: "Browse Teams", icon: "magnifyingglass")

                // Sport selector
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(Sport.sports) { sport in
                            let isSelected = viewModel.browseSport == sport
                            Button {
                                withAnimation(.snappy) {
                                    viewModel.updateBrowseSport(sport)
                                }
                            } label: {
                                HStack(spacing: 4) {
                                    Text(sport.emoji)
                                        .font(.system(size: 13))
                                    Text(sport.rawValue)
                                        .font(.system(size: 12, weight: .semibold, design: .rounded))
                                }
                                .foregroundStyle(isSelected ? AppColors.darkNavy : AppColors.textSecondary)
                                .padding(.horizontal, 12)
                                .padding(.vertical, 6)
                                .background(
                                    isSelected ? Color(hex: sport.accentColor) : AppColors.surface,
                                    in: Capsule()
                                )
                            }
                        }
                    }
                    .padding(.horizontal)
                }

                // Team grid
                LazyVGrid(columns: columns, spacing: 16) {
                    ForEach(viewModel.browseTeams) { team in
                        Button {
                            withAnimation(.snappy) { viewModel.toggleFavorite(team) }
                        } label: {
                            VStack(spacing: 6) {
                                ZStack(alignment: .topTrailing) {
                                    Circle()
                                        .fill(Color(hex: team.primaryColor).opacity(0.25))
                                        .frame(width: 52, height: 52)
                                        .overlay {
                                            Text(String(team.shortName.prefix(3)))
                                                .font(.system(size: 13, weight: .bold, design: .rounded))
                                                .foregroundStyle(Color(hex: team.primaryColor))
                                        }
                                    if viewModel.isFavorite(team) {
                                        Image(systemName: "star.fill")
                                            .font(.system(size: 10))
                                            .foregroundStyle(AppColors.gold)
                                            .offset(x: 2, y: -2)
                                    }
                                }
                                Text(team.shortName)
                                    .font(.system(size: 10, weight: .medium, design: .rounded))
                                    .foregroundStyle(AppColors.textSecondary)
                                    .lineLimit(1)
                            }
                        }
                    }
                }
                .padding(.horizontal)
            }
            .padding(.vertical)
        }
        .background(AppColors.background)
        .navigationTitle("Favorites")
        .toolbarTitleDisplayMode(.large)
        .task { await viewModel.load() }
    }
}
