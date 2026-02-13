import SwiftUI

struct MatchCard: View {
    let match: Match

    var body: some View {
        VStack(spacing: 12) {
            // Status badge
            HStack {
                if match.isLive {
                    liveBadge
                }
                Spacer()
                Text(match.displayTime)
                    .font(AppTypography.caption)
                    .foregroundStyle(match.isLive ? AppColors.livePulse : AppColors.textSecondary)
            }

            // Teams & Score
            HStack {
                teamColumn(match.homeTeam, alignment: .leading)
                Spacer()
                scoreView
                Spacer()
                teamColumn(match.awayTeam, alignment: .trailing)
            }
        }
        .cardStyle()
    }

    private var liveBadge: some View {
        HStack(spacing: 4) {
            Circle()
                .fill(AppColors.livePulse)
                .frame(width: 8, height: 8)
                .modifier(PulseModifier())
            Text("LIVE")
                .font(.system(size: 10, weight: .black, design: .rounded))
                .foregroundStyle(AppColors.livePulse)
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 3)
        .background(AppColors.livePulse.opacity(0.15), in: Capsule())
    }

    private func teamColumn(_ team: Team, alignment: HorizontalAlignment) -> some View {
        VStack(alignment: alignment, spacing: 6) {
            Circle()
                .fill(AppColors.surfaceLight)
                .frame(width: 40, height: 40)
                .overlay {
                    Text(team.shortName.prefix(2))
                        .font(.system(size: 14, weight: .bold, design: .rounded))
                        .foregroundStyle(AppColors.accent)
                }
            Text(team.shortName)
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textSecondary)
        }
    }

    private var scoreView: some View {
        Group {
            if let home = match.homeScore, let away = match.awayScore {
                HStack(spacing: 8) {
                    Text("\(home)")
                    Text("-")
                        .foregroundStyle(AppColors.textTertiary)
                    Text("\(away)")
                }
                .font(AppTypography.score)
                .foregroundStyle(AppColors.textPrimary)
            } else {
                Text("vs")
                    .font(AppTypography.scoreMedium)
                    .foregroundStyle(AppColors.textTertiary)
            }
        }
    }
}

struct PulseModifier: ViewModifier {
    @State private var isPulsing = false

    func body(content: Content) -> some View {
        content
            .scaleEffect(isPulsing ? 1.3 : 1.0)
            .opacity(isPulsing ? 0.5 : 1.0)
            .animation(.easeInOut(duration: 1).repeatForever(autoreverses: true), value: isPulsing)
            .onAppear { isPulsing = true }
    }
}
