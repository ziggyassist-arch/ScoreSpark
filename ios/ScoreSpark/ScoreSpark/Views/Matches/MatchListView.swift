import SwiftUI

struct MatchListView: View {
    @Environment(SportSelection.self) private var sportSelection
    @State private var viewModel = MatchesViewModel()

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Date picker row
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(-2..<5, id: \.self) { offset in
                            let date = Calendar.current.date(byAdding: .day, value: offset, to: Date())!
                            DateChip(
                                date: date,
                                isSelected: Calendar.current.isDate(date, inSameDayAs: viewModel.selectedDate)
                            ) {
                                viewModel.selectedDate = date
                            }
                        }
                    }
                    .padding(.horizontal)
                }

                // League groups
                ForEach(viewModel.groups) { group in
                    VStack(alignment: .leading, spacing: 12) {
                        HStack(spacing: 8) {
                            Text(group.league.name)
                                .font(AppTypography.headline)
                            Text(group.league.country)
                                .font(AppTypography.caption)
                                .foregroundStyle(AppColors.textTertiary)
                        }
                        .foregroundStyle(AppColors.textPrimary)
                        .padding(.horizontal)

                        ForEach(group.matches) { match in
                            NavigationLink(value: match.id) {
                                CompactMatchRow(match: match)
                            }
                            .buttonStyle(.plain)
                        }
                        .padding(.horizontal)
                    }
                }
            }
            .padding(.vertical)
        }
        .background(AppColors.background)
        .navigationTitle("Matches")
        .toolbarTitleDisplayMode(.large)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) { SportSwitcher() }
        }
        .navigationDestination(for: String.self) { matchId in
            MatchDetailView(matchId: matchId)
        }
        .task(id: sportSelection.current) {
            await viewModel.load(sport: sportSelection.current)
        }
    }
}

struct DateChip: View {
    let date: Date
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 2) {
                Text(date.formatted(.dateTime.weekday(.abbreviated)))
                    .font(.system(size: 10, weight: .medium, design: .rounded))
                Text(date.formatted(.dateTime.day()))
                    .font(.system(size: 16, weight: .bold, design: .rounded))
            }
            .foregroundStyle(isSelected ? AppColors.darkNavy : AppColors.textSecondary)
            .frame(width: 48, height: 56)
            .background(isSelected ? AppColors.gold : AppColors.surface, in: RoundedRectangle(cornerRadius: 12, style: .continuous))
        }
    }
}

struct CompactMatchRow: View {
    let match: Match

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(match.homeTeam.name)
                        .font(AppTypography.subheadline)
                    Spacer()
                    if let s = match.homeScore {
                        Text("\(s)")
                            .font(AppTypography.headline)
                    }
                }
                HStack {
                    Text(match.awayTeam.name)
                        .font(AppTypography.subheadline)
                    Spacer()
                    if let s = match.awayScore {
                        Text("\(s)")
                            .font(AppTypography.headline)
                    }
                }
            }
            .foregroundStyle(AppColors.textPrimary)

            VStack {
                if match.isLive {
                    Text(match.displayTime)
                        .font(.system(size: 11, weight: .black, design: .rounded))
                        .foregroundStyle(AppColors.livePulse)
                } else {
                    Text(match.displayTime)
                        .font(AppTypography.caption)
                        .foregroundStyle(AppColors.textTertiary)
                }
            }
            .frame(width: 44)
        }
        .cardStyle()
    }
}
