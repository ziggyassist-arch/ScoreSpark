import SwiftUI

/// Compact FotMob-style match row (used in contexts outside HomeView)
struct MatchCard: View {
    let match: Match

    var body: some View {
        HStack(spacing: 0) {
            HStack(spacing: 8) {
                Text(match.homeTeam.shortName)
                    .font(.system(size: 14))
                    .foregroundStyle(.white)
                    .lineLimit(1)
                    .frame(maxWidth: .infinity, alignment: .trailing)
                teamBadge(match.homeTeam)
            }

            VStack(spacing: 2) {
                if let hs = match.homeScore, let aws = match.awayScore {
                    Text("\(hs) - \(aws)")
                        .font(.system(size: 16, weight: .bold).monospacedDigit())
                        .foregroundStyle(match.isLive ? AppColors.accent : .white)
                } else {
                    Text(match.displayTime)
                        .font(.system(size: 13, weight: .medium))
                        .foregroundStyle(.white)
                }

                if match.isLive {
                    HStack(spacing: 3) {
                        Circle()
                            .fill(AppColors.accent)
                            .frame(width: 4, height: 4)
                            .modifier(PulseModifier())
                        Text(match.displayTime)
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundStyle(AppColors.accent)
                    }
                } else if match.status == .finished {
                    Text("FT")
                        .font(.system(size: 11))
                        .foregroundStyle(AppColors.textSecondary)
                }
            }
            .frame(width: 60)

            HStack(spacing: 8) {
                teamBadge(match.awayTeam)
                Text(match.awayTeam.shortName)
                    .font(.system(size: 14))
                    .foregroundStyle(.white)
                    .lineLimit(1)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
        }
        .padding(.horizontal, 16)
        .frame(height: 80)
    }

    private func teamBadge(_ team: Team) -> some View {
        AsyncImage(url: team.logoURL) { image in
            image.resizable().scaledToFit()
        } placeholder: {
            Circle()
                .fill(Color(hex: team.primaryColor).opacity(0.3))
                .overlay {
                    Text(String(team.shortName.prefix(2)))
                        .font(.system(size: 9, weight: .bold))
                        .foregroundStyle(.white)
                }
        }
        .frame(width: 30, height: 30)
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
