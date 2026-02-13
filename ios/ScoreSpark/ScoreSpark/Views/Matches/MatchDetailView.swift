import SwiftUI

struct MatchDetailView: View {
    let matchId: String
    @State private var selectedTab = 0

    // Using preview data for now
    private var match: Match { .previewLive }

    var body: some View {
        ScrollView {
            VStack(spacing: 0) {
                // Header
                VStack(spacing: 16) {
                    Text(match.league.name)
                        .font(AppTypography.caption)
                        .foregroundStyle(AppColors.accent)

                    HStack(spacing: 24) {
                        VStack(spacing: 8) {
                            Circle()
                                .fill(AppColors.surfaceLight)
                                .frame(width: 64, height: 64)
                                .overlay {
                                    Text(match.homeTeam.shortName)
                                        .font(AppTypography.headline)
                                        .foregroundStyle(AppColors.accent)
                                }
                            Text(match.homeTeam.name)
                                .font(AppTypography.caption)
                                .foregroundStyle(AppColors.textSecondary)
                        }

                        VStack(spacing: 4) {
                            if let h = match.homeScore, let a = match.awayScore {
                                Text("\(h) - \(a)")
                                    .font(AppTypography.score)
                                    .foregroundStyle(AppColors.textPrimary)
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

                        VStack(spacing: 8) {
                            Circle()
                                .fill(AppColors.surfaceLight)
                                .frame(width: 64, height: 64)
                                .overlay {
                                    Text(match.awayTeam.shortName)
                                        .font(AppTypography.headline)
                                        .foregroundStyle(AppColors.accent)
                                }
                            Text(match.awayTeam.name)
                                .font(AppTypography.caption)
                                .foregroundStyle(AppColors.textSecondary)
                        }
                    }
                }
                .padding(.vertical, 32)

                // Tab selector
                HStack(spacing: 0) {
                    ForEach(["Stats", "Lineups", "Events", "H2H"], id: \.self) { tab in
                        let idx = ["Stats", "Lineups", "Events", "H2H"].firstIndex(of: tab)!
                        Button {
                            withAnimation(.snappy) { selectedTab = idx }
                        } label: {
                            Text(tab)
                                .font(AppTypography.subheadline)
                                .foregroundStyle(selectedTab == idx ? AppColors.gold : AppColors.textTertiary)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 12)
                        }
                    }
                }
                .background(AppColors.surface)
                .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                .padding(.horizontal)

                // Placeholder content
                VStack(spacing: 16) {
                    ForEach(0..<5) { _ in
                        RoundedRectangle(cornerRadius: 8)
                            .fill(AppColors.surface)
                            .frame(height: 44)
                    }
                }
                .padding()
            }
        }
        .background(AppColors.background)
        .navigationBarTitleDisplayMode(.inline)
    }
}
