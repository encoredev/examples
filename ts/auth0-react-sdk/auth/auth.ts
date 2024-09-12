import { UserInfoClient } from "auth0";
import { Gateway, Header, APIError } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { secret } from "encore.dev/config";
import jwt from "jsonwebtoken";
import { AUDIENCE, DOMAIN } from "./config";

// Download from Auth0 Dashboard → Applications → <YOUR APP> → Settings → Show Advanced Settings → Certificates
const publicCert = secret("Auth0PEMCertificate");

interface AuthParams {
  authorization: Header<"Authorization">;
}

interface AuthData {
  userID: string;
  imageUrl: string | null;
  emailAddress: string;
}

const userInfoClient = new UserInfoClient({
  domain: DOMAIN,
});

// The function passed to authHandler will be called for all incoming API call that requires authentication.
// Remove if your app does not require authentication.
const myAuthHandler = authHandler(
  async (params: AuthParams): Promise<AuthData> => {
    const token = params.authorization.replace("Bearer ", "");
    if (!token) {
      throw APIError.unauthenticated("no token provided");
    }

    try {
      // Verify the JWT
      jwt.verify(token, publicCert(), {
        algorithms: ["RS256"],
        issuer: "https://" + DOMAIN + "/",
        audience: AUDIENCE,
      });

      // Get the user info
      const userInfo = await userInfoClient.getUserInfo(token);

      return {
        userID: userInfo.data.sub,
        imageUrl: userInfo.data.picture ?? null,
        emailAddress: userInfo.data.email,
      };
    } catch (e) {
      throw APIError.unauthenticated("invalid token");
    }
  },
);

export const mygw = new Gateway({ authHandler: myAuthHandler });
