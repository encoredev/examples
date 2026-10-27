import Client, { Local, type agent } from "./client";

// In development the UI runs on Vite and talks to `encore run` on :4000. Built,
// it is served by the Encore app itself, so it calls its own origin.
export const api = new Client(import.meta.env.DEV ? Local : window.location.origin);

export type Thread = agent.Thread;
export type Turn = agent.Turn;
export type TurnEvent = agent.TurnEvent;

export const errorMessage = (err: unknown) =>
  err instanceof Error ? err.message : "Something went wrong";

export const ago = (d: string | Date) => {
  const s = Math.max(0, (Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return "now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
};

export type Mode = agent.Mode;

// One-click: Encore Cloud clones this example into a new app and walks you
// through connecting AWS or GCP. Same flow as the Deploy buttons on encore.dev.
export const CODE_URL = "https://github.com/encoredev/examples/tree/main/ts/cursor-agents";

export const DEPLOY_URL =
  "https://app.encore.dev/create-app/clone/ts-cursor-agents?" +
  new URLSearchParams({ utm_source: "oncall_desk", utm_medium: "example_app", utm_campaign: "cursor-agents" });
