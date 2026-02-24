import SwiftUI

struct HomeView: View {
    @Environment(SportSelection.self) private var sportSelection
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

    var body: some View {
        VStack(spacing: 0) {
            // Date picker strip
            datePickerBar

            if viewModel.isLoading && viewModel.groups.isEmpty {
                Spacer()
                Image("Logo")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 40, height: 40)
                    .opacity(0.4)
                Spacer()
            } else if viewModel.groups.isEmpty {
                Spacer()
                VStack(spacing: 8) {
                    Image("Logo")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 36, height: 36)
                        .opacity(0.15)
                    Text("No Matches")
                        .font(.system(size: 16, weight: .semibold, design: .rounded))
                        .foregroundStyle(AppColors.textSecondary)
                    Text("No matches available for \(dateLabel.lowercased()).")
                        .font(.system(size: 13, design: .rounded))
                        .foregroundStyle(AppColors.textTertiary)
                }
                Spacer()
            } else {
                ScrollView {
                    // Live count banner
                    let liveCount = viewModel.groups.flatMap(\.matches).filter(\.isLive).count
                    if liveCount > 0 && selectedDateOffset == 0 {
                        HStack(spacing: 6) {
                            Circle()
                                .fill(AppColors.livePulse)
                                .frame(width: 6, height: 6)
                                .modifier(PulseModifier())
                            Text("\(liveCount) live")
                                .font(.system(size: 12, weight: .semibold, design: .rounded))
                                .foregroundStyle(AppColors.livePulse)
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 6)
                        .frame(maxWidth: .infinity, alignment: .leading)
                    }

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

    // MARK: - Date Picker Bar

    private var datePickerBar: some View {
        HStack(spacing: 0) {
            Button {
                withAnimation(.snappy) { selectedDateOffset -= 1 }
            } label: {
                Image(systemName: "chevron.left")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundStyle(AppColors.textTertiary)
            }
            .frame(width: 36)

            ForEach([-1, 0, 1], id: \.self) { offset in
                let label: String = switch offset {
                case -1: "Yesterday"
                case 0: "Today"
                case 1: "Tomorrow"
                default: ""
                }
                Button {
                    withAnimation(.snappy) { selectedDateOffset = offset }
                } label: {
                    Text(label)
                        .font(.system(size: 12, weight: selectedDateOffset == offset ? .bold : .regular, design: .rounded))
                        .foregroundStyle(selectedDateOffset == offset ? .white : AppColors.textTertiary)
                        .frame(maxWidth: .infinity)
                }
            }

            Button {
                withAnimation(.snappy) { selectedDateOffset += 1 }
            } label: {
                Image(systemName: "chevron.right")
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundStyle(AppColors.textTertiary)
            }
            .frame(width: 36)
        }
        .frame(height: 36)
        .background(AppColors.surface.opacity(0.3))
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
        case .nba: URL(string: "https://a.espncdn.com/i/teamlogos/leagues/500/nba.png")
        case .nfl: URL(string: "https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png")
        case .nhl: URL(string: "https://a.espncdn.com/i/teamlogos/leagues/500/nhl.png")
        case .mlb: URL(string: "https://a.espncdn.com/i/teamlogos/leagues/500/mlb.png")
        default: league.logoURL
        }
    }
}

// MARK: - FotMob Match Row (44pt height)

struct FotMobMatchRow: View {
    let match: Match

    var body: some View {
        HStack(spacing: 0) {
            HStack(spacing: 6) {
                Text(match.homeTeam.name)
                    .font(.system(size: 13))
                    .foregroundStyle(.white)
                    .lineLimit(1)
                    .frame(maxWidth: .infinity, alignment: .trailing)
                teamBadge(match.homeTeam)
            }

            VStack(spacing: 1) {
                if let hs = match.homeScore, let aws = match.awayScore {
                    Text("\(hs) - \(aws)")
                        .font(.system(size: 14, weight: .bold).monospacedDigit())
                        .foregroundStyle(match.isLive ? AppColors.livePulse : .white)
                } else {
                    Text(match.displayTime)
                        .font(.system(size: 13))
                        .foregroundStyle(AppColors.textTertiary)
                }

                if match.isLive {
                    HStack(spacing: 2) {
                        Circle()
                            .fill(AppColors.livePulse)
                            .frame(width: 4, height: 4)
                            .modifier(PulseModifier())
                        Text(match.displayTime)
                            .font(.system(size: 9, weight: .semibold))
                            .foregroundStyle(AppColors.livePulse)
                    }
                } else if match.status == .finished {
                    Text(match.displayTime)
                        .font(.system(size: 9))
                        .foregroundStyle(AppColors.textTertiary)
                }
            }
            .frame(width: 56)

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
