import { api, APIError, Gateway, Header } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { getAuthData } from "~encore/auth";

interface AuthParams {
  authorization: Header<"Authorization">;
}

// The function passed to authHandler will be called for all incoming API call that requires authentication.
// https://encore.dev/docs/ts/develop/auth
export const myAuthHandler = authHandler(
  async (params: AuthParams): Promise<{ userID: string }> => {
    // TODO: Validate up auth token and verify that this is an authenticated user
    const isInvalidUser = params.authorization === undefined;

    if (isInvalidUser) {
      throw APIError.unauthenticated("Invalid user ID");
    }

    return { userID: "user123" };
  },
);

export const gateway = new Gateway({ authHandler: myAuthHandler });

// Auth endpoint example
export const dashboardEndpoint = api(
  // Setting auth to true will require the user to be authenticated
  { auth: true, method: "GET", path: "/dashboard" },
  async (): Promise<{ message: string; userID: string }> => {
    return {
      message: "Secret dashboard message",
      userID: getAuthData()!.userID,
    };
  },
);
