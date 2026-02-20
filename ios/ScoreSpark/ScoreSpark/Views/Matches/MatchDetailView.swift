import SwiftUI

struct MatchDetailView: View {
    let matchId: String
    @State private var selectedTab = 0

    private var match: Match {
        MockDataService.allMatches.first { $0.id == matchId } ?? .previewLive
    }

    private let tabs = ["Summary", "Stats", "Lineups", "Events"]

    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                // Header
                VStack(spacing: 16) {
                    Text(match.league.name)
                        .font(AppTypography.caption)
                        .foregroundStyle(Color(hex: match.league.sport.accentColor))

                    HStack(spacing: 24) {
                        detailTeamView(match.homeTeam)

                        VStack(spacing: 4) {
                            if let h = match.homeScore, let a = match.awayScore {
                                Text("\(h) - \(a)")
                                    .font(AppTypography.score)
                                    .foregroundStyle(AppColors.textPrimary)
                            } else {
                                Text("vs")
                                    .font(AppTypography.scoreMedium)
                                    .foregroundStyle(AppColors.textTertiary)
                            }
                            if match.isLive {
                                Text(match.displayTime)
                                    .font(.system(size: 14, weight: .black, design: .rounded))
                                    .foregroundStyle(AppColors.livePulse)
                            } else {
                                Text(match.displayTime)
                                    .font(AppTypography.caption)
                                    .foregroundStyle(AppColors.textTertiary)
                            }
                        }

                        detailTeamView(match.awayTeam)
                    }
                }
                .padding(.vertical, 24)

                // Tab selector
                HStack(spacing: 0) {
                    ForEach(Array(tabs.enumerated()), id: \.offset) { idx, tab in
                        Button {
                            withAnimation(.snappy) { selectedTab = idx }
                        } label: {
                            VStack(spacing: 6) {
                                Text(tab)
                                    .font(AppTypography.subheadline)
                                    .foregroundStyle(selectedTab == idx ? AppColors.gold : AppColors.textTertiary)
                                    .frame(maxWidth: .infinity)
                                Rectangle()
                                    .fill(selectedTab == idx ? AppColors.gold : .clear)
                                    .frame(height: 2)
                            }
                            .padding(.top, 12)
                        }
                    }
                }
                .background(AppColors.surface)

