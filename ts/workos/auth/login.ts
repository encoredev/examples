import { api } from "encore.dev/api";
import { workos, workosClientId, workosRedirectUri } from "./workos";

interface LoginResponse {
  url: string;
}

// Returns the AuthKit authorization URL. The frontend redirects the user
// to this URL to start the sign-in flow. After authentication, WorkOS
// redirects back to the callback endpoint with an authorization code.
export const login = api(
  { expose: true, method: "GET", path: "/auth/login", auth: false },
  async (): Promise<LoginResponse> => {
    const authorizationUrl = workos.userManagement.getAuthorizationUrl({
      provider: "authkit",
      clientId: workosClientId(),
      redirectUri: workosRedirectUri(),
    });

    return { url: authorizationUrl };
  }
);
