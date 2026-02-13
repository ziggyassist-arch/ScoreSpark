import SwiftUI

@main
struct ScoreSparkApp: App {
    @State private var sportSelection = SportSelection()

    var body: some Scene {
        WindowGroup {
            MainTabView()
                .environment(sportSelection)
                .preferredColorScheme(.dark)
        }
    }
}
