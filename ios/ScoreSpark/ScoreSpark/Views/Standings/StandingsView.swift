import SwiftUI

struct StandingsView: View {
    @Environment(SportSelection.self) private var sportSelection
    @State private var viewModel = StandingsViewModel()

    var body: some View {
        VStack(spacing: 0) {
            // League selector (horizontal scroll pills)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(viewModel.leagues) { league in
                        Button {
                            withAnimation(.snappy) {
                                viewModel.selectedLeague = league
                            }
                        } label: {
                            Text(league.name)
                                .font(.system(size: 13, weight: .medium))
                                .foregroundStyle(
                                    viewModel.selectedLeague.id == league.id
                                        ? .white
                                        : AppColors.textSecondary
                                )
                                .padding(.horizontal, 12)
                                .padding(.vertical, 6)
                                .background(
                                    viewModel.selectedLeague.id == league.id
                                        ? AppColors.accent
                                        : AppColors.elevated,
                                    in: Capsule()
                                )
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
            }

            if viewModel.isLoading {
                Spacer()
                ProgressView()
                    .tint(AppColors.accent)
                Spacer()
            } else if viewModel.standings.isEmpty {
                ContentUnavailableView("No Standings", systemImage: "list.number",
                    description: Text("Standings are not available for this league yet."))
                    .frame(maxHeight: .infinity)
            } else {
                ScrollView {
                    // Standings card
                    VStack(spacing: 0) {
                        // Table header
                        HStack(spacing: 0) {
                            Text("#")
                                .frame(width: 24, alignment: .center)
                            Text("Team")
                                .padding(.leading, 8)
                            Spacer()
                            Group {
                                Text("P").frame(width: 26)
                                Text("W").frame(width: 26)
                                Text("D").frame(width: 26)
                                Text("L").frame(width: 26)
                                Text("GD").frame(width: 30)
                                Text("Pts").frame(width: 30)
                            }
                            Text("Form").frame(width: 48)
                        }
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundStyle(AppColors.textSecondary)
                        .padding(.horizontal, 12)
                        .frame(height: 36)

                        Rectangle()
                            .fill(AppColors.separator)
                            .frame(height: 0.5)

                        // Rows
                        ForEach(viewModel.standings) { standing in
                            StandingRow(standing: standing)

                            Rectangle()
                                .fill(AppColors.separator)
                                .frame(height: 0.5)
                                .padding(.leading, 12)
                        }
                    }
                    .background(AppColors.cardBackground)
                    .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
                    .padding(.horizontal, 10)
                    .padding(.top, 4)
                    .padding(.bottom, 16)
                }
            }
        }
        .background(AppColors.screenBackground)
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
                .font(.system(size: 13, weight: .bold))
                .foregroundStyle(positionColor)
                .frame(width: 24, alignment: .center)

            // Team logo (24pt in standings)
            AsyncImage(url: standing.team.logoURL) { image in
                image.resizable().scaledToFit()
            } placeholder: {
                Circle()
                    .fill(Color(hex: standing.team.primaryColor).opacity(0.3))
                    .overlay {
                        Text(String(standing.team.shortName.prefix(2)))
                            .font(.system(size: 8, weight: .bold))
                            .foregroundStyle(.white)
                    }
            }
            .frame(width: 24, height: 24)
            .padding(.leading, 6)

            // Team name
            Text(standing.team.name)
                .font(.system(size: 13, weight: .medium))
                .foregroundStyle(AppColors.textPrimary)
                .lineLimit(1)
                .padding(.leading, 6)

            Spacer(minLength: 4)

            // Stats columns (13pt for numbers)
            Group {
                Text("\(standing.played)").frame(width: 26)
                Text("\(standing.won)").frame(width: 26)
                Text("\(standing.drawn)").frame(width: 26)
                Text("\(standing.lost)").frame(width: 26)
                Text("\(standing.goalDifference > 0 ? "+" : "")\(standing.goalDifference)").frame(width: 30)
                Text("\(standing.points)")
                    .fontWeight(.bold)
                    .foregroundStyle(AppColors.accent)
                    .frame(width: 30)
            }
            .font(.system(size: 13, weight: .medium))
            .foregroundStyle(AppColors.textSecondary)

            // Form guide dots
            HStack(spacing: 3) {
                ForEach(Array(standing.form.suffix(5).enumerated()), id: \.offset) { _, result in
                    Circle()
                        .fill(formColor(result))
                        .frame(width: 7, height: 7)
                }
            }
            .frame(width: 48)
        }
        .padding(.horizontal, 12)
        .frame(height: 44)
    }

    private var positionColor: Color {
        switch standing.position {
        case 1...4: AppColors.accent
        case 5...6: Color(hex: "F5C518")
        case 18...20: .red
        default: AppColors.textSecondary
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
