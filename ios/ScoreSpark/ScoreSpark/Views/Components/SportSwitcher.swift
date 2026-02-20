import SwiftUI

struct SportSwitcher: View {
    @Environment(SportSelection.self) private var sportSelection

    var body: some View {
        @Bindable var selection = sportSelection
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 6) {
                ForEach(Sport.allCases) { sport in
                    let isSelected = selection.current == sport
                    Button {
                        withAnimation(.snappy) { selection.current = sport }
                    } label: {
                        HStack(spacing: 3) {
                            Text(sport.emoji)
                                .font(.system(size: 12))
                            Text(sport.rawValue)
                                .font(.system(size: 12, weight: .semibold))
                        }
                        .foregroundStyle(isSelected ? AppColors.darkNavy : AppColors.textSecondary)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 6)
                        .background(
                            isSelected ? Color(hex: sport.accentColor) : AppColors.surface,
                            in: Capsule()
                        )
                    }
                }
            }
            .padding(.horizontal, 16)
        }
    }
}
