import SwiftUI

struct SportSwitcher: View {
    @Environment(SportSelection.self) private var sportSelection

    var body: some View {
        @Bindable var selection = sportSelection
        HStack(spacing: 4) {
            ForEach(Sport.allCases) { sport in
                let isSelected = selection.current == sport
                Button {
                    withAnimation(.snappy) { selection.current = sport }
                } label: {
                    HStack(spacing: 2) {
                        Text(sport.emoji)
                            .font(.system(size: 10))
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
