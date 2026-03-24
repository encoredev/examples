import { api } from "encore.dev/api";
import { workos } from "./workos";
import { decodeJwt } from "jose";

interface LogoutRequest {
  token: string;
}

interface LogoutResponse {
  url: string;
}

// Returns the WorkOS logout URL. The frontend should redirect to this
// to end both the local session and the AuthKit session.
export const logout = api(
  { expose: true, method: "POST", path: "/auth/logout", auth: false },
  async (req: LogoutRequest): Promise<LogoutResponse> => {
    const claims = decodeJwt(req.token);
    const url = workos.userManagement.getLogoutUrl({
      sessionId: claims.sid as string,
    });
    return { url };
  }
);
