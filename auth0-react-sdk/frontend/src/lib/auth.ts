import Cookies from "js-cookie";
import getRequestClient from "./getRequestClient.ts";

type RedirectURL = string;

/**
 * Handles the backend communication for the authentication flow.
 */
export const Auth0Provider = {
  client: getRequestClient(),
  isAuthenticated: () => !!Cookies.get("auth-token"),

  async login(returnTo: RedirectURL): Promise<RedirectURL> {
    const response = await this.client.auth.Login();
    Cookies.set("state", response.state);
    sessionStorage.setItem(response.state, returnTo);
    return response.auth_code_url;
  },

  async logout(): Promise<RedirectURL> {
    const response = await this.client.auth.Logout();

    Cookies.remove("auth-token");
    Cookies.remove("state");

    return response.redirect_url;
  },

  async validate(state: string, authCode: string): Promise<RedirectURL> {
    if (state != Cookies.get("state")) throw new Error("Invalid state");

    const response = await this.client.auth.Callback({ code: authCode });
    Cookies.set("auth-token", response.token);
    const returnURL = sessionStorage.getItem(state) ?? "/";
    sessionStorage.removeItem(state);
    return returnURL;
  },
};
