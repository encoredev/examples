import { Header, Gateway, APIError } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";

interface AuthParams {
  authorization: Header<"Authorization">;
}

interface AuthData {
  userID: string;
}

// This is an example authentication handler used for demonstation purposes,
// emulate being logged in as a user with id 1 by passing the string `userid:1`
// as the authorization header.
export const auth = authHandler<AuthParams, AuthData>(async (params) => {
  const userID = /userid:(\d+)/i.exec(params.authorization);
  if (userID === null) {
    throw APIError.unauthenticated("no valid user credentials");
  }
  return { userID: userID[1] };
});

export const gateway = new Gateway({
  authHandler: auth,
});
