import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";

interface ProfileResponse {
  userID: string;
}

// A protected endpoint. Requires a valid Better Auth session.
// Encore validates the session automatically before this handler runs.
export const getProfile = api(
  { auth: true, expose: true, method: "GET", path: "/profile" },
  async (): Promise<ProfileResponse> => {
    const data = getAuthData()!;
    return { userID: data.userID };
  }
);
