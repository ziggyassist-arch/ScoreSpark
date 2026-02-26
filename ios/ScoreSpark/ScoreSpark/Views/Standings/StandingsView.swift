import SwiftUI

struct StandingsView: View {
    @Environment(SportSelection.self) private var sportSelection
    @State private var viewModel = StandingsViewModel()

    var body: some View {
        VStack(spacing: 0) {
            // League selector (compact)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 4) {
                    ForEach(viewModel.leagues) { league in
                        Button {
                            withAnimation(.snappy) {
                                viewModel.selectedLeague = league
                            }
                        } label: {
                            Text(league.name)
                                .font(.system(size: 11, weight: .medium, design: .rounded))
                                .foregroundStyle(
                                    viewModel.selectedLeague.id == league.id
                                        ? AppColors.darkNavy
                                        : AppColors.textSecondary
                                )
                                .padding(.horizontal, 6)
                                .padding(.vertical, 3)
                                .background(
                                    viewModel.selectedLeague.id == league.id
                                        ? AppColors.gold
                                        : AppColors.surface,
                                    in: Capsule()
                                )
                        }
                    }
                }
                .padding(.horizontal, 4)
                .padding(.vertical, 2)
            }

            if viewModel.isLoading {
                Spacer()
                ProgressView()
                    .tint(AppColors.gold)
                Spacer()
            } else if viewModel.standings.isEmpty {
                ContentUnavailableView("No Standings", systemImage: "list.number",
                    description: Text("Standings are not available for this league yet."))
                    .frame(maxHeight: .infinity)
            } else {
                // Table header
                HStack(spacing: 0) {
                    Text("#")
                        .frame(width: 22, alignment: .center)
                    Text("Team")
                        .padding(.leading, 4)
                    Spacer()
                    Group {
                        Text("P").frame(width: 24)
                        Text("W").frame(width: 24)
                        Text("D").frame(width: 24)
                        Text("L").frame(width: 24)
                        Text("GD").frame(width: 28)
                        Text("Pts").frame(width: 28)
                    }
                    Text("Form").frame(width: 40)
                }
                .font(.system(size: 9, weight: .semibold, design: .rounded))
                .foregroundStyle(AppColors.textTertiary)
                .padding(.horizontal, 4)
                .frame(height: 22)

                // Rows
                ScrollView {
                    LazyVStack(spacing: 0) {
                        ForEach(viewModel.standings) { standing in
                            StandingRow(standing: standing)
                            Rectangle()
                                .fill(Color.white.opacity(0.04))
                                .frame(height: 0.5)
                        }
                    }
                }
            }
        }
        .background(AppColors.background)
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
        HStack(spacing: 0) {
            // Position number
            Text("\(standing.position)")
                .font(.system(size: 11, weight: .bold, design: .rounded))
                .foregroundStyle(positionColor)
                .frame(width: 22, alignment: .center)

            // Team logo
            AsyncImage(url: standing.team.logoURL) { image in
                image.resizable().scaledToFit()
            } placeholder: {
                Circle()
                    .fill(Color(hex: standing.team.primaryColor).opacity(0.3))
                    .overlay {
                        Text(String(standing.team.shortName.prefix(2)))
                            .font(.system(size: 6, weight: .bold))
                            .foregroundStyle(.white)
                    }
            }
            .frame(width: 18, height: 18)
            .padding(.leading, 2)

            // Team name (full)
            Text(standing.team.name)
                .font(.system(size: 13, weight: .medium, design: .rounded))
                .foregroundStyle(AppColors.textPrimary)
                .lineLimit(1)
                .padding(.leading, 4)

            Spacer(minLength: 2)

            // Stats columns
            Group {
                Text("\(standing.played)").frame(width: 24)
                Text("\(standing.won)").frame(width: 24)
                Text("\(standing.drawn)").frame(width: 24)
                Text("\(standing.lost)").frame(width: 24)
                Text("\(standing.goalDifference > 0 ? "+" : "")\(standing.goalDifference)").frame(width: 28)
                Text("\(standing.points)")
                    .fontWeight(.bold)
                    .foregroundStyle(AppColors.gold)
                    .frame(width: 28)
            }
            .font(.system(size: 11, weight: .medium, design: .rounded))
            .foregroundStyle(AppColors.textSecondary)

            // Form guide dots
            HStack(spacing: 2) {
                ForEach(Array(standing.form.suffix(5).enumerated()), id: \.offset) { _, result in
                    Circle()
                        .fill(formColor(result))
                        .frame(width: 6, height: 6)
                }
            }
            .frame(width: 40)
        }
        .padding(3)
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
