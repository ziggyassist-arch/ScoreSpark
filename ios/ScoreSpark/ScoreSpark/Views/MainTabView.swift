import SwiftUI

struct MainTabView: View {
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            Tab("Scores", systemImage: "sportscourt.fill", value: 0) {
                NavigationStack { HomeView() }
            }
            Tab("Standings", systemImage: "list.number", value: 1) {
                NavigationStack { StandingsView() }
            }
            Tab("Favorites", systemImage: "star.fill", value: 2) {
                NavigationStack { FavoritesView() }
            }
        }
        .tint(AppColors.gold)
    }
}
