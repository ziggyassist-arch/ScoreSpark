import SwiftUI

enum AppColors {
    // Brand colors (exact)
    static let brandNavy = Color(hex: "2E3460")      // #2E3460
    static let brandGold = Color(hex: "F5C518")       // #F5C518

    // UI colors derived from brand
    static let deepIndigo = brandNavy                                          // #2E3460
    static let lightBlue = Color(red: 0.494, green: 0.714, blue: 0.902)       // #7EB6E6
    static let gold = brandGold                                                // #F5C518
    static let darkNavy = Color(hex: "1C2038")                                 // #1C2038
    static let white = Color.white

    // Semantic
    static let background = darkNavy
    static let surface = deepIndigo
    static let surfaceLight = deepIndigo.opacity(0.6)
    static let accent = lightBlue
    static let highlight = gold
    static let textPrimary = white
    static let textSecondary = white.opacity(0.7)
    static let textTertiary = white.opacity(0.4)
    static let livePulse = Color(hex: "22C55E")
    static let win = Color.green
    static let loss = Color.red.opacity(0.8)
    static let draw = white.opacity(0.5)

    // Sport colors
    static let soccerGreen = Color(hex: "22C55E")
    static let nbaOrange = Color(hex: "F97316")
    static let nflBlue = Color(hex: "3B82F6")
    static let nhlPurple = Color(hex: "A855F7")
    static let mlbRed = Color(hex: "EF4444")

    static let cardGradient = LinearGradient(
        colors: [deepIndigo, darkNavy],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
}
