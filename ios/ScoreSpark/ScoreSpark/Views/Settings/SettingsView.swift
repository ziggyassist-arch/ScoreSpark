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
                    HStack(spacing: 2) {
                        Text("Score")
                            .font(.system(size: 18, weight: .bold, design: .rounded))
                            .foregroundStyle(.white)
                        Text("Spark")
                            .font(.system(size: 18, weight: .bold, design: .rounded))
                            .foregroundStyle(AppColors.gold)
                    }
                    Spacer()
                    Text("v1.0.0")
                        .font(.system(size: 11, design: .rounded))
                        .foregroundStyle(AppColors.textTertiary)
                }
                .listRowBackground(AppColors.surface)
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
                .font(.system(size: 14, design: .rounded))

                Toggle(isOn: $spoilerFreeMode) {
                    VStack(alignment: .leading, spacing: 1) {
                        Text("Spoiler-Free Mode")
                            .font(.system(size: 14, design: .rounded))
                        Text("Hide scores until you tap to reveal")
                            .font(.system(size: 11, design: .rounded))
                            .foregroundStyle(AppColors.textTertiary)
                    }
                }
                .onChange(of: spoilerFreeMode) { _, newValue in
                    UserDefaults.standard.set(newValue, forKey: "spoilerFreeMode")
                }
            }
            .listRowBackground(AppColors.surface)

            Section("Notifications") {
                Toggle("Match Alerts", isOn: $notificationsEnabled)
                    .font(.system(size: 14, design: .rounded))
                Toggle("Live Activities", isOn: $liveActivitiesEnabled)
                    .font(.system(size: 14, design: .rounded))
            }
            .listRowBackground(AppColors.surface)

            Section("About") {
                Link(destination: URL(string: "https://scorespark.vercel.app")!) {
                    HStack {
                        Text("Website")
                            .font(.system(size: 14, design: .rounded))
                        Spacer()
                        Image(systemName: "arrow.up.right")
                            .font(.system(size: 11))
                            .foregroundStyle(AppColors.textTertiary)
                    }
                }
                Link(destination: URL(string: "https://scorespark.vercel.app/pricing")!) {
                    HStack {
                        Text("Upgrade to Premium")
                            .font(.system(size: 14, design: .rounded))
                        Spacer()
                        Image(systemName: "star.fill")
                            .font(.system(size: 11))
                            .foregroundStyle(AppColors.gold)
                    }
                }
            }
            .listRowBackground(AppColors.surface)

            Section {
                VStack(spacing: 2) {
                    Text("Made with ⚡ by ScoreSpark")
                        .font(.system(size: 11, design: .rounded))
                        .foregroundStyle(AppColors.textTertiary)
                    Text("Data provided by football-data.org & ESPN")
                        .font(.system(size: 10, design: .rounded))
                        .foregroundStyle(AppColors.textTertiary.opacity(0.6))
                }
                .frame(maxWidth: .infinity)
                .listRowBackground(Color.clear)
            }
        }
        .scrollContentBackground(.hidden)
        .background(AppColors.background)
        .foregroundStyle(AppColors.textPrimary)
        .tint(AppColors.gold)
        .navigationTitle("Settings")
        .toolbarTitleDisplayMode(.inline)
    }
}
