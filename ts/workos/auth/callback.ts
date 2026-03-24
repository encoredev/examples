import { api } from "encore.dev/api";
import { workos, workosClientId, workosRedirectUri } from "./workos";

// Handle the OAuth callback from WorkOS AuthKit. After the user signs in,
// WorkOS redirects here with an authorization code. We exchange it for
// tokens and redirect back to the frontend.
export const callback = api.raw(
  { expose: true, method: "GET", path: "/auth/callback" },
  async (req, res) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const code = url.searchParams.get("code");

    if (!code) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing authorization code" }));
      return;
    }

    try {
      const { accessToken } =
        await workos.userManagement.authenticateWithCode({
          code,
          clientId: workosClientId(),
        });

      // Redirect to frontend with the access token.
      // Derive the frontend origin from the redirect URI.
      const origin = new URL(workosRedirectUri()).origin;
      res.writeHead(302, { Location: `${origin}/?token=${encodeURIComponent(accessToken)}` });
      res.end();
    } catch (err) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Authentication failed" }));
    }
  }
);
