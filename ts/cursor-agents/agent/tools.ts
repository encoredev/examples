import type { SDKCustomTool, SDKJsonValue } from "@cursor/sdk";
import { notes } from "~encore/clients";

// The agent's hands. Each tool is an ordinary async function that calls the
// notes service through Encore's generated client, so the call is typed,
// traced, and goes over the same service-to-service path as any other API
// call in the app. The model sees these through the SDK's custom-tools MCP
// server; it never gets a shell or a filesystem (see `tools: ["mcp"]` in
// runtime.ts).

// Tool results must be plain JSON; API responses carry Dates.
const out = (v: unknown) => JSON.parse(JSON.stringify(v)) as SDKJsonValue;

export const agentTools: Record<string, SDKCustomTool> = {
  list_notes: {
    description: "List the saved notes, most recently changed first.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    async execute() {
      return out(await notes.list());
    },
  },

  search_notes: {
    description: "Find notes whose title or body contains the given text.",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"],
    },
    annotations: { readOnlyHint: true },
    async execute({ query }) {
      return out(await notes.search({ query: String(query) }));
    },
  },

  save_note: {
    description:
      "Save a note with a short title and a body. Pass `id` to replace an existing note " +
      "instead of adding a new one.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "number" },
        title: { type: "string" },
        body: { type: "string" },
      },
      required: ["title", "body"],
    },
    async execute({ id, title, body }) {
      return out(
        await notes.save({
          id: id === undefined ? undefined : Number(id),
          title: String(title),
          body: String(body),
        }),
      );
    },
  },
};
