import SwiftUI

struct HomeView: View {
    @Environment(SportSelection.self) private var sportSelection
    @State private var viewModel = MatchesViewModel()

    var body: some View {
        VStack(spacing: 0) {
            SportSwitcher()
                .padding(.vertical, 8)

            ScrollView {
                LazyVStack(spacing: 0) {
                    ForEach(viewModel.groups) { group in
                        leagueHeader(group.league)

                        ForEach(group.matches) { match in
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
            }
        }
        .task(id: sportSelection.current) {
            await viewModel.load(sport: sportSelection.current)
        }
    }

    private func leagueHeader(_ league: League) -> some View {
        HStack(spacing: 4) {
            Text(league.name)
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(AppColors.textSecondary)
            Text("·")
                .foregroundStyle(AppColors.textTertiary)
            Text(league.country)
                .font(.system(size: 12))
                .foregroundStyle(AppColors.textTertiary)
            Spacer()
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
        .background(AppColors.surface.opacity(0.3))
    }
}

// MARK: - FotMob Match Row

struct FotMobMatchRow: View {
    let match: Match

    var body: some View {
        HStack(spacing: 0) {
            // Home team (right-aligned)
            HStack(spacing: 6) {
                Text(match.homeTeam.name)
                    .font(.system(size: 15))
                    .foregroundStyle(AppColors.textPrimary)
                    .lineLimit(1)
                    .frame(maxWidth: .infinity, alignment: .trailing)
                teamBadge(match.homeTeam)
            }

            // Center score / time
            VStack(spacing: 1) {
                if let hs = match.homeScore, let aws = match.awayScore {
                    Text("\(hs) - \(aws)")
                        .font(.system(size: 16, weight: .bold).monospacedDigit())
                        .foregroundStyle(match.isLive ? AppColors.livePulse : AppColors.textPrimary)
                } else {
                    Text(match.displayTime)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundStyle(AppColors.textTertiary)
                }

                if match.isLive {
                    HStack(spacing: 3) {
                        Circle()
                            .fill(AppColors.livePulse)
                            .frame(width: 5, height: 5)
                            .modifier(PulseModifier())
                        Text(match.displayTime)
                            .font(.system(size: 10, weight: .bold))
                            .foregroundStyle(AppColors.livePulse)
                    }
                } else if match.status == .finished {
                    Text(match.displayTime)
                        .font(.system(size: 10, weight: .medium))
                        .foregroundStyle(AppColors.textTertiary)
                }
            }
            .frame(width: 72)

            // Away team (left-aligned)
            HStack(spacing: 6) {
                teamBadge(match.awayTeam)
                Text(match.awayTeam.name)
                    .font(.system(size: 15))
                    .foregroundStyle(AppColors.textPrimary)
                    .lineLimit(1)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
        }
        .padding(.horizontal, 12)
        .frame(height: 44)
    }

    private func teamBadge(_ team: Team) -> some View {
        Group {
            if team.sport == .soccer, let url = team.logoURL {
                AsyncImage(url: url) { image in
                    image.resizable().scaledToFit()
                } placeholder: {
                    Circle()
                        .fill(Color(hex: team.primaryColor).opacity(0.3))
                        .overlay {
                            Text(String(team.shortName.prefix(2)))
                                .font(.system(size: 8, weight: .bold))
                                .foregroundStyle(.white)
                        }
                }
                .frame(width: 20, height: 20)
            } else {
                Circle()
                    .fill(Color(hex: team.primaryColor).opacity(0.3))
                    .frame(width: 20, height: 20)
                    .overlay {
                        Text(String(team.shortName.prefix(2)))
                            .font(.system(size: 8, weight: .bold))
                            .foregroundStyle(Color(hex: team.primaryColor))
                    }
            }
        }
    }
}
