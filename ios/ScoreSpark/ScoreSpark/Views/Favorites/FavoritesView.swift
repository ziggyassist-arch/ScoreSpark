import SwiftUI

struct FavoritesView: View {
    @State private var viewModel = FavoritesViewModel()

    private let columns = Array(repeating: GridItem(.flexible(), spacing: 12), count: 4)

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                // My starred teams
                if !viewModel.favoriteTeams.isEmpty {
                    Text("My Teams")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(AppColors.textSecondary)
                        .padding(.horizontal, 16)

                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 12) {
                            ForEach(viewModel.favoriteTeams) { team in
                                VStack(spacing: 4) {
                                    ZStack(alignment: .topTrailing) {
                                        Circle()
                                            .fill(Color(hex: team.primaryColor).opacity(0.3))
                                            .frame(width: 48, height: 48)
                                            .overlay {
                                                Text(team.shortName)
                                                    .font(.system(size: 13, weight: .bold))
                                                    .foregroundStyle(Color(hex: team.primaryColor))
                                            }
                                        Image(systemName: "star.fill")
                                            .font(.system(size: 8))
                                            .foregroundStyle(AppColors.gold)
                                            .offset(x: 2, y: -2)
                                    }
                                    Text(team.shortName)
                                        .font(.system(size: 10, weight: .medium))
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
                    Text("Upcoming & Recent")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(AppColors.textSecondary)
                        .padding(.horizontal, 16)

                    LazyVStack(spacing: 0) {
                        ForEach(viewModel.favoriteMatches) { match in
                            NavigationLink(value: match.id) {
                                FotMobMatchRow(match: match)
                            }
                            .buttonStyle(.plain)

                            Divider()
                                .overlay(Color.white.opacity(0.06))
                                .padding(.horizontal, 12)
                        }
                    }
                }

                // Browse teams
                Text("Browse Teams")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundStyle(AppColors.textSecondary)
                    .padding(.horizontal, 16)
                    .padding(.top, 8)

                // Sport selector
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
                                        .font(.system(size: 12, weight: .semibold))
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
                                    Circle()
                                        .fill(Color(hex: team.primaryColor).opacity(0.25))
                                        .frame(width: 44, height: 44)
                                        .overlay {
                                            Text(String(team.shortName.prefix(3)))
                                                .font(.system(size: 11, weight: .bold))
                                                .foregroundStyle(Color(hex: team.primaryColor))
                                        }
                                    if viewModel.isFavorite(team) {
                                        Image(systemName: "star.fill")
                                            .font(.system(size: 8))
                                            .foregroundStyle(AppColors.gold)
                                            .offset(x: 2, y: -2)
                                    }
                                }
                                Text(team.shortName)
                                    .font(.system(size: 9, weight: .medium))
                                    .foregroundStyle(AppColors.textSecondary)
                                    .lineLimit(1)
                            }
                        }
                    }
                }
                .padding(.horizontal, 16)
            }
            .padding(.vertical, 8)
        }
        .task { await viewModel.load() }
    }
}
