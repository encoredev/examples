# Multi-Service SaaS Backend

A production-ready SaaS backend pattern built with [Encore.ts](https://encore.dev), demonstrating multi-service architecture with event-driven communication.

## Architecture

This app has three services, each with its own database:

- **user** — User management. Publishes `UserCreated` events.
- **billing** — Subscription management. Subscribes to `UserCreated` to auto-provision free plans. Publishes `PlanChanged` events on upgrades.
- **product** — Product CRUD. Calls the billing service to verify active subscriptions before allowing product creation.

### Patterns demonstrated

- **Event-driven provisioning** — When a user signs up, the billing service automatically creates a free subscription via Pub/Sub.
- **Cross-service authorization** — The product service calls the billing service to check subscription status before creating products.
- **Database per service** — Each service owns its data, with no shared tables.

## Getting Started

```bash
encore run
```

## API Endpoints

### Users

```bash
# Create a user
curl -X POST http://localhost:4000/users \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@example.com", "name": "Alice"}'

# List users
curl http://localhost:4000/users

# Get a user
curl http://localhost:4000/users/<user_id>
```

### Billing

```bash
# Get billing info (auto-created after user signup)
curl http://localhost:4000/billing/<user_id>

# Upgrade plan
curl -X POST http://localhost:4000/billing/<user_id>/upgrade \
  -H "Content-Type: application/json" \
  -d '{"plan": "pro"}'
```

### Products

```bash
# Create a product (requires active subscription)
curl -X POST http://localhost:4000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "My Product", "description": "A great product", "owner_id": "<user_id>"}'

# List products
curl http://localhost:4000/products

# List by owner
curl "http://localhost:4000/products?owner_id=<user_id>"

# Get a product
curl http://localhost:4000/products/<product_id>
```
