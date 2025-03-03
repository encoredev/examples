import { Header, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";

// AuthParams specifies the incoming request information
// the auth handler is interested in. In this case it only
// cares about requests that contain the `Authorization` header.
interface AuthParams {
  authorization: Header<"Authorization">;
}

// The AuthData specifies the information about the authenticated user
// that the auth handler makes available.
interface AuthData {
  userID: string;
}

// The auth handler itself.
export const auth = authHandler<AuthParams, AuthData>(
  async (params) => {
    // TODO: Look up information about the user based on the authorization header.
    return { userID: "my-user-id" };
  }
)

// Define the API Gateway that will execute the auth handler:
export const gateway = new Gateway({
  authHandler: auth,
})
