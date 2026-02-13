import SwiftUI

struct SportSwitcher: View {
    @Environment(SportSelection.self) private var sportSelection

    var body: some View {
        @Bindable var selection = sportSelection
        Menu {
            ForEach(Sport.allCases) { sport in
                Button {
                    withAnimation(.snappy) { selection.current = sport }
                } label: {
                    Label("\(sport.emoji) \(sport.rawValue)", systemImage: sport.icon)
                }
            }
        } label: {
            HStack(spacing: 6) {
                Text(sportSelection.current.emoji)
                Text(sportSelection.current.rawValue)
                    .font(AppTypography.headline)
                Image(systemName: "chevron.down")
                    .font(.caption)
            }
            .foregroundStyle(AppColors.textPrimary)
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(AppColors.surface, in: Capsule())
        }
    }
}
