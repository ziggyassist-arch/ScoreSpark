import { sql } from "@vercel/postgres";

// — User operations —

export async function upsertUser(user: {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}) {
  await sql`
    INSERT INTO users (id, name, email, image, updated_at)
    VALUES (${user.id}, ${user.name ?? null}, ${user.email ?? null}, ${user.image ?? null}, NOW())
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      email = EXCLUDED.email,
      image = EXCLUDED.image,
      updated_at = NOW()
  `;
}

// — Favorites operations —

export async function getUserFavorites(userId: string): Promise<string[]> {
  const result = await sql`
    SELECT team_id FROM favorites WHERE user_id = ${userId} ORDER BY created_at
  `;
  return result.rows.map((r) => r.team_id);
}

export async function addFavorite(userId: string, teamId: string, sport: string) {
  await sql`
    INSERT INTO favorites (user_id, team_id, sport)
    VALUES (${userId}, ${teamId}, ${sport})
    ON CONFLICT (user_id, team_id) DO NOTHING
  `;
}

export async function removeFavorite(userId: string, teamId: string) {
  await sql`
    DELETE FROM favorites WHERE user_id = ${userId} AND team_id = ${teamId}
  `;
}

export async function syncFavorites(userId: string, teamIds: string[], sport: string) {
  // Replace all favorites for this user
  await sql`DELETE FROM favorites WHERE user_id = ${userId}`;
  for (const teamId of teamIds) {
    await sql`
      INSERT INTO favorites (user_id, team_id, sport) VALUES (${userId}, ${teamId}, ${sport})
    `;
  }
}

// — Preferences operations —

export interface UserPreferences {
  spoilerMode: boolean;
  defaultSport: string;
}

export async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  const result = await sql`
    SELECT spoiler_mode, default_sport FROM user_preferences WHERE user_id = ${userId}
  `;
  if (result.rows.length === 0) return null;
  const row = result.rows[0];
  return {
    spoilerMode: row.spoiler_mode,
    defaultSport: row.default_sport,
  };
}

export async function saveUserPreferences(userId: string, prefs: Partial<UserPreferences>) {
  await sql`
    INSERT INTO user_preferences (user_id, spoiler_mode, default_sport, updated_at)
    VALUES (
      ${userId},
      ${prefs.spoilerMode ?? false},
      ${prefs.defaultSport ?? "soccer"},
      NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
      spoiler_mode = COALESCE(${prefs.spoilerMode ?? null}, user_preferences.spoiler_mode),
      default_sport = COALESCE(${prefs.defaultSport ?? null}, user_preferences.default_sport),
      updated_at = NOW()
  `;
}
