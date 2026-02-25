import SwiftUI

struct SectionHeader: View {
    let title: String
    let icon: String
    var action: (() -> Void)?

    var body: some View {
        HStack {
            Label(title, systemImage: icon)
                .font(.system(size: 14, weight: .semibold, design: .rounded))
                .foregroundStyle(AppColors.textPrimary)
            Spacer()
            if action != nil {
                Button("See All") { action?() }
                    .font(.system(size: 11, design: .rounded))
                    .foregroundStyle(AppColors.accent)
            }
        }
        .padding(.horizontal, 12)
    }
}
