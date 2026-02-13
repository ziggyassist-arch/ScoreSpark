import SwiftUI

struct SectionHeader: View {
    let title: String
    let icon: String
    var action: (() -> Void)?

    var body: some View {
        HStack {
            Label(title, systemImage: icon)
                .font(AppTypography.headline)
                .foregroundStyle(AppColors.textPrimary)
            Spacer()
            if action != nil {
                Button("See All") { action?() }
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.accent)
            }
        }
        .padding(.horizontal)
    }
}
