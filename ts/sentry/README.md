# Sentry + Encore Error Tracking Example

Error tracking for backend services using [Sentry](https://sentry.io/) and [Encore.ts](https://encore.dev).

[![Deploy to Encore](https://github.com/encoredev/examples/raw/main/assets/deploytoenc.svg)](https://app.encore.cloud/create-app/clone/ts-sentry)

This example demonstrates:
- Sentry initialization with Encore's secret management
- `withSentry` wrapper for automatic error capture on API endpoints
- Breadcrumbs for event timeline context
- Disabling Sentry tracing (Encore has built-in distributed tracing)

## Prerequisites

**Install Encore:**
```bash
# macOS
brew install encoredev/tap/encore

# Linux
curl -L https://encore.dev/install.sh | bash

# Windows
iwr https://encore.dev/install.ps1 | iex
```

**Sentry Account:**
1. Sign up at [sentry.io](https://sentry.io/)
2. Create a new Node.js project
3. Copy the **DSN** from project settings

## Running locally

1. Create the app and set your Sentry DSN:
   ```bash
   encore app create --example=ts/sentry
   cd sentry
   npm install
   encore secret set --type dev,local SentryDSN
   ```

2. Run the app:
   ```bash
   encore run
   ```

3. Open the frontend at the URL shown in `encore run` output.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check (no Sentry wrapper) |
| POST | `/process` | Process an item (wrapped with Sentry) |
| GET | `/error-test` | Intentionally throws an error to test Sentry |

## How it works

Sentry is initialized in the service definition, which passes the DSN from Encore's secret manager. The `withSentry` wrapper catches errors from API handlers and reports them with endpoint name, request data, and breadcrumbs as context.

Sentry's tracing is disabled (`tracesSampleRate: 0`) since Encore handles distributed tracing. HTTP integrations are filtered out since Encore's Rust gateway handles inbound requests.

## Test error capture

```bash
# Trigger an error
curl http://localhost:4000/error-test

# Process an item (works normally)
curl -X POST http://localhost:4000/process \
  -H "Content-Type: application/json" \
  -d '{"itemId": "prod_1", "quantity": 2}'
```

Check your Sentry dashboard to see captured errors with endpoint tags and request context.

## Deployment

```bash
git push encore
```

Set the production secret:
```bash
encore secret set --type production SentryDSN
```

## Learn More

- [Complete Tutorial](https://encore.dev/blog/sentry-tutorial)
- [Sentry Node.js Docs](https://docs.sentry.io/platforms/node/)
- [Encore Documentation](https://encore.dev/docs)
