import type { SDKCustomTool, SDKJsonValue } from "@cursor/sdk";
import { incidents } from "~encore/clients";

// The agent's hands. Each tool is an ordinary async function that calls the
// incidents service through Encore's generated client, so the call is typed,
// traced, and goes over the same service-to-service path as any other API
// call in the app. The model sees these through the SDK's custom-tools MCP
// server; it never gets a shell or a filesystem (see `tools: ["mcp"]` in
// runtime.ts).

const AUTHOR = "on-call agent";

// Tool results must be plain JSON; API responses carry Dates.
const out = (v: unknown) => JSON.parse(JSON.stringify(v)) as SDKJsonValue;

const summarize = (xs: number[]) => {
  if (xs.length === 0) return null;
  const sorted = [...xs].sort((a, b) => a - b);
  const pick = (q: number) => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))];
  return {
    min: sorted[0],
    median: pick(0.5),
    max: sorted[sorted.length - 1],
    mean: Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 1000) / 1000,
  };
};

export const deskTools: Record<string, SDKCustomTool> = {
  list_incidents: {
    description: "List incidents, unresolved first. Optionally filter by status.",
    inputSchema: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["open", "investigating", "mitigated", "resolved"] },
      },
    },
    annotations: { readOnlyHint: true },
    async execute({ status }) {
      const { incidents: list } = await incidents.list({ status: status as any });
      return out(list.map((i) => ({
        id: i.id,
        title: i.title,
        service: i.service,
        severity: i.severity,
        status: i.status,
        openedAt: i.openedAt,
      })));
    },
  },

  get_incident: {
    description: "Get one incident with its summary and full timeline of updates.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "number" } },
      required: ["id"],
    },
    annotations: { readOnlyHint: true },
    async execute({ id }) {
      return out(await incidents.get({ id: Number(id) }));
    },
  },

  recent_deploys: {
    description: "List the most recent deploys, newest first. Filter by service to find suspects.",
    inputSchema: {
      type: "object",
      properties: { service: { type: "string" } },
    },
    annotations: { readOnlyHint: true },
    async execute({ service }) {
      const { deploys } = await incidents.deploys({ service: service as string | undefined });
      return out(deploys);
    },
  },

  service_metrics: {
    description:
      "Per-minute p95 latency (ms), error rate and requests/sec for a service. " +
      "Pass `split_at` (ISO time, e.g. a deploy time) to compare before and after it.",
    inputSchema: {
      type: "object",
      properties: {
        service: { type: "string" },
        minutes: { type: "number", description: "Window size, default 60" },
        split_at: { type: "string", description: "ISO timestamp to split the window at" },
      },
      required: ["service"],
    },
    annotations: { readOnlyHint: true },
    async execute({ service, minutes, split_at }) {
      const { points } = await incidents.metrics({
        service: String(service),
        minutes: minutes ? Number(minutes) : 60,
      });
      const stats = (ps: typeof points) => ({
        samples: ps.length,
        p95Ms: summarize(ps.map((p) => p.p95Ms)),
        errorRate: summarize(ps.map((p) => p.errorRate)),
        rps: summarize(ps.map((p) => p.rps)),
      });
      if (!split_at) return out({ service, window: stats(points) });
      const t = new Date(String(split_at)).getTime();
      return out({
        service,
        before: stats(points.filter((p) => new Date(p.minute).getTime() < t)),
        after: stats(points.filter((p) => new Date(p.minute).getTime() >= t)),
      });
    },
  },

  post_update: {
    description: "Post a note to an incident's timeline. Keep it short and factual; humans read these.",
    inputSchema: {
      type: "object",
      properties: {
        incident_id: { type: "number" },
        body: { type: "string" },
      },
      required: ["incident_id", "body"],
    },
    async execute({ incident_id, body }) {
      return out(await incidents.addUpdate({ id: Number(incident_id), author: AUTHOR, body: String(body) }));
    },
  },

  set_status: {
    description:
      "Move an incident to a new status. Use `investigating` once you are on it and " +
      "`mitigated` only when metrics show recovery. Never resolve; a human does that.",
    inputSchema: {
      type: "object",
      properties: {
        incident_id: { type: "number" },
        status: { type: "string", enum: ["investigating", "mitigated"] },
      },
      required: ["incident_id", "status"],
    },
    annotations: { destructiveHint: false, idempotentHint: true },
    async execute({ incident_id, status }) {
      return out(
        await incidents.setStatus({ id: Number(incident_id), status: status as "investigating" | "mitigated" }),
      );
    },
  },
};
