import SwiftUI

struct MatchDetailView: View {
    let matchId: String
    @State private var match: Match?
    @State private var isLoading = true
    @State private var selectedTab = 0

    private var displayMatch: Match {
        match ?? MockDataService.allMatches.first { $0.id == matchId } ?? .previewLive
    }

    private var tabs: [String] {
        let m = displayMatch
        if m.league.sport == .soccer {
            return ["Summary", "Stats", "Lineups", "Events"]
        }
        // American sports
        var t = ["Summary"]
        if m.stats != nil { t.append("Box Score") }
        return t
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                matchHeader
                tabSelector
                tabContent
            }
        }
        .background(AppColors.background)
        .navigationBarTitleDisplayMode(.inline)
        .task {
            await loadMatch()
        }
    }

    // MARK: - Load from API

    private func loadMatch() async {
        isLoading = true
        do {
            let apiMatches = try await APIService.shared.fetchMatches()
            if let found = apiMatches.first(where: { $0.id == matchId }) {
                match = found.toMatch()
            }
        } catch {
            // Fallback to mock
            match = MockDataService.allMatches.first { $0.id == matchId }
        }
        isLoading = false
    }

    // MARK: - Match Header

    private var matchHeader: some View {
        let m = displayMatch
        return VStack(spacing: 16) {
            // League badge
            Text(m.league.name)
                .font(AppTypography.caption)
                .foregroundStyle(Color(hex: m.league.sport.accentColor))

            HStack(spacing: 24) {
                detailTeamView(m.homeTeam)

                VStack(spacing: 4) {
                    if let h = m.homeScore, let a = m.awayScore {
                        Text("\(h) - \(a)")
                            .font(AppTypography.score)
                            .foregroundStyle(AppColors.textPrimary)
                    } else {
                        Text("vs")
                            .font(AppTypography.scoreMedium)
                            .foregroundStyle(AppColors.textTertiary)
                    }

                    if m.isLive {
                        HStack(spacing: 4) {
                            Circle()
                                .fill(AppColors.livePulse)
                                .frame(width: 6, height: 6)
                                .modifier(PulseModifier())
                            Text(m.displayTime)
                                .font(.system(size: 14, weight: .black, design: .rounded))
                                .foregroundStyle(AppColors.livePulse)
                        }
                    } else if m.status == .finished {
                        Text(m.displayTime)
                            .font(.system(size: 13, weight: .semibold, design: .rounded))
                            .foregroundStyle(AppColors.textTertiary)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 3)
                            .background(AppColors.surface, in: Capsule())
                    } else {
                        VStack(spacing: 2) {
                            Text(m.startTime, style: .time)
                                .font(AppTypography.caption)
                                .foregroundStyle(AppColors.textTertiary)
                            Text(m.startTime, style: .date)
                                .font(.system(size: 10))
                                .foregroundStyle(AppColors.textTertiary.opacity(0.6))
                        }
                    }
                }

                detailTeamView(m.awayTeam)
            }

            // Venue
            if let desc = m.liveDescription, !desc.isEmpty, m.status == .upcoming {
                Text(desc)
                    .font(.system(size: 11, design: .rounded))
                    .foregroundStyle(AppColors.textTertiary)
            }
        }
        .padding(.vertical, 24)
        .padding(.horizontal, 16)
    }

    private func detailTeamView(_ team: Team) -> some View {
        VStack(spacing: 8) {
            AsyncImage(url: team.logoURL) { image in
                image.resizable().scaledToFit()
            } placeholder: {
                Circle()
                    .fill(Color(hex: team.primaryColor).opacity(0.3))
                    .overlay {
                        Text(team.shortName)
                            .font(.system(size: 14, weight: .bold, design: .rounded))
                            .foregroundStyle(.white)
                    }
            }
            .frame(width: 56, height: 56)
            Text(team.name)
                .font(.system(size: 12, weight: .medium, design: .rounded))
                .foregroundStyle(AppColors.textSecondary)
                .lineLimit(1)
                .frame(width: 90)
                .multilineTextAlignment(.center)
        }
    }

    // MARK: - Tab Selector

    private var tabSelector: some View {
        HStack(spacing: 0) {
            ForEach(Array(tabs.enumerated()), id: \.offset) { idx, tab in
                Button {
                    withAnimation(.snappy) { selectedTab = idx }
                } label: {
                    VStack(spacing: 6) {
                        Text(tab)
                            .font(.system(size: 13, weight: selectedTab == idx ? .semibold : .regular, design: .rounded))
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
    }

    // MARK: - Tab Content

    @ViewBuilder
    private var tabContent: some View {
        let m = displayMatch

        if m.league.sport == .soccer {
            switch selectedTab {
            case 0: summaryTab.padding()
            case 1: statsTab.padding()
            case 2: lineupsTab.padding()
            case 3: eventsTab.padding()
            default: EmptyView()
            }
        } else {
            switch selectedTab {
            case 0: americanSummaryTab.padding()
            case 1: statsTab.padding()
            default: EmptyView()
            }
        }
    }

    // MARK: - Summary Tab (Soccer)

    private var summaryTab: some View {
        let m = displayMatch
        return VStack(spacing: 16) {
            if m.status == .upcoming {
                upcomingView
            } else if !m.events.isEmpty {
                ForEach(m.events) { event in
                    eventRow(event)
                }
            } else {
                ContentUnavailableView("No Events Yet", systemImage: "clock",
                    description: Text("Events will appear once the match begins."))
            }
        }
    }

    // MARK: - American Sports Summary

    private var americanSummaryTab: some View {
        let m = displayMatch
        return VStack(spacing: 16) {
            if m.status == .upcoming {
                upcomingView
            } else {
                // Linescore placeholder
                if m.homeScore != nil {
                    VStack(spacing: 8) {
                        HStack {
                            Text(m.homeTeam.shortName)
                                .font(.system(size: 13, weight: .semibold, design: .rounded))
                                .foregroundStyle(AppColors.textSecondary)
                                .frame(width: 50, alignment: .leading)
                            Spacer()
                            Text("\(m.homeScore ?? 0)")
                                .font(.system(size: 15, weight: .bold, design: .rounded).monospacedDigit())
                                .foregroundStyle(AppColors.textPrimary)
                                .frame(width: 30)
                        }
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(AppColors.surface.opacity(0.5), in: RoundedRectangle(cornerRadius: 8))

                        HStack {
                            Text(m.awayTeam.shortName)
                                .font(.system(size: 13, weight: .semibold, design: .rounded))
                                .foregroundStyle(AppColors.textSecondary)
                                .frame(width: 50, alignment: .leading)
                            Spacer()
                            Text("\(m.awayScore ?? 0)")
                                .font(.system(size: 15, weight: .bold, design: .rounded).monospacedDigit())
                                .foregroundStyle(AppColors.textPrimary)
                                .frame(width: 30)
                        }
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(AppColors.surface.opacity(0.5), in: RoundedRectangle(cornerRadius: 8))
                    }
                }

                // Events if any
                if !m.events.isEmpty {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("KEY PLAYS")
                            .font(.system(size: 10, weight: .bold, design: .rounded))
                            .foregroundStyle(AppColors.textTertiary)
                            .tracking(1)
                        ForEach(m.events) { event in
                            eventRow(event)
                        }
                    }
                }
            }
        }
    }

    // MARK: - Upcoming

    private var upcomingView: some View {
        let m = displayMatch
        return VStack(spacing: 12) {
            Image(systemName: "clock")
                .font(.system(size: 32))
                .foregroundStyle(AppColors.textTertiary)
            Text("Match hasn't started yet")
                .font(.system(size: 16, weight: .medium, design: .rounded))
                .foregroundStyle(AppColors.textSecondary)
            Text(m.startTime, format: .dateTime.weekday(.wide).month(.wide).day())
                .font(.system(size: 13, design: .rounded))
                .foregroundStyle(AppColors.textTertiary)
            Text(m.startTime, format: .dateTime.hour().minute())
                .font(.system(size: 13, design: .rounded))
                .foregroundStyle(AppColors.textTertiary)
        }
        .padding(.vertical, 24)
    }

    // MARK: - Stats Tab

    private var statsTab: some View {
        let m = displayMatch
        return VStack(spacing: 16) {
            if let stats = m.stats {
                ForEach(stats.items) { stat in
                    VStack(spacing: 6) {
                        HStack {
                            Text("\(stat.home)")
                                .font(.system(size: 14, weight: .bold, design: .rounded))
                                .foregroundStyle(AppColors.textPrimary)
                            Spacer()
                            Text(stat.name)
                                .font(.system(size: 11, design: .rounded))
                                .foregroundStyle(AppColors.textTertiary)
                            Spacer()
                            Text("\(stat.away)")
                                .font(.system(size: 14, weight: .bold, design: .rounded))
                                .foregroundStyle(AppColors.textPrimary)
                        }

                        GeometryReader { geo in
                            let total = max(stat.home + stat.away, 1)
                            let homeWidth = geo.size.width * CGFloat(stat.home) / CGFloat(total)
                            HStack(spacing: 2) {
                                RoundedRectangle(cornerRadius: 3)
                                    .fill(AppColors.accent)
                                    .frame(width: max(homeWidth, 2), height: 6)
                                RoundedRectangle(cornerRadius: 3)
                                    .fill(AppColors.textTertiary.opacity(0.5))
                                    .frame(width: max(geo.size.width - homeWidth - 2, 2), height: 6)
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
        let m = displayMatch
        return VStack(spacing: 20) {
            if let lineups = m.lineups {
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(m.homeTeam.shortName)
                            .font(AppTypography.headline)
                            .foregroundStyle(AppColors.textPrimary)
                        Text(lineups.homeFormation)
                            .font(AppTypography.caption)
                            .foregroundStyle(AppColors.accent)
                    }
                    Spacer()
                    VStack(alignment: .trailing, spacing: 4) {
                        Text(m.awayTeam.shortName)
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
        let m = displayMatch
        return VStack(spacing: 12) {
            if !m.events.isEmpty {
                ForEach(m.events) { event in
                    eventRow(event)
                }
            } else {
                ContentUnavailableView("No Events", systemImage: "list.bullet",
                    description: Text("Events will appear as the match progresses."))
            }
        }
    }

    private func eventRow(_ event: MatchEvent) -> some View {
        let m = displayMatch
        let isHome = event.teamId == m.homeTeam.id || event.teamId == "home"
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
                .font(.system(size: 13, weight: .medium, design: .rounded))
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
