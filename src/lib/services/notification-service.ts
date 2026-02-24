/**
 * Push notification service scaffolding.
 * Uses Web Push API for web and stores FCM/APNs tokens for native apps.
 * Full implementation requires:
 * - web-push npm package + VAPID keys for Web Push
 * - Firebase Admin SDK for FCM (Android/iOS)
 * - Database table for storing push subscriptions
 */

export interface PushSubscription {
  userId: string;
  endpoint: string;
  platform: "web" | "ios" | "android";
  token: string;
  teams: string[]; // Team IDs the user wants notifications for
  preferences: {
    matchStart: boolean;
    goals: boolean;
    finalScore: boolean;
    redCards: boolean;
  };
}

// In-memory store for MVP (replace with DB when Vercel Postgres is configured)
const subscriptions = new Map<string, PushSubscription>();

export function registerSubscription(sub: PushSubscription) {
  subscriptions.set(sub.userId, sub);
}

export function removeSubscription(userId: string) {
  subscriptions.delete(userId);
}

export function getSubscription(userId: string): PushSubscription | null {
  return subscriptions.get(userId) ?? null;
}

export function getSubscriptionsForTeam(teamId: string): PushSubscription[] {
  return Array.from(subscriptions.values()).filter((sub) =>
    sub.teams.includes(teamId)
  );
}

/**
 * Send a notification to all subscribers of a team
 * (Placeholder — requires web-push or FCM setup)
 */
export async function notifyTeamSubscribers(
  teamId: string,
  title: string,
  body: string
): Promise<number> {
  const subs = getSubscriptionsForTeam(teamId);

  // TODO: Implement actual push delivery
  // For web: use web-push library with VAPID keys
  // For iOS/Android: use Firebase Admin SDK
  console.log(`[notifications] Would send "${title}" to ${subs.length} subscribers of team ${teamId}`);

  return subs.length;
}
