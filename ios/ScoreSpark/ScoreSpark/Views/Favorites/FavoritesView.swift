import SwiftUI

struct FavoritesView: View {
    @State private var viewModel = FavoritesViewModel()

    private let columns = Array(repeating: GridItem(.flexible(), spacing: 12), count: 4)

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                if viewModel.isLoading {
                    ProgressView()
                        .tint(AppColors.gold)
                        .frame(maxWidth: .infinity)
                        .padding(.top, 60)
                } else {
                    // My starred teams
                    if !viewModel.resolvedFavoriteTeams.isEmpty {
                        sectionHeader("My Teams", icon: "star.fill")

                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 12) {
                                ForEach(viewModel.resolvedFavoriteTeams) { team in
                                    VStack(spacing: 4) {
                                        ZStack(alignment: .topTrailing) {
                                            AsyncImage(url: team.logoURL) { image in
                                                image.resizable().scaledToFit()
                                            } placeholder: {
                                                Circle()
                                                    .fill(Color(hex: team.primaryColor).opacity(0.3))
                                                    .overlay {
                                                        Text(team.shortName)
                                                            .font(.system(size: 13, weight: .bold))
                                                            .foregroundStyle(Color(hex: team.primaryColor))
                                                    }
                                            }
                                            .frame(width: 48, height: 48)
                                            Image(systemName: "star.fill")
                                                .font(.system(size: 8))
                                                .foregroundStyle(AppColors.gold)
                                                .offset(x: 2, y: -2)
                                        }
                                        Text(team.shortName)
                                            .font(.system(size: 10, weight: .medium, design: .rounded))
                                            .foregroundStyle(AppColors.textTertiary)
                                    }
                                    .onTapGesture { viewModel.toggleFavorite(team) }
                                }
                            }
                            .padding(.horizontal, 16)
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
                                    .padding(.horizontal, 12)
                            }
                        }
                    }

                    // Empty state
                    if viewModel.resolvedFavoriteTeams.isEmpty && viewModel.favoriteMatches.isEmpty {
                        VStack(spacing: 12) {
                            Image(systemName: "star")
                                .font(.system(size: 40))
                                .foregroundStyle(AppColors.gold.opacity(0.4))
                            Text("No Favorites Yet")
                                .font(.system(size: 16, weight: .semibold, design: .rounded))
                                .foregroundStyle(AppColors.textSecondary)
                            Text("Star teams below to follow their matches")
                                .font(.system(size: 13, design: .rounded))
                                .foregroundStyle(AppColors.textTertiary)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 24)
                    }

                    // Browse teams
                    sectionHeader("Browse Teams", icon: "person.3")
                        .padding(.top, 8)

                    // Sport selector chips
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 6) {
                            ForEach(Sport.sports) { sport in
                                let isSelected = viewModel.browseSport == sport
                                Button {
                                    withAnimation(.snappy) {
                                        viewModel.updateBrowseSport(sport)
                                    }
                                } label: {
                                    HStack(spacing: 3) {
                                        Text(sport.emoji)
                                            .font(.system(size: 12))
                                        Text(sport.rawValue)
                                            .font(.system(size: 12, weight: .semibold, design: .rounded))
                                    }
                                    .foregroundStyle(isSelected ? AppColors.darkNavy : AppColors.textSecondary)
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 6)
                                    .background(
                                        isSelected ? Color(hex: sport.accentColor) : AppColors.surface,
                                        in: Capsule()
                                    )
                                }
                            }
                        }
                        .padding(.horizontal, 16)
                    }

                    // Team grid
                    LazyVGrid(columns: columns, spacing: 12) {
                        ForEach(viewModel.browseTeams) { team in
                            Button {
                                withAnimation(.snappy) { viewModel.toggleFavorite(team) }
                            } label: {
                                VStack(spacing: 4) {
                                    ZStack(alignment: .topTrailing) {
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
                                        .frame(width: 44, height: 44)
                                        if viewModel.isFavorite(team) {
                                            Image(systemName: "star.fill")
                                                .font(.system(size: 8))
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
                    .padding(.horizontal, 16)
                }
            }
            .padding(.vertical, 8)
        }
        .task { await viewModel.load() }
    }

    private func sectionHeader(_ title: String, icon: String) -> some View {
        HStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 11, weight: .semibold))
                .foregroundStyle(AppColors.gold)
            Text(title)
                .font(.system(size: 13, weight: .semibold, design: .rounded))
                .foregroundStyle(AppColors.textSecondary)
        }
        .padding(.horizontal, 16)
    }
}
