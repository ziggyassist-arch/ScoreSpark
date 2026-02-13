import SwiftUI

enum AppColors {
    static let deepIndigo = Color(red: 0.176, green: 0.169, blue: 0.333)   // #2D2B55
    static let lightBlue = Color(red: 0.494, green: 0.714, blue: 0.902)    // #7EB6E6
    static let gold = Color(red: 0.961, green: 0.773, blue: 0.259)         // #F5C542
    static let darkNavy = Color(red: 0.118, green: 0.106, blue: 0.227)     // #1E1B3A
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
    static let livePulse = Color.red
    static let win = Color.green
    static let loss = Color.red.opacity(0.8)
    static let draw = white.opacity(0.5)

    static let cardGradient = LinearGradient(
        colors: [deepIndigo, darkNavy],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
}
