import SwiftUI

enum AppTypography {
    // FotMob uses SF Pro (system default), not rounded
    static let largeTitle = Font.system(.largeTitle, design: .default, weight: .bold)
    static let title = Font.system(.title2, design: .default, weight: .bold)
    static let headline = Font.system(.headline, design: .default, weight: .semibold)
    static let subheadline = Font.system(.subheadline, design: .default, weight: .medium)
    static let body = Font.system(.body, design: .default)
    static let caption = Font.system(.caption, design: .default)

    // Score fonts — monospaced digits, no rounded
    static let score = Font.system(size: 36, weight: .heavy, design: .default).monospacedDigit()
    static let scoreMedium = Font.system(size: 24, weight: .bold, design: .default).monospacedDigit()
    static let scoreCompact = Font.system(size: 18, weight: .bold, design: .default).monospacedDigit()
}
