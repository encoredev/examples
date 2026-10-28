# Cursor Agents on Encore

A notes agent built with the [Cursor SDK](https://cursor.com/docs/sdk/typescript) that runs in your own AWS or GCP
account. Tell it something worth remembering, or ask what you saved. The agent loop runs inside an Encore service, its
tools are typed calls to a notes service, and its conversations and your notes live in your Postgres.

Inference goes to Cursor's hosted models. Everything else stays in your account.

[![Deploy to Encore](https://github.com/encoredev/examples/raw/main/assets/deploytoenc.svg)](https://app.encore.dev/create-app/clone/ts-cursor-agents)

## How it fits together

```
agent service ──── Postgres: Cursor SDK store + threads, turns, events
   │  Cursor SDK local agent, tools = typed calls into notes
   ▼
notes service ──── Postgres: notes

web service ────── serves the UI from web/dist
```

The parts worth reading:

- `agent/store.ts` implements the SDK's `LocalAgentStore` on Encore Postgres. Local Cursor agents normally keep state
  in SQLite on disk, which disappears with the container. With this store any instance can `Agent.resume()` any
  agent, and history survives deploys.
- `agent/tools.ts` defines the agent's tools as plain functions that call the notes service through Encore's
  generated client. The agent is created with `tools: ["mcp"]`, so these are the only things it can do. It has no
  shell and no filesystem.
- `agent/runtime.ts` starts turns in the background and writes a normalized event log (text, thinking, tool calls,
  usage) to Postgres.
- `agent/api.ts` streams that log to the browser over a WebSocket (`api.streamOut`). It tails the database, so the
  stream works no matter which instance runs the turn.

The sidebar graphic is the block field from the encore.dev landing page. Every tool call the agent makes raises a
stack of cubes.

## Your Cursor API key

There is no key on the server. The UI asks for your key from
[cursor.com/dashboard/api](https://cursor.com/dashboard/api), keeps it in your browser, and sends it with each message
in the `X-Cursor-Key` header. The agent service uses it for that run and never stores it. That's why the app deploys
without any secrets, and why someone who finds a deployed copy's URL can't spend your key.

## Run it locally

You need Node 22.13+, Docker and the [Encore CLI](https://encore.dev/docs/install).

```bash
npm install
encore run
```

Open http://localhost:4000 and paste your Cursor API key.

The built UI is committed in `web/dist`, so there is no frontend build step to deploy. To change the UI, run
`npm --prefix frontend install`, then `npm --prefix frontend run dev` next to `encore run` for hot reload, and
`npm --prefix frontend run build` to update `web/dist`.

## Deploy to your cloud

Use the button above, or:

```bash
encore app create my-agent --example=ts/cursor-agents
cd my-agent
git push encore main
```

Connect your AWS or GCP account in the Encore Cloud dashboard and create an environment on it. Encore provisions both
services and their databases there.

## Things to know

- **There is no login.** Anyone who can reach a deployed copy can read its conversations and notes, though not use
  your key. Add an [auth handler](https://encore.dev/docs/ts/develop/auth) before you save anything private or point
  the tools at real systems.
- `@cursor/sdk` needs Node 22.13 or newer. `encore.app` pins `node:22-slim` as the image base for that reason.
- One turn per thread runs at a time, enforced by a unique index. The instance running a turn keeps a heartbeat on
  it; if the instance dies mid-turn, the turn is marked interrupted two minutes later and the thread takes messages
  again.
- The first message of each thread carries the agent's brief (`BRIEF` in `runtime.ts`). The SDK's `systemPrompt`
  option would be cleaner but is enabled per account.
- Tool call arguments and results are recorded by wrapping the tools, not read from the SDK stream, whose tool
  payloads aren't a stable schema.
