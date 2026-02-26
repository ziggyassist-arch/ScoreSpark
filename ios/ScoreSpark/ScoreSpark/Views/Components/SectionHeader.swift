import SwiftUI

struct SectionHeader: View {
    let title: String
    let icon: String
    var action: (() -> Void)?

    var body: some View {
        HStack {
            Label(title, systemImage: icon)
                .font(.system(size: 13, weight: .bold))
                .foregroundStyle(AppColors.textPrimary)
            Spacer()
            if action != nil {
                Button("See All") { action?() }
                    .font(.system(size: 12))
                    .foregroundStyle(AppColors.accent)
            }
        }
        .padding(.horizontal, 16)
        .frame(height: 28)
    }
}
