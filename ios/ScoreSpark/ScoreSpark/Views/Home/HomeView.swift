import SwiftUI

struct HomeView: View {
    @Environment(SportSelection.self) private var sportSelection
    @Binding var selectedMatchId: String?
    @State private var viewModel = MatchesViewModel()
    @State private var selectedDateOffset = 0

    private var dateLabel: String {
        switch selectedDateOffset {
        case -1: return "Yesterday"
        case 0: return "Today"
        case 1: return "Tomorrow"
        default:
            let date = Calendar.current.date(byAdding: .day, value: selectedDateOffset, to: Date()) ?? Date()
            return date.formatted(.dateTime.month(.abbreviated).day())
        }
    }

    // Generate date range for horizontal scroll picker
    private var dateRange: [Int] {
        Array(-3...3)
    }

    private func dateString(for offset: Int) -> String {
        switch offset {
        case -1: return "Yesterday"
        case 0: return "Today"
        case 1: return "Tomorrow"
        default:
            let date = Calendar.current.date(byAdding: .day, value: offset, to: Date()) ?? Date()
            let fmt = DateFormatter()
            fmt.dateFormat = "EEE d"
            return fmt.string(from: date)
        }
    }

    var body: some View {
        VStack(spacing: 0) {
            datePickerBar

            if viewModel.isLoading && viewModel.groups.isEmpty {
                Spacer()
                ProgressView()
                    .tint(AppColors.accent)
                Spacer()
            } else if viewModel.groups.isEmpty {
                Spacer()
                VStack(spacing: 8) {
                    Image(systemName: "sportscourt")
                        .font(.system(size: 28))
                        .foregroundStyle(AppColors.textSecondary.opacity(0.5))
                    Text("No Matches")
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundStyle(AppColors.textPrimary)
                    Text("No matches available for \(dateLabel.lowercased()).")
                        .font(.system(size: 13))
                        .foregroundStyle(AppColors.textSecondary)
                }
                Spacer()
            } else {
                ScrollView {
                    // Live count banner
                    let liveCount = viewModel.groups.flatMap(\.matches).filter(\.isLive).count
                    if liveCount > 0 && selectedDateOffset == 0 {
                        HStack(spacing: 4) {
                            Circle()
                                .fill(AppColors.accent)
                                .frame(width: 6, height: 6)
                                .modifier(PulseModifier())
                            Text("\(liveCount) LIVE")
                                .font(.system(size: 11, weight: .bold))
                                .foregroundStyle(AppColors.accent)
                        }
                        .padding(.horizontal, 12)
                        .padding(.vertical, 2)
                        .frame(maxWidth: .infinity, alignment: .leading)
                    }

                    LazyVStack(spacing: 4) {
                        ForEach(viewModel.groups) { group in
                            leagueCard(group)
                        }
                    }
                    .padding(.top, 4)
                    .padding(.bottom, 8)
                }
            }
        }
        .background(AppColors.screenBackground)
        .task(id: "\(sportSelection.current.rawValue)-\(selectedDateOffset)") {
            let date: String? = selectedDateOffset == 0 ? nil : {
                let d = Calendar.current.date(byAdding: .day, value: selectedDateOffset, to: Date()) ?? Date()
                let fmt = DateFormatter()
                fmt.dateFormat = "yyyy-MM-dd"
                return fmt.string(from: d)
            }()
            await viewModel.load(sport: sportSelection.current, date: date)
        }
    }

    // MARK: - Date Picker Bar (44pt, horizontal scroll, FotMob style)

