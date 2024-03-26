import getRequestClient from "@/app/lib/getRequestClient";
import { admin, APIError, ErrCode } from "@/app/lib/client";
import { redirect } from "next/navigation";

export default async function Admin() {
  const client = getRequestClient();
  let response: admin.DashboardData;
  try {
    response = await client.admin.getDashboardData();
  } catch (e) {
    console.error(e);
    const error = e as APIError;
    if (error.code === ErrCode.Unauthenticated) {
      return redirect("/auth/unauthenticated?from=%2Fadmin");
    }
    throw error;
  }

  return (
    <section>
      <h1>Admin Dashboard</h1>
      <br />
      <p>{response.value}</p>
    </section>
  );
}
