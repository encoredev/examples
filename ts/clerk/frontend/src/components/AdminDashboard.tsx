import { useEffect, useState } from "react";
import getRequestClient from "../lib/getRequestClient.ts";
import { useAuth } from "@clerk/clerk-react";
import { admin } from "../lib/client.ts";

function AdminDashboard() {
  const { getToken, isSignedIn } = useAuth();
  const [data, setData] = useState<admin.DashboardData>();
  const [loading, setLoading] = useState(true);

  // Fetch admin data if user is authenticated
  useEffect(() => {
    const getDashboardData = async () => {
      const token = await getToken();
      const client = getRequestClient(token ?? undefined);
      setData(await client.admin.getDashboardData());
      setLoading(false);
    };
    if (isSignedIn) getDashboardData();
  }, [isSignedIn]);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {loading ? <p>Loading...</p> : <p>{data?.value}</p>}
    </div>
  );
}

export default AdminDashboard;
