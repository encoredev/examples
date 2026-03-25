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

## Getting Started

1. Create a new app from this example:
   ```bash
   encore app create --example=ts/sentry
   ```

2. Set your Sentry DSN:
   ```bash
   encore secret set --type dev,local,pr,production SentryDSN
   ```

3. Run the app:
   ```bash
   encore run
   ```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check (no Sentry wrapper) |
| POST | `/process` | Process an item (wrapped with Sentry) |
| GET | `/error-test` | Intentionally throws an error to test Sentry |

### Test error capture

```bash
# This will throw an error and report it to Sentry
curl http://localhost:4000/error-test

# This works normally
curl -X POST http://localhost:4000/process \
  -H "Content-Type: application/json" \
  -d '{"itemId": "prod_1", "quantity": 2}'

# This triggers a validation error
curl -X POST http://localhost:4000/process \
  -H "Content-Type: application/json" \
  -d '{"itemId": "prod_1", "quantity": -1}'
```

Check your Sentry dashboard to see the captured errors with endpoint tags and request context.

## Deployment

```bash
git add .
git commit -m "Add Sentry error tracking"
git push encore
```

## Learn More

- [Sentry Node.js Docs](https://docs.sentry.io/platforms/node/)
- [Encore.ts Documentation](https://encore.dev/docs)
- [Tutorial: Sentry + Encore](https://encore.dev/blog/sentry-tutorial)
