import SwiftUI

struct SportSwitcher: View {
    @Environment(SportSelection.self) private var sportSelection

    /// Real league logos from ESPN CDN and FotMob
    private static let sportLogos: [Sport: URL?] = [
        .all: nil,
        .soccer: URL(string: "https://images.fotmob.com/image_resources/logo/leaguelogo/dark/47.png"),
        .nba: URL(string: "https://a.espncdn.com/i/teamlogos/leagues/500/nba.png"),
        .nfl: URL(string: "https://a.espncdn.com/i/teamlogos/leagues/500/nfl.png"),
        .nhl: URL(string: "https://a.espncdn.com/i/teamlogos/leagues/500/nhl.png"),
        .mlb: URL(string: "https://a.espncdn.com/i/teamlogos/leagues/500/mlb.png"),
    ]

    var body: some View {
        @Bindable var selection = sportSelection
        HStack(spacing: 4) {
            ForEach(Sport.allCases) { sport in
                let isSelected = selection.current == sport
                Button {
                    withAnimation(.snappy) { selection.current = sport }
                } label: {
                    HStack(spacing: 4) {
                        if sport == .all {
                            Image(systemName: "sportscourt.fill")
                                .font(.system(size: 10))
                        } else if let url = Self.sportLogos[sport] ?? nil {
                            AsyncImage(url: url) { image in
                                image.resizable().scaledToFit()
                            } placeholder: {
                                Text(sport.emoji)
                                    .font(.system(size: 10))
                            }
                            .frame(width: 14, height: 14)
                        }
                        Text(sport == .soccer ? "SOC" : sport.rawValue)
                            .font(.system(size: 11, weight: .semibold))
                    }
                    .foregroundStyle(isSelected ? AppColors.darkNavy : AppColors.textTertiary)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(
                        isSelected ? Color(hex: sport.accentColor) : AppColors.surface,
                        in: Capsule()
                    )
                }
            }
        }
        .padding(.horizontal, 12)
        .frame(height: 32)
    }
}
