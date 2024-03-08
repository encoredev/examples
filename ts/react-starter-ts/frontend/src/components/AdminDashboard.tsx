import { useLoaderData } from "react-router-dom";
import getRequestClient from "../lib/getRequestClient.ts";
import { admin } from "../lib/client.ts";

export function adminDashboardLoader() {
  const client = getRequestClient();
  return client.admin.GetAdminDashboardData();
}

function AdminDashboard() {
  const data = useLoaderData() as admin.DashboardData;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>{data.value}</p>
    </div>
  );
}

export default AdminDashboard;
