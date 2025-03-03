import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { ClientSideData } from "./client-side-data";
import { ServerSideData } from "./server-side-data";

export default function DashboardPage() {
  return (
    <div className="container">
      <h1>Dashboard</h1>

      <div className="flex flex-col gap-4">
        <ServerSideData />

        <ClientSideData />
      </div>
    </div>
  );
}