    private var datePickerBar: some View {
        ScrollViewReader { proxy in
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 16) {
                    ForEach(dateRange, id: \.self) { offset in
                        Button {
                            withAnimation(.snappy) { selectedDateOffset = offset }
                        } label: {
                            VStack(spacing: 2) {
                                Text(dateString(for: offset))
                                    .font(.system(size: 13, weight: selectedDateOffset == offset ? .bold : .regular))
                                    .foregroundStyle(selectedDateOffset == offset ? .white : AppColors.textSecondary)

                                Rectangle()
                                    .fill(selectedDateOffset == offset ? AppColors.accent : Color.clear)
                                    .frame(height: 2)
                            }
                        }
                        .id(offset)
                    }
                }
                .padding(.horizontal, 16)
            }
            .frame(height: 36)
            .background(AppColors.screenBackground)
            .onAppear {
                proxy.scrollTo(0, anchor: .center)
            }
            .onChange(of: selectedDateOffset) { _, newValue in
                withAnimation { proxy.scrollTo(newValue, anchor: .center) }
            }
        }
    }

    // MARK: - League Section Card (FotMob style)

    private func leagueCard(_ group: LeagueGroup) -> some View {
        VStack(spacing: 0) {
            HStack(spacing: 6) {
                if let url = leagueLogoURL(for: group.league) {
                    AsyncImage(url: url) { image in
                        image.resizable().scaledToFit()
                    } placeholder: {
                        EmptyView()
                    }
                    .frame(width: 20, height: 20)
                }
                Text(group.league.name)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(.white)
                    .lineLimit(1)
                if !group.league.country.isEmpty {
                    Text(group.league.country)
                        .font(.system(size: 12))
                        .foregroundStyle(AppColors.textSecondary)
                        .lineLimit(1)
                }
                Spacer()
                Image(systemName: "chevron.right")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundStyle(AppColors.textSecondary)
            }
            .padding(.horizontal, 12)
            .frame(height: 40)

            Rectangle()
                .fill(AppColors.separator)
                .frame(height: 0.5)

            ForEach(Array(group.matches.enumerated()), id: \.element.id) { index, match in
                Button {
                    selectedMatchId = match.id
                } label: {
                    FotMobMatchRow(match: match)
                }
                .buttonStyle(.plain)

                if index < group.matches.count - 1 {
                    Rectangle()
                        .fill(AppColors.separator)
                        .frame(height: 0.5)
                        .padding(.leading, 12)
                }
            }
        }
        .background(AppColors.cardBackground)
        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
        .padding(.horizontal, 8)
    }

    private func leagueLogoURL(for league: League) -> URL? {
        switch league.sport {
        case .nba: URL(string: "https://a.espncdn.com/i/teamlogos/leagues/500/nba.png")
        case .nfl: URL(string: "https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png")
        case .nhl: URL(string: "https://a.espncdn.com/i/teamlogos/leagues/500/nhl.png")
        case .mlb: URL(string: "https://a.espncdn.com/i/teamlogos/leagues/500/mlb.png")
        default: league.logoURL
        }
    }
}

// MARK: - FotMob Match Row (80pt — symmetric horizontal layout)

struct FotMobMatchRow: View {
    let match: Match

    var body: some View {
        HStack(spacing: 0) {
            HStack(spacing: 6) {
                Text(match.homeTeam.shortName)
                    .font(.system(size: 13, weight: .medium))
                    .foregroundStyle(.white)
                    .lineLimit(1)
                    .frame(maxWidth: .infinity, alignment: .trailing)
                teamBadge(match.homeTeam)
            }

            VStack(spacing: 1) {
                if let hs = match.homeScore, let aws = match.awayScore {
                    Text("\(hs) - \(aws)")
                        .font(.system(size: 15, weight: .bold).monospacedDigit())
                        .foregroundStyle(match.isLive ? AppColors.livePulse : .white)
                } else {
                    Text(match.displayTime)
                        .font(.system(size: 12, weight: .medium))
                        .foregroundStyle(.white)
                }

                if match.isLive {
                    HStack(spacing: 2) {
                        Circle()
                            .fill(AppColors.livePulse)
                            .frame(width: 4, height: 4)
                            .modifier(PulseModifier())
                        Text(match.displayTime)
                            .font(.system(size: 10, weight: .semibold))
                            .foregroundStyle(AppColors.livePulse)
                    }
                } else if match.status == .finished {
                    Text("FT")
                        .font(.system(size: 10))
                        .foregroundStyle(AppColors.textSecondary)
                }
            }
            .frame(width: 56)

            HStack(spacing: 6) {
                teamBadge(match.awayTeam)
                Text(match.awayTeam.shortName)
                    .font(.system(size: 13, weight: .medium))
                    .foregroundStyle(.white)
                    .lineLimit(1)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
        }
        .padding(.horizontal, 12)
        .frame(height: 52)
    }

    private func teamBadge(_ team: Team) -> some View {
        AsyncImage(url: team.logoURL) { image in
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
        .frame(width: 24, height: 24)
    }
}
