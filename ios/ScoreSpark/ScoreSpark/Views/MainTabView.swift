import SwiftUI

struct MainTabView: View {
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            Tab("Home", systemImage: "house.fill", value: 0) {
                NavigationStack { HomeView() }
            }
            Tab("Matches", systemImage: "sportscourt.fill", value: 1) {
                NavigationStack { MatchListView() }
            }
            Tab("Standings", systemImage: "list.number", value: 2) {
                NavigationStack { StandingsView() }
            }
            Tab("Favorites", systemImage: "star.fill", value: 3) {
                NavigationStack { FavoritesView() }
            }
            Tab("More", systemImage: "ellipsis", value: 4) {
                NavigationStack { SettingsView() }
            }
        }
        .tint(AppColors.gold)
    }
}
