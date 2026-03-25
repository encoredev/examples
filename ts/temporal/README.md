# Temporal + Encore Order Processing Example

Durable order processing workflows using [Temporal](https://temporal.io/) and [Encore.ts](https://encore.dev).

[![Deploy to Encore](https://github.com/encoredev/examples/raw/main/assets/deploytoenc.svg)](https://app.encore.cloud/create-app/clone/ts-temporal)

This example demonstrates:
- Durable order processing workflow with saga-pattern compensation
- Activity retries with configurable timeouts and backoff
- Activities calling Encore services via type-safe service clients
- Orders stored in a PostgreSQL database (auto-provisioned by Encore)
- Synchronous and asynchronous workflow execution
- Failure scenarios you can trigger from the frontend

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

**Install Temporal CLI:**
```bash
# macOS
brew install temporal
```

## Running locally

1. Start the Temporal dev server:
   ```bash
   temporal server start-dev
   ```

2. In a separate terminal, run the Encore app:
   ```bash
   encore app create --example=ts/temporal
   cd temporal
   npm install
   encore run
   ```

3. Open the frontend at the URL shown in `encore run` output.

4. Open the Temporal Web UI at [http://localhost:8233](http://localhost:8233) to see workflow execution.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/orders` | Create an order (waits for workflow to complete) |
| `POST` | `/orders/async` | Start an order (fire-and-forget, returns workflow ID) |
| `GET` | `/orders/:workflowId` | Get workflow status and result |
| `GET` | `/orders/:orderId/details` | Get order from database |

## Testing failure scenarios

Use these product IDs to trigger different workflow paths:
- **`out-of-stock`** - inventory check fails, order not created
- **`fail-shipping`** - shipping fails after payment, triggers refund (saga pattern)
- Any other product ID - completes successfully

## Deployment

```bash
git push encore
```

For production, use [Temporal Cloud](https://temporal.io/cloud) and store credentials using Encore secrets:
```bash
encore secret set --prod TemporalAddress
encore secret set --prod TemporalNamespace
```

## Learn More

- [Complete Tutorial](https://encore.dev/blog/temporal-tutorial)
- [Temporal Documentation](https://docs.temporal.io/)
- [Encore Documentation](https://encore.dev/docs)
