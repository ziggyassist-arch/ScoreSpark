import SwiftUI

/// Compact FotMob-style match row (~44pt height)
struct MatchCard: View {
    let match: Match

    var body: some View {
        HStack(spacing: 0) {
            // Home team — right-aligned name + badge
            HStack(spacing: 5) {
                Text(match.homeTeam.shortName)
                    .font(.system(size: 13, weight: .medium))
                    .foregroundStyle(.white)
                    .lineLimit(1)
                    .frame(maxWidth: .infinity, alignment: .trailing)
                teamBadge(match.homeTeam)
            }

            // Center score / time
            VStack(spacing: 1) {
                if let hs = match.homeScore, let aws = match.awayScore {
                    Text("\(hs) - \(aws)")
                        .font(.system(size: 14, weight: .bold).monospacedDigit())
                        .foregroundStyle(match.isLive ? AppColors.livePulse : .white)
                } else {
                    Text(match.displayTime)
                        .font(.system(size: 12))
                        .foregroundStyle(AppColors.textTertiary)
                }

                if match.isLive {
                    HStack(spacing: 2) {
                        Circle()
                            .fill(AppColors.livePulse)
                            .frame(width: 3, height: 3)
                            .modifier(PulseModifier())
                        Text(match.displayTime)
                            .font(.system(size: 9, weight: .semibold))
                            .foregroundStyle(AppColors.livePulse)
                    }
                } else if match.status == .finished {
                    Text("FT")
                        .font(.system(size: 9))
                        .foregroundStyle(AppColors.textTertiary)
                }
            }
            .frame(width: 56)

            // Away team — badge + left-aligned name
            HStack(spacing: 5) {
                teamBadge(match.awayTeam)
                Text(match.awayTeam.shortName)
                    .font(.system(size: 13, weight: .medium))
                    .foregroundStyle(.white)
                    .lineLimit(1)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
        }
        .padding(.horizontal, 8)
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
        .frame(width: 20, height: 20)
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
