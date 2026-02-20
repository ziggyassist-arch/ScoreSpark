import SwiftUI

struct SportSwitcher: View {
    @Environment(SportSelection.self) private var sportSelection

    var body: some View {
        @Bindable var selection = sportSelection
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(Sport.allCases) { sport in
                    let isSelected = selection.current == sport
                    Button {
                        withAnimation(.snappy) { selection.current = sport }
                    } label: {
                        HStack(spacing: 4) {
                            Text(sport.emoji)
                                .font(.system(size: 14))
                            Text(sport.rawValue)
                                .font(.system(size: 13, weight: .semibold, design: .rounded))
                        }
                        .foregroundStyle(isSelected ? AppColors.darkNavy : AppColors.textSecondary)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 8)
                        .background(
                            isSelected ? Color(hex: sport.accentColor) : AppColors.surface,
                            in: Capsule()
                        )
                    }
                }
            }
            .padding(.horizontal)
        }
    }
}
