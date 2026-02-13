import SwiftUI

struct HomeView: View {
    @Environment(SportSelection.self) private var sportSelection
    @State private var viewModel = HomeViewModel()

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Logo header
                HStack {
                    Image("Logo")
                        .resizable()
                        .scaledToFit()
                        .frame(height: 32)
                    Spacer()
                    SportSwitcher()
                }
                .padding(.horizontal)

                // Live Now
                if !viewModel.liveMatches.isEmpty {
                    VStack(alignment: .leading, spacing: 12) {
                        SectionHeader(title: "Live Now", icon: "bolt.fill")
                        ScrollView(.horizontal, showsIndicators: false) {
                            LazyHStack(spacing: 12) {
                                ForEach(viewModel.liveMatches) { match in
                                    NavigationLink(value: match.id) {
                                        MatchCard(match: match)
                                            .frame(width: 280)
                                    }
                                    .buttonStyle(.plain)
                                }
                            }
                            .padding(.horizontal)
                        }
                    }
                }

                // My Teams
                VStack(alignment: .leading, spacing: 12) {
                    SectionHeader(title: "My Teams", icon: "star.fill")
                    ForEach(viewModel.myTeamMatches) { match in
                        NavigationLink(value: match.id) {
                            MatchCard(match: match)
                        }
                        .buttonStyle(.plain)
                    }
                    .padding(.horizontal)
                }

                // Upcoming
                VStack(alignment: .leading, spacing: 12) {
                    SectionHeader(title: "Upcoming", icon: "clock.fill")
                    ForEach(viewModel.upcomingMatches) { match in
                        NavigationLink(value: match.id) {
                            MatchCard(match: match)
                        }
                        .buttonStyle(.plain)
                    }
                    .padding(.horizontal)
                }
            }
            .padding(.vertical)
        }
        .background(AppColors.background)
        .navigationDestination(for: String.self) { matchId in
            MatchDetailView(matchId: matchId)
        }
        .task(id: sportSelection.current) {
            await viewModel.load(sport: sportSelection.current)
        }
    }
}
