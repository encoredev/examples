import { APIError, Gateway, Header, api } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";

interface LoginParams {
  email: string;
  password: string;
}

export const login = api(
  { expose: true, auth: false, method: "GET", path: "/login" },
  async (params: LoginParams): Promise<{ token: string }> => {
    // ... get the userID from database or third party service like Auth0 or Clerk ...
    // ... create and sign a token ...

    return { token: "dummy-token" };
  }
);

interface AuthParams {
  authorization: Header<"Authorization">;
}

// The function passed to authHandler will be called for all incoming API call that requires authentication.
// Remove if your app does not require authentication.
export const myAuthHandler = authHandler(
  async (params: AuthParams): Promise<{ userID: string }> => {
    // ... verify and decode token to get the userID ...
    // ... get user info from database or third party service like Auth0 or Clerk ...

    if (!params.authorization) {
      throw APIError.unauthenticated("no token provided");
    }
    if (params.authorization !== "dummy-token") {
      throw APIError.unauthenticated("invalid token");
    }

    return { userID: "dummy-user-id" };
  }
);

export const gateway = new Gateway({ authHandler: myAuthHandler });
