# Ory + Encore Authentication Example

A production-ready authentication backend using [Ory Network](https://www.ory.sh/) and [Encore.ts](https://encore.dev).

[![Deploy to Encore](https://github.com/encoredev/examples/raw/main/assets/deploytoenc.svg)](https://app.encore.cloud/create-app/clone/ts-ory)

This example demonstrates:
- Ory session verification via the `@ory/client` SDK
- Protected API endpoints with type-safe auth data
- Auto-provisioned PostgreSQL database for user preferences
- Secure secret management with Encore

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

**Docker** (for local PostgreSQL)

**Ory Network Account:**
1. Sign up at [console.ory.sh](https://console.ory.sh/)
2. Create a new project
3. Copy your **project slug** from the project settings (the subdomain in your Ory URL, e.g. `your-slug` from `https://your-slug.projects.oryapis.com`)

## Getting Started

1. Create a new app from this example:
   ```bash
   encore app create --example=ts/ory
   ```

2. Set your Ory secret:
   ```bash
   encore secret set --type dev,local,pr,production OryProjectSlug
   ```

3. Run the app:
   ```bash
   encore run
   ```

4. Open the local dashboard at [localhost:9400](http://localhost:9400) to explore the API and traces.

## Auth Flow

1. User authenticates via Ory Account Experience (hosted login UI)
2. Frontend receives a session token
3. Frontend sends the token as `Authorization: Bearer <token>` on API requests
4. The auth handler calls `ory.toSession()` to verify the token and extract identity data
5. Protected endpoints receive type-safe auth data via `getAuthData()`

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/user/profile` | Yes | Returns user profile with preferences |
| POST | `/user/preferences` | Yes | Updates user preferences |

## Deployment

```bash
git add .
git commit -m "Add Ory authentication"
git push encore
```

Set production secrets before deploying:
```bash
encore secret set --type production OryProjectSlug
```

## Learn More

- [Ory Network Docs](https://www.ory.sh/docs/)
- [Encore.ts Auth Handler Docs](https://encore.dev/docs/ts/develop/auth)
- [Tutorial: Ory + Encore](https://encore.dev/blog/ory-tutorial)
