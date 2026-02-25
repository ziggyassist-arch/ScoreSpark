import SwiftUI

struct FavoritesView: View {
    @State private var viewModel = FavoritesViewModel()

    private let columns = Array(repeating: GridItem(.flexible(), spacing: 8), count: 4)

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 10) {
                if viewModel.isLoading {
                    ProgressView()
                        .tint(AppColors.gold)
                        .frame(maxWidth: .infinity)
                        .padding(.top, 40)
                } else {
                    // My starred teams
                    if !viewModel.resolvedFavoriteTeams.isEmpty {
                        sectionHeader("My Teams", icon: "star.fill")

                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 10) {
                                ForEach(viewModel.resolvedFavoriteTeams) { team in
                                    VStack(spacing: 3) {
                                        ZStack(alignment: .topTrailing) {
                                            AsyncImage(url: team.logoURL) { image in
                                                image.resizable().scaledToFit()
                                            } placeholder: {
                                                Circle()
                                                    .fill(Color(hex: team.primaryColor).opacity(0.3))
                                                    .overlay {
                                                        Text(team.shortName)
                                                            .font(.system(size: 11, weight: .bold))
                                                            .foregroundStyle(Color(hex: team.primaryColor))
                                                    }
                                            }
                                            .frame(width: 40, height: 40)
                                            Image(systemName: "star.fill")
                                                .font(.system(size: 7))
                                                .foregroundStyle(AppColors.gold)
                                                .offset(x: 2, y: -2)
                                        }
                                        Text(team.shortName)
                                            .font(.system(size: 9, weight: .medium, design: .rounded))
                                            .foregroundStyle(AppColors.textTertiary)
                                    }
                                    .onTapGesture { viewModel.toggleFavorite(team) }
                                }
                            }
                            .padding(.horizontal, 12)
                        }
                    }

                    // Followed matches
                    if !viewModel.favoriteMatches.isEmpty {
                        sectionHeader("Upcoming & Recent", icon: "calendar")

                        LazyVStack(spacing: 0) {
                            ForEach(viewModel.favoriteMatches) { match in
                                NavigationLink(value: match.id) {
                                    FotMobMatchRow(match: match)
                                }
                                .buttonStyle(.plain)

                                Rectangle()
                                    .fill(Color.white.opacity(0.04))
                                    .frame(height: 0.33)
                                    .padding(.horizontal, 8)
                            }
                        }
                    }

                    // Empty state
                    if viewModel.resolvedFavoriteTeams.isEmpty && viewModel.favoriteMatches.isEmpty {
                        VStack(spacing: 8) {
                            Image(systemName: "star")
                                .font(.system(size: 32))
                                .foregroundStyle(AppColors.gold.opacity(0.4))
                            Text("No Favorites Yet")
                                .font(.system(size: 14, weight: .semibold, design: .rounded))
                                .foregroundStyle(AppColors.textSecondary)
                            Text("Star teams below to follow their matches")
                                .font(.system(size: 12, design: .rounded))
                                .foregroundStyle(AppColors.textTertiary)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                    }

                    // Browse teams
                    sectionHeader("Browse Teams", icon: "person.3")
                        .padding(.top, 4)

                    // Sport selector chips
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 5) {
                            ForEach(Sport.sports) { sport in
                                let isSelected = viewModel.browseSport == sport
                                Button {
                                    withAnimation(.snappy) {
                                        viewModel.updateBrowseSport(sport)
                                    }
                                } label: {
                                    HStack(spacing: 2) {
                                        Text(sport.emoji)
                                            .font(.system(size: 11))
                                        Text(sport.rawValue)
                                            .font(.system(size: 11, weight: .semibold, design: .rounded))
                                    }
                                    .foregroundStyle(isSelected ? AppColors.darkNavy : AppColors.textSecondary)
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 5)
                                    .background(
                                        isSelected ? Color(hex: sport.accentColor) : AppColors.surface,
                                        in: Capsule()
                                    )
                                }
                            }
                        }
                        .padding(.horizontal, 12)
                    }

                    // Team grid
                    LazyVGrid(columns: columns, spacing: 8) {
                        ForEach(viewModel.browseTeams) { team in
                            Button {
                                withAnimation(.snappy) { viewModel.toggleFavorite(team) }
                            } label: {
                                VStack(spacing: 3) {
                                    ZStack(alignment: .topTrailing) {
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
                                        if viewModel.isFavorite(team) {
                                            Image(systemName: "star.fill")
                                                .font(.system(size: 7))
                                                .foregroundStyle(AppColors.gold)
                                                .offset(x: 2, y: -2)
                                        }
                                    }
                                    Text(team.shortName)
                                        .font(.system(size: 9, weight: .medium, design: .rounded))
                                        .foregroundStyle(AppColors.textSecondary)
                                        .lineLimit(1)
                                }
                            }
                        }
                    }
                    .padding(.horizontal, 12)
                }
            }
            .padding(.vertical, 4)
        }
        .task { await viewModel.load() }
    }

    private func sectionHeader(_ title: String, icon: String) -> some View {
        HStack(spacing: 5) {
            Image(systemName: icon)
                .font(.system(size: 10, weight: .semibold))
                .foregroundStyle(AppColors.gold)
            Text(title)
                .font(.system(size: 12, weight: .semibold, design: .rounded))
                .foregroundStyle(AppColors.textSecondary)
        }
        .padding(.horizontal, 12)
    }
}
