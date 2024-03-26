import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

/**
 * Component displaying login/logout button and basic user information if logged in.
 */
function LoginStatus() {
  const { loginWithRedirect, logout, isAuthenticated, isLoading, user } =
    useAuth0();
  if (isLoading) return null;

  return isAuthenticated ? (
    <div className="authStatus">
      <img src={user?.picture} alt={user?.name} />
      <button
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
      >
        Sign out {user?.email}
      </button>
    </div>
  ) : (
    <button onClick={() => loginWithRedirect()}>Sign in</button>
  );
}

export default LoginStatus;
