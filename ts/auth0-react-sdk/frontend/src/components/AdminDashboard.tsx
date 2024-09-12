import { useEffect, useState } from "react";
import getRequestClient from "../lib/getRequestClient.ts";
import { admin } from "../lib/client.ts";
import { useAuth0 } from "@auth0/auth0-react";

function AdminDashboard() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState<admin.DashboardData>();
  const [loading, setLoading] = useState(true);

  // Fetch admin data if user is authenticated
  useEffect(() => {
    const getDashboardData = async () => {
      const token = await getAccessTokenSilently();
      const client = getRequestClient(token ?? undefined);
      setData(await client.admin.getDashboardData());
      setLoading(false);
    };
    if (isAuthenticated) getDashboardData();
  }, [isAuthenticated]);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {loading ? <p>Loading...</p> : <p>{data?.value}</p>}
    </div>
  );
}

export default AdminDashboard;
