import { APIError, Gateway, Header } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { verifyToken } from "@clerk/backend";
import { secret } from "encore.dev/config";
import { clerk } from "./clerk";

const clerkSecretKey = secret("ClerkSecretKey");

interface AuthParams {
  authorization: Header<"Authorization">;
}

export interface AuthData {
  userID: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export const auth = authHandler<AuthParams, AuthData>(async (params) => {
  const token = params.authorization?.replace("Bearer ", "");

  if (!token) {
    throw APIError.unauthenticated("missing session token");
  }

  try {
    // Verify the JWT token with Clerk
    const payload = await verifyToken(token, {
      secretKey: clerkSecretKey(),
    });
    
    // Get user details from the JWT payload
    const userId = payload.sub;
    if (!userId) {
      throw new Error("No user ID in token");
    }
    
    const user = await clerk.users.getUser(userId);

    return {
      userID: user.id,
      email: user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
        ?.emailAddress || "",
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
    };
  } catch (err) {
    throw APIError.unauthenticated("invalid session token");
  }
});

export const gateway = new Gateway({
  authHandler: auth,
});

