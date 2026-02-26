import SwiftUI

enum AppColors {
    // FotMob exact palette
    static let screenBackground = Color(hex: "000000")      // Pure black
    static let cardBackground = Color(hex: "1C1C1E")        // Dark card
    static let elevated = Color(hex: "2A2A2E")              // Buttons, pills
    static let separator = Color(hex: "38383A")             // 0.5pt dividers

    // Text
    static let textPrimary = Color.white
    static let textSecondary = Color(hex: "8E8E93")         // System gray

    // Accent
    static let accent = Color(hex: "4CD964")                // FotMob green
    static let livePulse = Color(hex: "4CD964")             // Same green for live

    // Legacy aliases (kept for compatibility)
    static let background = screenBackground
    static let surface = cardBackground
    static let textTertiary = Color(hex: "8E8E93")

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

    // Removed: brandNavy, brandGold, deepIndigo, darkNavy, lightBlue, gold, cardGradient
    // All replaced by FotMob palette above
}
