import SwiftUI

struct FavoritesView: View {
    @State private var viewModel = FavoritesViewModel()

    private let columns = Array(repeating: GridItem(.flexible(), spacing: 12), count: 4)

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                if viewModel.isLoading {
                    ProgressView()
                        .tint(AppColors.accent)
                        .frame(maxWidth: .infinity)
                        .padding(.top, 20)
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
                                                            .font(.system(size: 10, weight: .bold))
                                                            .foregroundStyle(Color(hex: team.primaryColor))
                                                    }
                                            }
                                            .frame(width: 36, height: 36)
                                            Image(systemName: "star.fill")
                                                .font(.system(size: 8))
                                                .foregroundStyle(AppColors.accent)
                                                .offset(x: 2, y: -2)
                                        }
                                        Text(team.shortName)
                                            .font(.system(size: 11, weight: .medium))
                                            .foregroundStyle(AppColors.textSecondary)
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

                        VStack(spacing: 0) {
                            ForEach(Array(viewModel.favoriteMatches.enumerated()), id: \.element.id) { index, match in
                                NavigationLink(value: match.id) {
                                    FotMobMatchRow(match: match)
                                }
                                .buttonStyle(.plain)

                                if index < viewModel.favoriteMatches.count - 1 {
                                    Rectangle()
                                        .fill(AppColors.separator)
                                        .frame(height: 0.5)
                                        .padding(.leading, 16)
                                }
                            }
                        }
                        .background(AppColors.cardBackground)
                        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                        .padding(.horizontal, 10)
                    }

                    // Empty state
                    if viewModel.resolvedFavoriteTeams.isEmpty && viewModel.favoriteMatches.isEmpty {
                        VStack(spacing: 8) {
                            Image(systemName: "star")
                                .font(.system(size: 28))
                                .foregroundStyle(AppColors.accent.opacity(0.4))
                            Text("No Favorites Yet")
                                .font(.system(size: 15, weight: .semibold))
                                .foregroundStyle(AppColors.textPrimary)
                            Text("Star teams below to follow their matches")
                                .font(.system(size: 13))
                                .foregroundStyle(AppColors.textSecondary)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                    }

                    // Browse teams
                    sectionHeader("Browse Teams", icon: "person.3")

                    // Sport selector chips
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
                                            .font(.system(size: 12))
                                        Text(sport.rawValue)
                                            .font(.system(size: 13, weight: .semibold))
                                    }
                                    .foregroundStyle(isSelected ? .white : AppColors.textSecondary)
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 6)
                                    .background(
                                        isSelected ? AppColors.accent : AppColors.elevated,
                                        in: Capsule()
                                    )
                                }
                            }
                        }
                        .padding(.horizontal, 16)
                    }

                    // Team grid
                    LazyVGrid(columns: columns, spacing: 16) {
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
                                                        .font(.system(size: 10, weight: .bold))
                                                        .foregroundStyle(Color(hex: team.primaryColor))
                                                }
                                        }
                                        .frame(width: 36, height: 36)
                                        if viewModel.isFavorite(team) {
                                            Image(systemName: "star.fill")
                                                .font(.system(size: 8))
                                                .foregroundStyle(AppColors.accent)
                                                .offset(x: 2, y: -2)
                                        }
                                    }
                                    Text(team.shortName)
                                        .font(.system(size: 11, weight: .medium))
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
        .background(AppColors.screenBackground)
        .task { await viewModel.load() }
    }

    private func sectionHeader(_ title: String, icon: String) -> some View {
        HStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 12, weight: .semibold))
                .foregroundStyle(AppColors.accent)
            Text(title)
                .font(.system(size: 13, weight: .bold))
                .foregroundStyle(AppColors.textPrimary)
        }
        .padding(.horizontal, 16)
    }
}
