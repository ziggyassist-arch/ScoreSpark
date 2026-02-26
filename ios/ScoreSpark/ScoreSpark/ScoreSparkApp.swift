import SwiftUI

@main
struct ScoreSparkApp: App {
    @State private var sportSelection = SportSelection()

    init() {
        // Set UINavigationBar appearance to eliminate any hidden space
        let navAppearance = UINavigationBarAppearance()
        navAppearance.configureWithTransparentBackground()
        navAppearance.backgroundColor = .clear
        navAppearance.shadowColor = .clear
        UINavigationBar.appearance().standardAppearance = navAppearance
        UINavigationBar.appearance().scrollEdgeAppearance = navAppearance
        UINavigationBar.appearance().compactAppearance = navAppearance
        UINavigationBar.appearance().isHidden = true
    }

    var body: some Scene {
        WindowGroup {
            MainTabView()
                .environment(sportSelection)
                .preferredColorScheme(.dark)
        }
    }
}
