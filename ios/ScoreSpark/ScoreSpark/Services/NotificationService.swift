import Foundation
import UserNotifications

actor NotificationService {
    static let shared = NotificationService()

    func requestPermission() async -> Bool {
        do {
            return try await UNUserNotificationCenter.current()
                .requestAuthorization(options: [.alert, .badge, .sound])
        } catch {
            return false
        }
    }

    func scheduleMatchReminder(match: Match) async {
        // TODO: Schedule local notification
    }
}
