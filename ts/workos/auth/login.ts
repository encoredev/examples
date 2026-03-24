import { api } from "encore.dev/api";
import { workos, workosClientId } from "./workos";

interface LoginResponse {
  url: string;
}

// Returns the AuthKit authorization URL. The frontend should redirect the
// user to this URL to start the sign-in flow. After authentication, WorkOS
// redirects back to your callback endpoint with an authorization code.
export const login = api(
  { expose: true, method: "GET", path: "/auth/login", auth: false },
  async (): Promise<LoginResponse> => {
    const authorizationUrl = workos.userManagement.getAuthorizationUrl({
      provider: "authkit",
      clientId: workosClientId(),
      // Change this to your production callback URL when deploying.
      redirectUri: "http://localhost:4000/auth/callback",
    });

    return { url: authorizationUrl };
  }
);
