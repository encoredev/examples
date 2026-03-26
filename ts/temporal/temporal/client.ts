// temporal/client.ts
import { Client, Connection } from "@temporalio/client";
import { NativeConnection, Worker, bundleWorkflowCode } from "@temporalio/worker";
import * as activities from "./activities";
import path from "path";

let client: Client;
let worker: Worker;
let ready: Promise<void>;

export function initTemporal(): void {
  ready = startTemporal();
}

async function startTemporal(): Promise<void> {
  const clientConnection = await Connection.connect({
    address: "localhost:7233",
  });
  client = new Client({ connection: clientConnection });

  const workerConnection = await NativeConnection.connect({
    address: "localhost:7233",
  });

  // Pre-bundle workflow code from the source directory.
  // Temporal needs the raw source to bundle into its V8 isolate,
  // but Encore compiles everything into a combined bundle first.
  // Using the original source path ensures Temporal can find the file.
  const workflowBundle = await bundleWorkflowCode({
    workflowsPath: path.join(process.cwd(), "temporal", "workflows.ts"),
  });

  worker = await Worker.create({
    connection: workerConnection,
    workflowBundle,
    activities,
    taskQueue: "orders",
  });

  worker.run().catch((err) => {
    console.error("Worker stopped with error:", err);
  });
}

export async function getClient(): Promise<Client> {
  await ready;
  return client;
}
