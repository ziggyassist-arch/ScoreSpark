import SwiftUI

struct StandingsView: View {
    @Environment(SportSelection.self) private var sportSelection
    @State private var viewModel = StandingsViewModel()

    var body: some View {
        VStack(spacing: 0) {
            // League selector
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(viewModel.leagues) { league in
                        Button {
                            withAnimation(.snappy) { viewModel.selectedLeague = league }
                        } label: {
                            Text(league.name)
                                .font(AppTypography.subheadline)
                                .foregroundStyle(
                                    viewModel.selectedLeague.id == league.id
                                        ? AppColors.darkNavy
                                        : AppColors.textSecondary
                                )
                                .padding(.horizontal, 16)
                                .padding(.vertical, 8)
                                .background(
                                    viewModel.selectedLeague.id == league.id
                                        ? AppColors.gold
                                        : AppColors.surface,
                                    in: Capsule()
                                )
                        }
                    }
                }
                .padding(.horizontal)
                .padding(.vertical, 12)
            }

            // Table header
            HStack {
                Text("#")
                    .frame(width: 28, alignment: .center)
                Text("Team")
                Spacer()
                Group {
                    Text("P").frame(width: 28)
                    Text("W").frame(width: 28)
                    Text("D").frame(width: 28)
                    Text("L").frame(width: 28)
                    Text("GD").frame(width: 32)
                    Text("Pts").frame(width: 32)
                }
            }
            .font(.system(size: 11, weight: .semibold, design: .rounded))
            .foregroundStyle(AppColors.textTertiary)
            .padding(.horizontal)
            .padding(.vertical, 8)

            // Rows
            ScrollView {
                LazyVStack(spacing: 0) {
                    ForEach(viewModel.standings) { standing in
                        StandingRow(standing: standing)
                        Divider().overlay(AppColors.surface)
                    }
                }
            }
        }
        .background(AppColors.background)
        .navigationTitle("Standings")
        .toolbarTitleDisplayMode(.large)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) { SportSwitcher() }
        }
        .task(id: viewModel.selectedLeague.id) {
            await viewModel.load()
        }
    }
}

struct StandingRow: View {
    let standing: Standing

    var body: some View {
        HStack {
            Text("\(standing.position)")
                .font(.system(size: 13, weight: .bold, design: .rounded))
                .foregroundStyle(positionColor)
                .frame(width: 28, alignment: .center)

            Text(standing.team.name)
                .font(AppTypography.subheadline)
                .foregroundStyle(AppColors.textPrimary)
                .lineLimit(1)

            Spacer()

            Group {
                Text("\(standing.played)").frame(width: 28)
                Text("\(standing.won)").frame(width: 28)
                Text("\(standing.drawn)").frame(width: 28)
                Text("\(standing.lost)").frame(width: 28)
                Text("\(standing.goalDifference > 0 ? "+" : "")\(standing.goalDifference)").frame(width: 32)
                Text("\(standing.points)")
                    .fontWeight(.bold)
                    .foregroundStyle(AppColors.gold)
                    .frame(width: 32)
            }
            .font(.system(size: 12, weight: .medium, design: .rounded))
            .foregroundStyle(AppColors.textSecondary)
        }
        .padding(.horizontal)
        .padding(.vertical, 10)
    }

    private var positionColor: Color {
        switch standing.position {
        case 1...4: AppColors.accent
        case 5...6: AppColors.gold
        case 18...20: AppColors.livePulse
        default: AppColors.textTertiary
        }
    }
}
