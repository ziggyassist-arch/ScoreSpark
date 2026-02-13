import SwiftUI

struct FavoritesView: View {
    @State private var viewModel = FavoritesViewModel()

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                if viewModel.favoriteTeams.isEmpty && viewModel.favoriteMatches.isEmpty {
                    ContentUnavailableView(
                        "No Favorites Yet",
                        systemImage: "star",
                        description: Text("Add teams and matches to your favorites to see them here.")
                    )
                } else {
                    // Favorite Teams
                    if !viewModel.favoriteTeams.isEmpty {
                        SectionHeader(title: "My Teams", icon: "heart.fill")
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 12) {
                                ForEach(viewModel.favoriteTeams) { team in
                                    VStack(spacing: 8) {
                                        Circle()
                                            .fill(AppColors.surface)
                                            .frame(width: 60, height: 60)
                                            .overlay {
                                                Text(team.shortName)
                                                    .font(AppTypography.headline)
                                                    .foregroundStyle(AppColors.accent)
                                            }
                                        Text(team.shortName)
                                            .font(AppTypography.caption)
                                            .foregroundStyle(AppColors.textSecondary)
                                    }
                                }
                            }
                            .padding(.horizontal)
                        }
                    }

                    // Favorite Matches
                    if !viewModel.favoriteMatches.isEmpty {
                        SectionHeader(title: "Followed Matches", icon: "bell.fill")
                        ForEach(viewModel.favoriteMatches) { match in
                            MatchCard(match: match)
                                .padding(.horizontal)
                        }
                    }
                }
            }
            .padding(.vertical)
        }
        .background(AppColors.background)
        .navigationTitle("Favorites")
        .toolbarTitleDisplayMode(.large)
        .task { await viewModel.load() }
    }
}
