import SwiftUI

struct MatchCard: View {
    let match: Match

    var body: some View {
        VStack(spacing: 8) {
            // Status badge
            HStack {
                if match.isLive {
                    liveBadge
                }
                Spacer()
                Text(match.displayTime)
                    .font(.system(size: 11, design: .rounded))
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
        HStack(spacing: 3) {
            Circle()
                .fill(AppColors.livePulse)
                .frame(width: 6, height: 6)
                .modifier(PulseModifier())
            Text("LIVE")
                .font(.system(size: 9, weight: .black, design: .rounded))
                .foregroundStyle(AppColors.livePulse)
        }
        .padding(.horizontal, 6)
        .padding(.vertical, 2)
        .background(AppColors.livePulse.opacity(0.15), in: Capsule())
    }

    private func teamColumn(_ team: Team, alignment: HorizontalAlignment) -> some View {
        VStack(alignment: alignment, spacing: 4) {
            teamLogo(team, size: 32)
            Text(team.shortName)
                .font(.system(size: 10, design: .rounded))
                .foregroundStyle(AppColors.textSecondary)
        }
    }

    private func teamLogo(_ team: Team, size: CGFloat) -> some View {
        AsyncImage(url: team.logoURL) { image in
            image.resizable().scaledToFit()
        } placeholder: {
            Circle()
                .fill(Color(hex: team.primaryColor).opacity(0.3))
                .overlay {
                    Text(String(team.shortName.prefix(2)))
                        .font(.system(size: size * 0.35, weight: .bold, design: .rounded))
                        .foregroundStyle(.white)
                }
        }
        .frame(width: size, height: size)
    }

    private var scoreView: some View {
        Group {
            if let home = match.homeScore, let away = match.awayScore {
                HStack(spacing: 6) {
                    Text("\(home)")
                    Text("-")
                        .foregroundStyle(AppColors.textTertiary)
                    Text("\(away)")
                }
                .font(AppTypography.scoreMedium)
                .foregroundStyle(AppColors.textPrimary)
            } else {
                Text("vs")
                    .font(AppTypography.scoreCompact)
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
