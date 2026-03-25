import { api } from "encore.dev/api";
import { oryProjectSlug } from "./ory";

interface LoginInfoResponse {
  oryUrl: string;
}

// Returns the Ory project URL so the frontend can call Ory's self-service APIs directly.
export const loginInfo = api(
  { expose: true, method: "GET", path: "/auth/login-info", auth: false },
  async (): Promise<LoginInfoResponse> => {
    return { oryUrl: `https://${oryProjectSlug()}.projects.oryapis.com` };
  }
);
