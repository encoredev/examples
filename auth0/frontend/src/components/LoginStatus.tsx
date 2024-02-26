import getRequestClient from "../lib/getRequestClient.ts";
import { useFetcher } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../lib/client.ts";
import { Auth0Provider } from "../lib/auth.ts";

/**
 * Component displaying login/logout button and basic user information if logged in.
 */
function LoginStatus() {
  const client = getRequestClient();
  const fetcher = useFetcher();
  const [profile, setProfile] = useState<auth.ProfileData>();
  const [loading, setLoading] = useState(true);

  // Fetch profile data if user is authenticated
  useEffect(() => {
    const getProfile = async () => {
      setProfile(await client.auth.GetProfile());
      setLoading(false);
    };
    if (Auth0Provider.isAuthenticated()) getProfile();
    else setLoading(false);
  }, []);

  if (loading) return null;

  if (profile) {
    return (
      <div className="authStatus">
        <img src={profile.picture} />
        <fetcher.Form method="GET" action="/logout">
          <button type="submit">Sign out {profile.email}</button>
        </fetcher.Form>
      </div>
    );
  }

  const params = new URLSearchParams();
  params.set("returnTo", window.location.pathname);
  return (
    <div className="authStatus">
      <fetcher.Form method="GET" action={"/login?" + params.toString()}>
        <button type="submit">
          {fetcher.state !== "idle" ? "Signing in..." : "Sign in"}
        </button>
      </fetcher.Form>
    </div>
  );
}

export default LoginStatus;
