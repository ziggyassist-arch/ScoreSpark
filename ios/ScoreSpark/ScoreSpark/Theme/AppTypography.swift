import SwiftUI

enum AppTypography {
    static let largeTitle = Font.system(.largeTitle, design: .rounded, weight: .bold)
    static let title = Font.system(.title2, design: .rounded, weight: .bold)
    static let headline = Font.system(.headline, design: .rounded, weight: .semibold)
    static let subheadline = Font.system(.subheadline, design: .rounded, weight: .medium)
    static let body = Font.system(.body, design: .rounded)
    static let caption = Font.system(.caption, design: .rounded)
    static let score = Font.system(size: 36, weight: .heavy, design: .rounded).monospacedDigit()
    static let scoreMedium = Font.system(size: 24, weight: .bold, design: .rounded).monospacedDigit()
    static let scoreCompact = Font.system(size: 18, weight: .bold, design: .rounded).monospacedDigit()
}
