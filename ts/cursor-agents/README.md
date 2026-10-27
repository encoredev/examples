# Cursor Agents on Encore

An on-call agent built with the [Cursor SDK](https://cursor.com/docs/sdk/typescript) that runs in your own AWS or GCP
account. The agent loop runs inside an Encore service, its tools are typed calls to your own APIs, its conversation
history lives in your Postgres, and Pub/Sub and Cron start work without anyone asking.

Inference goes to Cursor's hosted models. Everything else stays in your account.

[![Deploy to Encore](https://github.com/encoredev/examples/raw/main/assets/deploytoenc.svg)](https://app.encore.dev/create-app/clone/ts-cursor-agents)

## How it fits together

```
incidents service ──── Postgres: incidents, deploys, metrics
   │  publishes incident-opened
   ▼
agent service ──────── Postgres: Cursor SDK store + threads, turns, events
   │  Cursor SDK local agent, tools = typed calls back into incidents
   │  Subscription "agent-triage"  → triage run per new incident
   │  CronJob "morning-handoff"    → weekday handoff run
   ▼
web service ────────── serves the UI from web/dist
```

The parts worth reading:

- `agent/store.ts` implements the SDK's `LocalAgentStore` on Encore Postgres. Local Cursor agents normally keep state
  in SQLite on disk, which disappears with the container. With this store any instance can `Agent.resume()` any
  agent, and history survives deploys.
- `agent/tools.ts` defines the agent's tools as plain functions that call the incidents service through Encore's
  generated client. The agent is created with `tools: ["mcp"]`, so these are the only things it can do. It has no
  shell and no filesystem.
- `agent/runtime.ts` starts turns in the background and writes a normalized event log (text, thinking, tool calls,
  usage) to Postgres.
- `agent/api.ts` streams that log to the browser over a WebSocket (`api.streamOut`). It tails the database, so the
  stream works no matter which instance runs the turn.
- `agent/triggers.ts` holds the Pub/Sub subscription and the cron job.

The sidebar graphic is the block field from the encore.dev landing page. Every tool call the agent makes raises a
stack of cubes.

## Run it locally

You need Node 22.13+, Docker, the [Encore CLI](https://encore.dev/docs/install), and a Cursor API key from
[cursor.com/dashboard/api](https://cursor.com/dashboard/api).

```bash
npm install
encore secret set --type dev,local CursorApiKey   # paste your key
encore run
```

Open http://localhost:4000. Try "Open a test incident" in the right rail: the incidents service publishes to Pub/Sub,
the agent service picks it up, and a triage thread starts on its own.

The built UI is committed in `web/dist`, so there is no frontend build step to deploy. To change the UI, run
`npm --prefix frontend install`, then `npm --prefix frontend run dev` next to `encore run` for hot reload, and
`npm --prefix frontend run build` to update `web/dist`.

## Deploy to your cloud

Use the button above, or:

```bash
encore app create my-oncall-desk --example=ts/cursor-agents
cd my-oncall-desk
encore secret set --type prod CursorApiKey
git push encore main
```

Connect your AWS or GCP account in the Encore Cloud dashboard and create an environment on it. Encore provisions the
two databases, the Pub/Sub topic, the cron job and the secret there.

## Modes

The `CursorApiKey` secret decides how the desk behaves:

- **Not set:** the UI explains how to add a key instead of failing.
- **A real key:** the agent runs for real.
- **The literal value `replay`:** the desk replays recorded runs instead of calling Cursor. This is how the public
  demo runs without spending tokens on anyone's prompt. The recorded text and timing are replayed, and every tool
  call runs again for real against the current data. Record new runs with `node scripts/record.mjs <threadId>...`
  against a desk running with a real key.

## Things to know

- `@cursor/sdk` needs Node 22.13 or newer. `encore.app` pins `node:22-slim` as the image base for that reason.
- One turn per thread runs at a time. If an instance dies mid-turn, the turn is marked interrupted after five quiet
  minutes and the thread takes messages again.
- The first message of each thread carries the agent's brief (`BRIEF` in `runtime.ts`). The SDK's `systemPrompt`
  option would be cleaner but is enabled per account.
- Tool call arguments and results are recorded by wrapping the tools, not read from the SDK stream, whose tool
  payloads aren't a stable schema.
