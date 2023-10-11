import { LoaderFunctionArgs, redirect, useLoaderData } from "react-router-dom";
import getRequestClient from "../lib/getRequestClient.ts";
import { user } from "../lib/client.ts";
import { fakeAuthProvider } from "../lib/auth.ts";

export function userDetailsLoader({ request, params }: LoaderFunctionArgs) {
  // If the user is not logged in and tries to access `/users/:id`, we redirect
  // them to `/login` with a `from` parameter that allows login to redirect back
  // to this page upon successful authentication
  if (!fakeAuthProvider.isAuthenticated) {
    const params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/login?" + params.toString());
  }

  const client = getRequestClient();
  return client.user.GetUser(params.id as string);
}

function UserDetailsPage() {
  const data = useLoaderData() as user.UserResponse;

  return (
    <div>
      <h2>Details for {data.user.name}</h2>
      <p>ID: {data.user.id}</p>
    </div>
  );
}

export default UserDetailsPage;
