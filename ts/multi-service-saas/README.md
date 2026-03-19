# Multi-Service SaaS Backend

A SaaS backend starter built with [Encore.ts](https://encore.dev), demonstrating multi-service architecture with event-driven communication.

## Architecture

This app has three services, each with its own database:

- **user** — User management. Publishes `UserCreated` events.
- **billing** — Subscription management. Subscribes to `UserCreated` to auto-provision free plans. Publishes `PlanChanged` events on upgrades.
- **project** — Project management. Enforces plan-based limits (free: 3, pro: 25, enterprise: unlimited) via the billing service.

### Patterns demonstrated

- **Event-driven provisioning** — When a user signs up, the billing service automatically creates a free subscription via Pub/Sub.
- **Plan-based limits** — The project service calls the billing service to enforce project limits based on the user's plan.
- **Database per service** — Each service owns its data, with no shared tables.

## Getting Started

```bash
encore run
```

The Postgres databases are provisioned automatically on startup. Each service gets its own database — no manual setup required.

Open [http://localhost:4000](http://localhost:4000) for usage instructions, or [http://localhost:9400](http://localhost:9400) for the Local Dashboard. When deployed to [Encore Cloud](https://app.encore.cloud), use the Service Catalog to call endpoints and view traces to see how requests flow between services.

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

### Projects

```bash
# Create a project (enforces plan-based limits)
curl -X POST http://localhost:4000/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "My Project", "description": "A great project", "owner_id": "<user_id>"}'

# List projects
curl http://localhost:4000/projects

# List by owner
curl "http://localhost:4000/projects?owner_id=<user_id>"

# Get a project
curl http://localhost:4000/projects/<project_id>
```
