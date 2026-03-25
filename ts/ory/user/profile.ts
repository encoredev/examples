import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { db } from "./db";

interface ProfileResponse {
  userId: string;
  email: string;
  name?: string;
  theme?: string;
  notifications?: boolean;
  bio?: string;
}

// Get the authenticated user's profile. Combines auth data from Ory
// with user preferences stored in the database.
export const getProfile = api(
  { expose: true, method: "GET", path: "/user/profile", auth: true },
  async (): Promise<ProfileResponse> => {
    const auth = getAuthData()!;

    // Get user preferences from database
    let profile = await db.queryRow<{
      theme: string;
      notifications: boolean;
      bio: string | null;
    }>`
      SELECT theme, notifications, bio
      FROM user_profile
      WHERE ory_user_id = ${auth.userID}
    `;

    // Create profile with defaults if it doesn't exist
    if (!profile) {
      await db.exec`
        INSERT INTO user_profile (ory_user_id, theme, notifications)
        VALUES (${auth.userID}, 'light', true)
      `;
      profile = { theme: "light", notifications: true, bio: null };
    }

    return {
      userId: auth.userID,
      email: auth.email,
      name: auth.name,
      theme: profile.theme,
      notifications: profile.notifications,
      bio: profile.bio || undefined,
    };
  }
);

interface UpdatePreferencesRequest {
  theme?: "light" | "dark";
  notifications?: boolean;
  bio?: string;
}

interface UpdatePreferencesResponse {
  success: boolean;
}

// Update the authenticated user's preferences. Uses an upsert to handle
// both first-time and returning users.
export const updatePreferences = api(
  { expose: true, method: "POST", path: "/user/preferences", auth: true },
  async (req: UpdatePreferencesRequest): Promise<UpdatePreferencesResponse> => {
    const auth = getAuthData()!;

    await db.exec`
      INSERT INTO user_profile (ory_user_id, theme, notifications, bio, updated_at)
      VALUES (${auth.userID}, ${req.theme || "light"}, ${req.notifications ?? true}, ${req.bio || null}, NOW())
      ON CONFLICT (ory_user_id)
      DO UPDATE SET
        theme = COALESCE(${req.theme}, user_profile.theme),
        notifications = COALESCE(${req.notifications}, user_profile.notifications),
        bio = COALESCE(${req.bio}, user_profile.bio),
        updated_at = NOW()
    `;

    return { success: true };
  }
);
