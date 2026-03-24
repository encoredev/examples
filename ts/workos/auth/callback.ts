import { api } from "encore.dev/api";
import { workos } from "./workos";

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
        });

      // Redirect to frontend with the access token.
      // The frontend stores it in localStorage and uses it for API requests.
      const frontendUrl = `http://localhost:4000/?token=${encodeURIComponent(accessToken)}`;
      res.writeHead(302, { Location: frontendUrl });
      res.end();
    } catch (err) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Authentication failed" }));
    }
  }
);
