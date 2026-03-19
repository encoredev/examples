# AI Agent API Backend

A backend for building AI-powered applications using [Encore.ts](https://encore.dev) and Claude.

## Architecture

This app has two services:

- **chat** — Manages conversation sessions and message history (Postgres DB). Exposes the public API.
- **ai** — Internal service that calls the Anthropic Claude API to generate responses.

## Prerequisites

- [Encore CLI](https://encore.dev/docs/ts/install)
- An [Anthropic API key](https://console.anthropic.com/)

## Getting Started

1. Set the Anthropic API key as a secret:

```bash
encore secret set --type dev,local,pr,prod AnthropicAPIKey
```

2. Run the app:

```bash
encore run
```

The Postgres database is provisioned automatically on startup. Encore runs the migrations and manages the database for you — no manual setup required.

Open [http://localhost:4000](http://localhost:4000) for usage instructions, or [http://localhost:9400](http://localhost:9400) for the Local Dashboard. When deployed to [Encore Cloud](https://app.encore.cloud), use the Service Catalog to call endpoints and view traces to see how requests flow between services.

## API Endpoints

### Send a message

```bash
curl -X POST http://localhost:4000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is Encore?"}'
```

Returns a `session_id` you can use for follow-up messages:

```bash
curl -X POST http://localhost:4000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me more", "session_id": "<session_id>"}'
```

### Get conversation history

```bash
curl http://localhost:4000/chat/<session_id>
```

### List all sessions

```bash
curl http://localhost:4000/chat
```
