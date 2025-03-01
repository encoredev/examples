import { ServerSideData } from "./server-side-data";
import { ClientSideData } from "./client-side-data";

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>

      <div className="flex flex-col gap-4">
        <ServerSideData />

        <ClientSideData />
      </div>
    </div>
  );
}
