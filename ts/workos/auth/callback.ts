import { api } from "encore.dev/api";
import { workos } from "./workos";

// Handle the OAuth callback from WorkOS AuthKit. After the user signs in,
// WorkOS redirects here with an authorization code. We exchange it for
// tokens that the frontend stores and sends on subsequent API requests.
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
      // Exchange the authorization code for access and refresh tokens.
      const { accessToken, refreshToken } =
        await workos.userManagement.authenticateWithCode({
          code,
        });

      // In production, redirect to your frontend with the tokens.
      // The frontend stores the access token and includes it as a
      // Bearer token in the Authorization header on API requests.
      //
      // Example redirect:
      //   res.writeHead(302, {
      //     Location: `https://your-app.com/auth/callback?access_token=${accessToken}`,
      //   });
      //   res.end();
      //
      // For development, return the tokens directly.
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          accessToken,
          refreshToken,
        })
      );
    } catch (err) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Authentication failed" }));
    }
  }
);
