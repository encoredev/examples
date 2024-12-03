import {getAuth} from "@clerk/remix/ssr.server";
import {LoaderFunction, redirect} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";

import getRequestClient from "~/lib/getRequestClient";

export const loader: LoaderFunction = async (args) => {
  // Use getAuth() to retrieve the user's ID
  const {userId, getToken} = await getAuth(args)

  // If there is no userId, then redirect to sign-in route
  if (!userId) {
    return redirect('/sign-in?redirect_url=' + args.request.url)
  }

  const token = await getToken();
  const client = getRequestClient(token ?? undefined);

  return {
    profile: await client.admin.GetAdminDashboardData()
  }
}

export default function AdminDashboard() {
  const data = useLoaderData<typeof loader>()
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>{data?.value}</p>
    </div>
  )
}