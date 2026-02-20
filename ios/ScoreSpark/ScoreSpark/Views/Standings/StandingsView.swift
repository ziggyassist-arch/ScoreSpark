import SwiftUI

struct StandingsView: View {
    @Environment(SportSelection.self) private var sportSelection
    @State private var viewModel = StandingsViewModel()

    var body: some View {
        VStack(spacing: 0) {
            // Sport switcher
            SportSwitcher()
                .padding(.vertical, 8)

            // League selector
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(viewModel.leagues) { league in
                        Button {
                            withAnimation(.snappy) {
                                viewModel.selectedLeague = league
                            }
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
                .padding(.vertical, 8)
            }

            if viewModel.standings.isEmpty && !viewModel.isLoading {
                ContentUnavailableView("No Standings", systemImage: "list.number",
                    description: Text("Standings are not available for this league yet."))
                    .frame(maxHeight: .infinity)
            } else {
                // Table header
                HStack {
                    Text("#")
                        .frame(width: 24, alignment: .center)
                    Text("Team")
                    Spacer()
                    Group {
                        Text("P").frame(width: 26)
                        Text("W").frame(width: 26)
                        Text("D").frame(width: 26)
                        Text("L").frame(width: 26)
                        Text("GD").frame(width: 30)
                        Text("Pts").frame(width: 30)
                    }
                    // Form guide
                    Text("Form").frame(width: 60)
                }
                .font(.system(size: 10, weight: .semibold, design: .rounded))
                .foregroundStyle(AppColors.textTertiary)
                .padding(.horizontal, 12)
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
        }
        .background(AppColors.background)
        .navigationTitle("Standings")
        .toolbarTitleDisplayMode(.large)
        .onChange(of: sportSelection.current) { _, newSport in
            viewModel.updateLeagues(for: newSport)
        }
        .task(id: viewModel.selectedLeague.id) {
            await viewModel.load()
        }
        .task {
            viewModel.updateLeagues(for: sportSelection.current)
        }
    }
}

struct StandingRow: View {
    let standing: Standing

    var body: some View {
        HStack {
            Text("\(standing.position)")
                .font(.system(size: 12, weight: .bold, design: .rounded))
                .foregroundStyle(positionColor)
                .frame(width: 24, alignment: .center)

            Text(standing.team.name)
                .font(.system(size: 13, weight: .medium, design: .rounded))
                .foregroundStyle(AppColors.textPrimary)
                .lineLimit(1)

            Spacer()

            Group {
                Text("\(standing.played)").frame(width: 26)
                Text("\(standing.won)").frame(width: 26)
                Text("\(standing.drawn)").frame(width: 26)
                Text("\(standing.lost)").frame(width: 26)
                Text("\(standing.goalDifference > 0 ? "+" : "")\(standing.goalDifference)").frame(width: 30)
                Text("\(standing.points)")
                    .fontWeight(.bold)
                    .foregroundStyle(AppColors.gold)
                    .frame(width: 30)
            }
            .font(.system(size: 11, weight: .medium, design: .rounded))
            .foregroundStyle(AppColors.textSecondary)

            // Form guide dots
            HStack(spacing: 3) {
                ForEach(Array(standing.form.enumerated()), id: \.offset) { _, result in
                    Circle()
                        .fill(formColor(result))
                        .frame(width: 8, height: 8)
                }
            }
            .frame(width: 60)
        }
        .padding(.horizontal, 12)
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

    private func formColor(_ result: FormResult) -> Color {
        switch result {
        case .win: AppColors.win
        case .draw: AppColors.draw
        case .loss: AppColors.loss
        }
    }
}
