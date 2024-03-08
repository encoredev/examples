import { Gateway, Header } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { secret } from "encore.dev/config";
import { APIError } from "encore.dev/errs";
import { AUTHORIZED_PARTIES, DOMAIN } from "./config";
import { Clerk, verifyToken } from "@clerk/backend";

const clerkSecretKey = secret("ClerkSecretKey");

const clerkClient = Clerk({
  secretKey: clerkSecretKey(),
});

interface AuthParams {
  authorization: Header<"Authorization">;
}

interface AuthData {
  userID: string;
  imageUrl: string;
  emailAddress: string | null;
}

const myAuthHandler = authHandler(
  async (params: AuthParams): Promise<AuthData> => {
    if (!params.authorization) {
      throw APIError.unauthenticated("no token provided");
    }

    try {
      const result = await verifyToken(params.authorization, {
        issuer: DOMAIN,
        authorizedParties: AUTHORIZED_PARTIES,
      });

      const user = await clerkClient.users.getUser(result.sub);

      return {
        userID: user.id,
        imageUrl: user.imageUrl,
        emailAddress: user.emailAddresses[0].emailAddress || null,
      };
    } catch (e) {
      console.error(e);
      throw APIError.unauthenticated("invalid token");
    }
  },
);

export const mygw = new Gateway({ authHandler: myAuthHandler });
