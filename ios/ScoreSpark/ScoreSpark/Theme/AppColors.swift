import SwiftUI

enum AppColors {
    // ScoreSpark brand palette
    static let screenBackground = Color(hex: "1A1A2E")      // Dark navy
    static let cardBackground = Color(hex: "2E3460")         // Navy cards
    static let elevated = Color(hex: "3A4178")               // Lighter navy for buttons/pills
    static let separator = Color.white.opacity(0.08)         // White at 8% opacity

    // Text
    static let textPrimary = Color.white
    static let textSecondary = Color(hex: "9DCAED")          // Light blue

    // Accent
    static let accent = Color(hex: "F5C518")                 // ScoreSpark gold
    static let livePulse = Color(hex: "F5C518")              // Gold for live indicators

    // Legacy aliases (kept for compatibility)
    static let background = screenBackground
    static let surface = cardBackground
    static let textTertiary = Color(hex: "9DCAED")

    // Status colors
    static let win = Color(hex: "4CD964")
    static let loss = Color.red.opacity(0.8)
    static let draw = Color.white.opacity(0.5)

    // Sport colors
    static let soccerGreen = Color(hex: "4CD964")
    static let nbaOrange = Color(hex: "F97316")
    static let nflBlue = Color(hex: "3B82F6")
    static let nhlPurple = Color(hex: "A855F7")
    static let mlbRed = Color(hex: "EF4444")
}
