import Cookies from "js-cookie";
import getRequestClient from "./getRequestClient.ts";

interface AuthProvider {
  isAuthenticated: boolean;
  signin(username: string): Promise<void>;
  signout(): void;
}

/**
 * This represents some generic auth provider API, like Firebase.
 */
export const fakeAuthProvider: AuthProvider = {
  isAuthenticated: !!Cookies.get("auth-token"),

  async signin(email: string) {
    const client = getRequestClient();
    const response = await client.auth.Login({ email });
    Cookies.set("auth-token", response.token);
    fakeAuthProvider.isAuthenticated = true;
  },

  signout() {
    Cookies.remove("auth-token");
    fakeAuthProvider.isAuthenticated = false;
  },
};
