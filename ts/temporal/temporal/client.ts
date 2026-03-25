// temporal/client.ts
import { Client, Connection } from "@temporalio/client";
import { Worker } from "@temporalio/worker";
import * as activities from "./activities";

let client: Client;
let worker: Worker;

export async function initTemporal(): Promise<void> {
  // Connect to the Temporal server (localhost:7233 in dev).
  // For production, point this to Temporal Cloud or your self-hosted cluster.
  const connection = await Connection.connect({
    address: "localhost:7233",
  });

  client = new Client({ connection });

  // The worker polls for tasks and executes workflows + activities.
  // workflowsPath points to the workflow file - Temporal bundles it
  // into a sandboxed V8 isolate automatically.
  worker = await Worker.create({
    connection,
    workflowsPath: require.resolve("./workflows"),
    activities,
    taskQueue: "orders",
  });

  // Run the worker in the background. It returns when shut down.
  worker.run().catch((err) => {
    console.error("Worker stopped with error:", err);
  });
}

export async function shutdownTemporal(): Promise<void> {
  worker?.shutdown();
}

export function getClient(): Client {
  return client;
}
