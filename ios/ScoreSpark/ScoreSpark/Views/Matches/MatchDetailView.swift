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
            return ["Summary", "Stats", "Lineups", "Commentary"]
        }
        return ["Summary", "Stats", "Plays"]
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                matchHeader
                tabSelector
                tabContent
            }
        }
        .background(AppColors.screenBackground)
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
            match = MockDataService.allMatches.first { $0.id == matchId }
        }
        isLoading = false
    }

    // MARK: - Match Header (FotMob card style)

    private var matchHeader: some View {
        let m = displayMatch
        return VStack(spacing: 0) {
            VStack(spacing: 6) {
                Text(m.league.name)
                    .font(.system(size: 13))
                    .foregroundStyle(AppColors.textSecondary)

                HStack(spacing: 12) {
                    detailTeamView(m.homeTeam)

                    VStack(spacing: 4) {
                        if let h = m.homeScore, let a = m.awayScore {
                            Text("\(h) - \(a)")
                                .font(.system(size: 28, weight: .bold).monospacedDigit())
                                .foregroundStyle(AppColors.textPrimary)
                        } else {
                            Text("vs")
                                .font(.system(size: 18, weight: .bold))
                                .foregroundStyle(AppColors.textSecondary)
                        }

                        if m.isLive {
                            HStack(spacing: 4) {
                                Circle()
                                    .fill(AppColors.accent)
                                    .frame(width: 5, height: 5)
                                    .modifier(PulseModifier())
                                Text(m.displayTime)
                                    .font(.system(size: 13, weight: .bold))
                                    .foregroundStyle(AppColors.accent)
                            }
                        } else if m.status == .finished {
                            Text("Full Time")
                                .font(.system(size: 12, weight: .medium))
                                .foregroundStyle(AppColors.textSecondary)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 3)
                                .background(AppColors.elevated, in: Capsule())
                        } else {
                            VStack(spacing: 2) {
                                Text(m.startTime, style: .time)
                                    .font(.system(size: 13))
                                    .foregroundStyle(AppColors.textSecondary)
                                Text(m.startTime, style: .date)
                                    .font(.system(size: 11))
                                    .foregroundStyle(AppColors.textSecondary.opacity(0.7))
                            }
                        }
                    }

                    detailTeamView(m.awayTeam)
                }
            }
            .padding(.vertical, 16)
            .padding(.horizontal, 16)
        }
        .background(AppColors.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
        .padding(.horizontal, 10)
        .padding(.top, 8)
    }

    private func detailTeamView(_ team: Team) -> some View {
        VStack(spacing: 4) {
            AsyncImage(url: team.logoURL) { image in
                image.resizable().scaledToFit()
            } placeholder: {
                Circle()
                    .fill(Color(hex: team.primaryColor).opacity(0.3))
                    .overlay {
                        Text(team.shortName)
                            .font(.system(size: 12, weight: .bold))
                            .foregroundStyle(.white)
                    }
            }
            .frame(width: 36, height: 36)
            Text(team.name)
                .font(.system(size: 12, weight: .medium))
                .foregroundStyle(AppColors.textSecondary)
                .lineLimit(1)
                .frame(width: 80)
                .multilineTextAlignment(.center)
        }
    }

    // MARK: - Tab Selector (FotMob style)

    private var tabSelector: some View {
        HStack(spacing: 0) {
            ForEach(Array(tabs.enumerated()), id: \.offset) { idx, tab in
                Button {
                    withAnimation(.snappy) { selectedTab = idx }
                } label: {
                    VStack(spacing: 4) {
                        Text(tab)
                            .font(.system(size: 13, weight: selectedTab == idx ? .semibold : .regular))
                            .foregroundStyle(selectedTab == idx ? .white : AppColors.textSecondary)
                            .frame(maxWidth: .infinity)
                        Rectangle()
                            .fill(selectedTab == idx ? AppColors.accent : .clear)
                            .frame(height: 2)
                    }
                    .padding(.top, 8)
                }
            }
        }
        .background(AppColors.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
        .padding(.horizontal, 10)
        .padding(.top, 8)
    }

    // MARK: - Tab Content

    @ViewBuilder
    private var tabContent: some View {
        let m = displayMatch

        if m.league.sport == .soccer {
            switch selectedTab {
            case 0: summaryTab.padding(.horizontal, 10).padding(.top, 8)
            case 1: statsTab.padding(.horizontal, 10).padding(.top, 8)
            case 2: lineupsTab.padding(.horizontal, 10).padding(.top, 8)
            case 3: eventsTab.padding(.horizontal, 10).padding(.top, 8)
            default: EmptyView()
            }
        } else {
            switch selectedTab {
            case 0: americanSummaryTab.padding(.horizontal, 10).padding(.top, 8)
            case 1: statsTab.padding(.horizontal, 10).padding(.top, 8)
            case 2: playsTab.padding(.horizontal, 10).padding(.top, 8)
            default: EmptyView()
            }
        }
    }

    // MARK: - Summary Tab (Soccer)

    private var summaryTab: some View {
        let m = displayMatch
        return VStack(spacing: 0) {
            if m.status == .upcoming {
                upcomingView
            } else if !m.events.isEmpty {
                VStack(spacing: 0) {
                    ForEach(Array(m.events.enumerated()), id: \.element.id) { index, event in
                        eventRow(event)
                        if index < m.events.count - 1 {
                            Rectangle()
                                .fill(AppColors.separator)
                                .frame(height: 0.5)
                                .padding(.leading, 16)
                        }
                    }
                }
                .background(AppColors.cardBackground)
                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            } else {
                ContentUnavailableView("No Events Yet", systemImage: "clock",
                    description: Text("Events will appear once the match begins."))
            }
        }
    }

    // MARK: - American Sports Summary

    private var americanSummaryTab: some View {
        let m = displayMatch
        return VStack(spacing: 8) {
            if m.status == .upcoming {
                upcomingView
            } else {
                if m.homeScore != nil {
                    VStack(spacing: 0) {
                        HStack {
                            Text(m.homeTeam.shortName)
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundStyle(AppColors.textSecondary)
                                .frame(width: 50, alignment: .leading)
                            Spacer()
                            Text("\(m.homeScore ?? 0)")
                                .font(.system(size: 15, weight: .bold).monospacedDigit())
                                .foregroundStyle(AppColors.textPrimary)
                                .frame(width: 30)
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)

                        Rectangle().fill(AppColors.separator).frame(height: 0.5).padding(.leading, 16)

                        HStack {
                            Text(m.awayTeam.shortName)
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundStyle(AppColors.textSecondary)
                                .frame(width: 50, alignment: .leading)
                            Spacer()
                            Text("\(m.awayScore ?? 0)")
                                .font(.system(size: 15, weight: .bold).monospacedDigit())
                                .foregroundStyle(AppColors.textPrimary)
                                .frame(width: 30)
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)
                    }
                    .background(AppColors.cardBackground)
                    .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                }

                if !m.events.isEmpty {
                    VStack(alignment: .leading, spacing: 0) {
                        Text("KEY PLAYS")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundStyle(AppColors.textSecondary)
                            .tracking(1)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 10)

                        Rectangle().fill(AppColors.separator).frame(height: 0.5)

                        ForEach(Array(m.events.enumerated()), id: \.element.id) { index, event in
                            eventRow(event)
                            if index < m.events.count - 1 {
                                Rectangle()
                                    .fill(AppColors.separator)
                                    .frame(height: 0.5)
                                    .padding(.leading, 16)
                            }
                        }
                    }
                    .background(AppColors.cardBackground)
                    .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                }
            }
        }
    }

    // MARK: - Upcoming

    private var upcomingView: some View {
        let m = displayMatch
        return VStack(spacing: 8) {
            Image(systemName: "clock")
                .font(.system(size: 24))
                .foregroundStyle(AppColors.textSecondary)
            Text("Match hasn't started yet")
                .font(.system(size: 14, weight: .medium))
                .foregroundStyle(AppColors.textPrimary)
            Text(m.startTime, format: .dateTime.weekday(.wide).month(.wide).day())
                .font(.system(size: 13))
                .foregroundStyle(AppColors.textSecondary)
            Text(m.startTime, format: .dateTime.hour().minute())
                .font(.system(size: 13))
                .foregroundStyle(AppColors.textSecondary)
        }
        .padding(.vertical, 16)
        .frame(maxWidth: .infinity)
        .background(AppColors.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
    }

    // MARK: - Stats Tab

    private var statsTab: some View {
        let m = displayMatch
        return VStack(spacing: 0) {
            if let stats = m.stats {
                VStack(spacing: 0) {
                    ForEach(Array(stats.items.enumerated()), id: \.element.id) { index, stat in
                        VStack(spacing: 4) {
                            HStack {
                                Text("\(stat.home)")
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundStyle(AppColors.textPrimary)
                                Spacer()
                                Text(stat.name)
                                    .font(.system(size: 12))
                                    .foregroundStyle(AppColors.textSecondary)
                                Spacer()
                                Text("\(stat.away)")
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundStyle(AppColors.textPrimary)
                            }

                            GeometryReader { geo in
                                let total = max(stat.home + stat.away, 1)
                                let homeWidth = geo.size.width * CGFloat(stat.home) / CGFloat(total)
                                HStack(spacing: 2) {
                                    RoundedRectangle(cornerRadius: 2)
                                        .fill(AppColors.accent)
                                        .frame(width: max(homeWidth, 2), height: 3)
                                    RoundedRectangle(cornerRadius: 2)
                                        .fill(AppColors.textSecondary.opacity(0.3))
                                        .frame(width: max(geo.size.width - homeWidth - 2, 2), height: 3)
                                }
                            }
                            .frame(height: 3)
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)

                        if index < stats.items.count - 1 {
                            Rectangle()
                                .fill(AppColors.separator)
                                .frame(height: 0.5)
                                .padding(.leading, 16)
                        }
                    }
                }
                .background(AppColors.cardBackground)
                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            } else {
                ContentUnavailableView("No Stats Available", systemImage: "chart.bar",
                    description: Text("Statistics will appear during the match."))
            }
        }
    }

    // MARK: - Lineups Tab

    private var lineupsTab: some View {
        let m = displayMatch
        return VStack(spacing: 0) {
            if let lineups = m.lineups {
                VStack(spacing: 0) {
                    // Formation header
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(m.homeTeam.shortName)
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundStyle(AppColors.textPrimary)
                            Text(lineups.homeFormation)
                                .font(.system(size: 12))
                                .foregroundStyle(AppColors.accent)
                        }
                        Spacer()
                        VStack(alignment: .trailing, spacing: 2) {
                            Text(m.awayTeam.shortName)
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundStyle(AppColors.textPrimary)
                            Text(lineups.awayFormation)
                                .font(.system(size: 12))
                                .foregroundStyle(AppColors.accent)
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)

                    Rectangle().fill(AppColors.separator).frame(height: 0.5)

                    ForEach(Array(zip(lineups.homeStarting, lineups.awayStarting).enumerated()), id: \.offset) { index, pair in
                        HStack {
                            HStack(spacing: 6) {
                                Text("\(pair.0.number)")
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundStyle(AppColors.accent)
                                    .frame(width: 22)
                                Text(pair.0.name)
                                    .font(.system(size: 13, weight: .medium))
                                    .foregroundStyle(AppColors.textPrimary)
                            }
                            Spacer()
                            HStack(spacing: 6) {
                                Text(pair.1.name)
                                    .font(.system(size: 13, weight: .medium))
                                    .foregroundStyle(AppColors.textPrimary)
                                Text("\(pair.1.number)")
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundStyle(AppColors.accent)
                                    .frame(width: 22)
                            }
                        }
                        .padding(.horizontal, 16)
                        .frame(height: 44)

                        if index < lineups.homeStarting.count - 1 {
                            Rectangle()
                                .fill(AppColors.separator)
                                .frame(height: 0.5)
                                .padding(.leading, 16)
                        }
                    }
                }
                .background(AppColors.cardBackground)
                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            } else {
                ContentUnavailableView("No Lineups Available", systemImage: "person.3",
                    description: Text("Lineups will be announced closer to kick-off."))
            }
        }
    }

    // MARK: - Plays Tab (American Sports)

    private var playsTab: some View {
        let m = displayMatch
        return VStack(spacing: 0) {
            if !m.events.isEmpty {
                VStack(spacing: 0) {
                    ForEach(Array(m.events.sorted(by: { $0.minute > $1.minute }).enumerated()), id: \.element.id) { index, event in
                        HStack(spacing: 10) {
                            Image(systemName: playIcon(event.type.rawValue))
                                .font(.system(size: 13))
                                .foregroundStyle(eventColor(event.type))
                                .frame(width: 24)

                            VStack(alignment: .leading, spacing: 2) {
                                Text(event.playerName)
                                    .font(.system(size: 13, weight: .medium))
                                    .foregroundStyle(AppColors.textPrimary)
                                if let assist = event.detail, !assist.isEmpty {
                                    Text(assist)
                                        .font(.system(size: 11))
                                        .foregroundStyle(AppColors.textSecondary)
                                }
                            }

                            Spacer()

                            Text(event.type.rawValue.capitalized)
                                .font(.system(size: 11, weight: .medium))
                                .foregroundStyle(AppColors.textSecondary)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(AppColors.elevated, in: Capsule())
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)

                        if index < m.events.count - 1 {
                            Rectangle()
                                .fill(AppColors.separator)
                                .frame(height: 0.5)
                                .padding(.leading, 16)
                        }
                    }
                }
                .background(AppColors.cardBackground)
                .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            } else {
                ContentUnavailableView("No Play Data", systemImage: "play.rectangle",
                    description: Text("Play-by-play data is not yet available for this match."))
            }
        }
    }

    private func playIcon(_ type: String) -> String {
        switch type.lowercased() {
        case "goal", "touchdown", "score": return "flame.fill"
        case "shot", "fieldgoal", "3pt": return "scope"
        case "foul", "penalty", "flag": return "exclamationmark.triangle.fill"
        case "substitution", "sub": return "arrow.left.arrow.right"
        case "yellowcard", "yellow": return "rectangle.fill"
        case "redcard", "red": return "rectangle.fill"
        default: return "circle.fill"
        }
    }

    // MARK: - Commentary Tab

    private var eventsTab: some View {
        let m = displayMatch
        return VStack(spacing: 8) {
            if !m.events.isEmpty {
                ForEach(m.events.sorted(by: { $0.minute > $1.minute })) { event in
                    commentaryRow(event)
                }
            } else {
                ContentUnavailableView("No Commentary", systemImage: "text.bubble",
                    description: Text("Commentary will appear as the match progresses."))
            }
        }
    }

    private func commentaryRow(_ event: MatchEvent) -> some View {
        let m = displayMatch
        let isHome = event.teamId == m.homeTeam.id || event.teamId == "home"
        let teamName = isHome ? m.homeTeam.shortName : m.awayTeam.shortName
        return HStack(spacing: 0) {
            RoundedRectangle(cornerRadius: 2)
                .fill(eventColor(event.type))
                .frame(width: 3)

            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 6) {
                    Text("\(event.minute)'")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundStyle(eventColor(event.type))
                    Image(systemName: event.type.icon)
                        .font(.system(size: 11))
                        .foregroundStyle(eventColor(event.type))
                    Text(event.type.label)
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundStyle(AppColors.textSecondary)
                    Spacer()
                    Text(teamName)
                        .font(.system(size: 11, weight: .medium))
                        .foregroundStyle(AppColors.textSecondary)
                }

                Text(commentaryText(event, teamName: teamName))
                    .font(.system(size: 13, weight: .medium))
                    .foregroundStyle(AppColors.textPrimary)
                    .fixedSize(horizontal: false, vertical: true)

                if let detail = event.detail, !detail.isEmpty {
                    Text("Assist: \(detail)")
                        .font(.system(size: 11))
                        .foregroundStyle(AppColors.textSecondary)
                }
            }
            .padding(.leading, 10)
            .padding(.vertical, 10)
            .padding(.trailing, 12)
        }
        .background(AppColors.cardBackground, in: RoundedRectangle(cornerRadius: 12, style: .continuous))
    }

    private func commentaryText(_ event: MatchEvent, teamName: String) -> String {
        switch event.type {
        case .goal:
            if let assist = event.detail, !assist.isEmpty {
                return "GOAL! \(event.playerName) scores for \(teamName)! Assisted by \(assist)."
            }
            return "GOAL! \(event.playerName) scores for \(teamName)!"
        case .penalty:
            return "PENALTY GOAL! \(event.playerName) converts from the spot for \(teamName)!"
        case .ownGoal:
            return "OWN GOAL! \(event.playerName) puts the ball into their own net."
        case .yellowCard:
            return "\(event.playerName) is shown a yellow card by the referee."
        case .redCard:
            return "\(event.playerName) receives a red card! \(teamName) down to 10 men."
        case .substitution:
            if let playerOut = event.detail, !playerOut.isEmpty {
                return "Substitution for \(teamName): \(event.playerName) comes on for \(playerOut)."
            }
            return "Substitution for \(teamName): \(event.playerName) comes on."
        }
    }

    // MARK: - Summary Event Row

    private func eventRow(_ event: MatchEvent) -> some View {
        let m = displayMatch
        let isHome = event.teamId == m.homeTeam.id || event.teamId == "home"
        return HStack(spacing: 8) {
            if !isHome { Spacer() }
            Text("\(event.minute)'")
                .font(.system(size: 12, weight: .bold))
                .foregroundStyle(AppColors.textSecondary)
                .frame(width: 28)
            Image(systemName: event.type.icon)
                .font(.system(size: 12))
                .foregroundStyle(eventColor(event.type))
            VStack(alignment: isHome ? .leading : .trailing, spacing: 2) {
                Text(event.playerName)
                    .font(.system(size: 13, weight: .medium))
                    .foregroundStyle(AppColors.textPrimary)
                if let detail = event.detail, !detail.isEmpty {
                    Text(event.type == .substitution ? "for \(detail)" : "Ast. \(detail)")
                        .font(.system(size: 11))
                        .foregroundStyle(AppColors.textSecondary)
                }
            }
            if isHome { Spacer() }
        }
        .padding(.vertical, 8)
        .padding(.horizontal, 16)
    }

    private func eventColor(_ type: MatchEventType) -> Color {
        switch type {
        case .goal, .penalty: AppColors.accent
        case .yellowCard: .yellow
        case .redCard: .red
        case .substitution: Color(hex: "3B82F6")
        case .ownGoal: .orange
        }
    }
}
