import SwiftUI

struct HomeView: View {
    @Environment(SportSelection.self) private var sportSelection
    @State private var viewModel = MatchesViewModel()

    var body: some View {
        VStack(spacing: 0) {
            if viewModel.isLoading && viewModel.groups.isEmpty {
                Spacer()
                ProgressView()
                    .tint(AppColors.gold)
                Spacer()
            } else if viewModel.groups.isEmpty {
                Spacer()
                ContentUnavailableView("No Matches", systemImage: "sportscourt",
                    description: Text("No matches available right now."))
                Spacer()
            } else {
                ScrollView {
                    LazyVStack(spacing: 0) {
                        ForEach(viewModel.groups) { group in
                            leagueHeader(group.league)

                            ForEach(group.matches) { match in
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
                }
            }
        }
        .task(id: sportSelection.current) {
            await viewModel.load(sport: sportSelection.current)
        }
    }

    private func leagueHeader(_ league: League) -> some View {
        HStack(spacing: 6) {
            if let url = leagueLogoURL(for: league) {
                AsyncImage(url: url) { image in
                    image.resizable().scaledToFit()
                } placeholder: {
                    EmptyView()
                }
                .frame(width: 14, height: 14)
            }
            Text(league.name)
                .font(.system(size: 12, weight: .medium))
                .foregroundStyle(AppColors.textSecondary)
            if !league.country.isEmpty {
                Text("·")
                    .font(.system(size: 10))
                    .foregroundStyle(AppColors.textTertiary)
                Text(league.country)
                    .font(.system(size: 11))
                    .foregroundStyle(AppColors.textTertiary)
            }
            Spacer()
        }
        .padding(.horizontal, 16)
        .frame(height: 28)
        .background(AppColors.surface.opacity(0.25))
    }

    private func leagueLogoURL(for league: League) -> URL? {
        switch league.sport {
        case .nba: return URL(string: "https://a.espncdn.com/i/teamlogos/leagues/500/nba.png")
        case .nfl: return URL(string: "https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png")
        case .nhl: return URL(string: "https://a.espncdn.com/i/teamlogos/leagues/500/nhl.png")
        case .mlb: return URL(string: "https://a.espncdn.com/i/teamlogos/leagues/500/mlb.png")
        default: return league.logoURL
        }
    }
}

// MARK: - FotMob Match Row (44pt height, exact FotMob layout)

struct FotMobMatchRow: View {
    let match: Match

    var body: some View {
        HStack(spacing: 0) {
            // Home team — name right-aligned, then badge
            HStack(spacing: 6) {
                Text(match.homeTeam.name)
                    .font(.system(size: 13))
                    .foregroundStyle(.white)
                    .lineLimit(1)
                    .frame(maxWidth: .infinity, alignment: .trailing)
                teamBadge(match.homeTeam)
            }

            // Center score / time area
            VStack(spacing: 1) {
                if let hs = match.homeScore, let aws = match.awayScore {
                    Text("\(hs) - \(aws)")
                        .font(.system(size: 14, weight: .bold).monospacedDigit())
                        .foregroundStyle(match.isLive ? Color(hex: "22C55E") : .white)
                } else {
                    Text(match.displayTime)
                        .font(.system(size: 13))
                        .foregroundStyle(AppColors.textTertiary)
                }

                if match.isLive {
                    HStack(spacing: 2) {
                        Circle()
                            .fill(Color(hex: "22C55E"))
                            .frame(width: 4, height: 4)
                            .modifier(PulseModifier())
                        Text(match.displayTime)
                            .font(.system(size: 9, weight: .semibold))
                            .foregroundStyle(Color(hex: "22C55E"))
                    }
                } else if match.status == .finished {
                    Text(match.displayTime)
                        .font(.system(size: 9))
                        .foregroundStyle(AppColors.textTertiary)
                }
            }
            .frame(width: 56)

            // Away team — badge then name left-aligned
            HStack(spacing: 6) {
                teamBadge(match.awayTeam)
                Text(match.awayTeam.name)
                    .font(.system(size: 13))
                    .foregroundStyle(.white)
                    .lineLimit(1)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
        }
        .padding(.horizontal, 12)
        .frame(height: 44)
    }

    private func teamBadge(_ team: Team) -> some View {
        AsyncImage(url: team.logoURL) { image in
            image.resizable().scaledToFit()
        } placeholder: {
            Circle()
                .fill(Color(hex: team.primaryColor).opacity(0.3))
                .overlay {
                    Text(String(team.shortName.prefix(2)))
                        .font(.system(size: 7, weight: .bold))
                        .foregroundStyle(.white)
                }
        }
        .frame(width: 18, height: 18)
    }
}