                // Tab content
                Group {
                    switch selectedTab {
                    case 0: summaryTab
                    case 1: statsTab
                    case 2: lineupsTab
                    case 3: eventsTab
                    default: EmptyView()
                    }
                }
                .padding()
            }
        }
        .background(AppColors.background)
        .navigationBarTitleDisplayMode(.inline)
    }

    private func detailTeamView(_ team: Team) -> some View {
        VStack(spacing: 8) {
            if team.sport == .soccer, let url = team.logoURL {
                AsyncImage(url: url) { image in
                    image.resizable().scaledToFit()
                } placeholder: {
                    Circle()
                        .fill(Color(hex: team.primaryColor).opacity(0.3))
                        .overlay {
                            Text(team.shortName)
                                .font(.system(size: 16, weight: .bold, design: .rounded))
                                .foregroundStyle(.white)
                        }
                }
                .frame(width: 56, height: 56)
            } else {
                Circle()
                    .fill(Color(hex: team.primaryColor).opacity(0.3))
                    .frame(width: 56, height: 56)
                    .overlay {
                        Text(team.shortName)
                            .font(.system(size: 14, weight: .bold, design: .rounded))
                            .foregroundStyle(Color(hex: team.primaryColor))
                    }
            }
            Text(team.name)
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textSecondary)
                .lineLimit(1)
                .frame(width: 80)
                .multilineTextAlignment(.center)
        }
    }

    // MARK: - Summary Tab

    private var summaryTab: some View {
        VStack(spacing: 16) {
            if !match.events.isEmpty {
                ForEach(match.events) { event in
                    eventRow(event)
                }
            } else {
                ContentUnavailableView("No Events Yet", systemImage: "clock",
                    description: Text("Events will appear once the match begins."))
            }
        }
    }

    // MARK: - Stats Tab

    private var statsTab: some View {
        VStack(spacing: 16) {
            if let stats = match.stats {
                ForEach(stats.items) { stat in
                    VStack(spacing: 6) {
                        HStack {
                            Text("\(stat.home)")
                                .font(.system(size: 14, weight: .bold, design: .rounded))
                                .foregroundStyle(AppColors.textPrimary)
                            Spacer()
                            Text(stat.name)
                                .font(AppTypography.caption)
                                .foregroundStyle(AppColors.textTertiary)
                            Spacer()
                            Text("\(stat.away)")
                                .font(.system(size: 14, weight: .bold, design: .rounded))
                                .foregroundStyle(AppColors.textPrimary)
                        }

                        // Bar chart
                        GeometryReader { geo in
                            let total = max(stat.home + stat.away, 1)
                            let homeWidth = geo.size.width * CGFloat(stat.home) / CGFloat(total)
                            HStack(spacing: 2) {
                                Spacer()
                                RoundedRectangle(cornerRadius: 3)
                                    .fill(AppColors.accent)
                                    .frame(width: homeWidth, height: 6)
                                RoundedRectangle(cornerRadius: 3)
                                    .fill(AppColors.textTertiary)
                                    .frame(width: geo.size.width - homeWidth - 2, height: 6)
                            }
                        }
                        .frame(height: 6)
                    }
                }
            } else {
                ContentUnavailableView("No Stats Available", systemImage: "chart.bar",
                    description: Text("Statistics will appear during the match."))
            }
        }
    }

    // MARK: - Lineups Tab

    private var lineupsTab: some View {
        VStack(spacing: 20) {
            if let lineups = match.lineups {
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(match.homeTeam.shortName)
                            .font(AppTypography.headline)
                            .foregroundStyle(AppColors.textPrimary)
                        Text(lineups.homeFormation)
                            .font(AppTypography.caption)
                            .foregroundStyle(AppColors.accent)
                    }
                    Spacer()
                    VStack(alignment: .trailing, spacing: 4) {
                        Text(match.awayTeam.shortName)
                            .font(AppTypography.headline)
                            .foregroundStyle(AppColors.textPrimary)
                        Text(lineups.awayFormation)
                            .font(AppTypography.caption)
                            .foregroundStyle(AppColors.accent)
                    }
                }

                ForEach(Array(zip(lineups.homeStarting, lineups.awayStarting).enumerated()), id: \.offset) { _, pair in
                    HStack {
                        HStack(spacing: 8) {
                            Text("\(pair.0.number)")
                                .font(.system(size: 12, weight: .bold, design: .rounded))
                                .foregroundStyle(AppColors.accent)
                                .frame(width: 24)
                            Text(pair.0.name)
                                .font(AppTypography.subheadline)
                                .foregroundStyle(AppColors.textPrimary)
                        }
                        Spacer()
                        HStack(spacing: 8) {
                            Text(pair.1.name)
                                .font(AppTypography.subheadline)
                                .foregroundStyle(AppColors.textPrimary)
                            Text("\(pair.1.number)")
                                .font(.system(size: 12, weight: .bold, design: .rounded))
                                .foregroundStyle(AppColors.accent)
                                .frame(width: 24)
                        }
                    }
                    Divider().overlay(AppColors.surface)
                }
            } else {
                ContentUnavailableView("No Lineups Available", systemImage: "person.3",
                    description: Text("Lineups will be announced closer to kick-off."))
            }
        }
    }

    // MARK: - Events Tab

    private var eventsTab: some View {
        VStack(spacing: 12) {
            if !match.events.isEmpty {
                ForEach(match.events) { event in
                    eventRow(event)
                }
            } else {
                ContentUnavailableView("No Events", systemImage: "list.bullet",
                    description: Text("Events will appear as the match progresses."))
            }
        }
    }

    private func eventRow(_ event: MatchEvent) -> some View {
        let isHome = event.teamId == match.homeTeam.id
        return HStack(spacing: 12) {
            if !isHome { Spacer() }
            Text("\(event.minute)'")
                .font(.system(size: 12, weight: .bold, design: .rounded))
                .foregroundStyle(AppColors.textTertiary)
                .frame(width: 32)
            Image(systemName: event.type.icon)
                .font(.system(size: 12))
                .foregroundStyle(eventColor(event.type))
            Text(event.playerName)
                .font(AppTypography.subheadline)
                .foregroundStyle(AppColors.textPrimary)
            if isHome { Spacer() }
        }
        .padding(.vertical, 6)
        .padding(.horizontal, 12)
        .background(AppColors.surface.opacity(0.5), in: RoundedRectangle(cornerRadius: 8, style: .continuous))
    }

    private func eventColor(_ type: MatchEventType) -> Color {
        switch type {
        case .goal, .penalty: AppColors.gold
        case .yellowCard: .yellow
        case .redCard: .red
        case .substitution: AppColors.accent
        case .ownGoal: .orange
        }
    }
}
