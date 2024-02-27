import { useContext, useEffect, useState } from "react";
import getRequestClient from "../lib/getRequestClient.ts";
import { admin } from "../lib/client.ts";
import { FirebaseContext } from "../lib/firebase.tsx";

function AdminDashboard() {
  const { auth } = useContext(FirebaseContext);
  const [data, setData] = useState<admin.DashboardData>();
  const [loading, setLoading] = useState(true);

  // Fetch admin data if user is authenticated
  useEffect(() => {
    const getDashboardData = async () => {
      const token = await auth?.currentUser?.getIdToken();
      const client = getRequestClient(token ?? undefined);
      setData(await client.admin.GetAdminDashboardData());
      setLoading(false);
    };
    if (auth?.currentUser?.uid) getDashboardData();
  }, [auth?.currentUser?.uid]);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {loading ? <p>Loading...</p> : <p>{data?.value}</p>}
    </div>
  );
}

export default AdminDashboard;
