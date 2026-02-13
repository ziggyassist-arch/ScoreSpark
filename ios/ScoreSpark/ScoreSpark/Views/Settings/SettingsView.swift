import SwiftUI

struct SettingsView: View {
    @State private var notificationsEnabled = true
    @State private var liveActivitiesEnabled = true

    var body: some View {
        List {
            Section {
                HStack(spacing: 16) {
                    Image("Logo")
                        .resizable()
                        .scaledToFit()
                        .frame(height: 40)
                    VStack(alignment: .leading, spacing: 2) {
                        Text("ScoreSpark")
                            .font(AppTypography.title)
                            .foregroundStyle(AppColors.textPrimary)
                        Text("v1.0.0")
                            .font(AppTypography.caption)
                            .foregroundStyle(AppColors.textTertiary)
                    }
                }
                .listRowBackground(AppColors.surface)
            }

            Section("Notifications") {
                Toggle("Match Alerts", isOn: $notificationsEnabled)
                Toggle("Live Activities", isOn: $liveActivitiesEnabled)
            }
            .listRowBackground(AppColors.surface)

            Section("Preferences") {
                NavigationLink("Default Sport") {
                    Text("Sport picker")
                }
                NavigationLink("Favorite Leagues") {
                    Text("League picker")
                }
            }
            .listRowBackground(AppColors.surface)

            Section("About") {
                Link("Privacy Policy", destination: URL(string: "https://scorespark.app/privacy")!)
                Link("Terms of Service", destination: URL(string: "https://scorespark.app/terms")!)
                NavigationLink("Acknowledgements") {
                    Text("Open source licenses")
                }
            }
            .listRowBackground(AppColors.surface)
        }
        .scrollContentBackground(.hidden)
        .background(AppColors.background)
        .foregroundStyle(AppColors.textPrimary)
        .tint(AppColors.gold)
        .navigationTitle("More")
        .toolbarTitleDisplayMode(.large)
    }
}
