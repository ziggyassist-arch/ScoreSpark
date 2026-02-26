import SwiftUI

struct SettingsView: View {
    @Environment(SportSelection.self) private var sportSelection
    @State private var notificationsEnabled = true
    @State private var liveActivitiesEnabled = true
    @State private var spoilerFreeMode = UserDefaults.standard.bool(forKey: "spoilerFreeMode")
    @State private var defaultSport: Sport = {
        if let raw = UserDefaults.standard.string(forKey: "defaultSport"),
           let sport = Sport(rawValue: raw) {
            return sport
        }
        return .soccer
    }()

    var body: some View {
        List {
            Section {
                HStack(spacing: 12) {
                    Text("ScoreSpark")
                        .font(.system(size: 20, weight: .bold))
                        .foregroundStyle(.white)
                    Spacer()
                    Text("v1.0.0")
                        .font(.system(size: 13))
                        .foregroundStyle(AppColors.textSecondary)
                }
                .listRowBackground(AppColors.cardBackground)
            }

            Section("Preferences") {
                Picker("Default Sport", selection: $defaultSport) {
                    ForEach(Sport.sports) { sport in
                        HStack(spacing: 6) {
                            Text(sport.emoji)
                            Text(sport.rawValue)
                        }
                        .tag(sport)
                    }
                }
                .font(.system(size: 15))

                Toggle(isOn: $spoilerFreeMode) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Spoiler-Free Mode")
                            .font(.system(size: 15))
                        Text("Hide scores until you tap to reveal")
                            .font(.system(size: 12))
                            .foregroundStyle(AppColors.textSecondary)
                    }
                }
                .onChange(of: spoilerFreeMode) { _, newValue in
                    UserDefaults.standard.set(newValue, forKey: "spoilerFreeMode")
                }
            }
            .listRowBackground(AppColors.cardBackground)

            Section("Notifications") {
                Toggle("Match Alerts", isOn: $notificationsEnabled)
                    .font(.system(size: 15))
                Toggle("Live Activities", isOn: $liveActivitiesEnabled)
                    .font(.system(size: 15))
            }
            .listRowBackground(AppColors.cardBackground)

            Section("About") {
                Link(destination: URL(string: "https://scorespark.vercel.app")!) {
                    HStack {
                        Text("Website")
                            .font(.system(size: 15))
                        Spacer()
                        Image(systemName: "arrow.up.right")
                            .font(.system(size: 12))
                            .foregroundStyle(AppColors.textSecondary)
                    }
                }
                Link(destination: URL(string: "https://scorespark.vercel.app/pricing")!) {
                    HStack {
                        Text("Upgrade to Premium")
                            .font(.system(size: 15))
                        Spacer()
                        Image(systemName: "star.fill")
                            .font(.system(size: 12))
                            .foregroundStyle(AppColors.accent)
                    }
                }
            }
            .listRowBackground(AppColors.cardBackground)

            Section {
                VStack(spacing: 4) {
                    Text("Made with ⚡ by ScoreSpark")
                        .font(.system(size: 12))
                        .foregroundStyle(AppColors.textSecondary)
                    Text("Data provided by football-data.org & ESPN")
                        .font(.system(size: 11))
                        .foregroundStyle(AppColors.textSecondary.opacity(0.6))
                }
                .frame(maxWidth: .infinity)
                .listRowBackground(Color.clear)
            }
        }
        .scrollContentBackground(.hidden)
        .background(AppColors.screenBackground)
        .foregroundStyle(AppColors.textPrimary)
        .tint(AppColors.accent)
        .navigationTitle("Settings")
        .toolbarTitleDisplayMode(.inline)
    }
}
