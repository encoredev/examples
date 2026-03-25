# Ory + Encore Authentication Example

Authentication using [Ory Network](https://www.ory.sh/) and [Encore.ts](https://encore.dev).

[![Deploy to Encore](https://github.com/encoredev/examples/raw/main/assets/deploytoenc.svg)](https://app.encore.cloud/create-app/clone/ts-ory)

This example demonstrates:
- Ory session verification via the `@ory/client` SDK
- Encore auth handler pattern with type-safe user data
- Auto-provisioned PostgreSQL database for user preferences
- Frontend with registration and login using Ory's self-service API flow

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

**Ory Account:**
1. Sign up at [console.ory.sh](https://console.ory.sh/)
2. Create a new project
3. Copy your **project slug** from the project settings

**Ory CLI** (for local development):
```bash
brew install ory/tap/ory
```

## Running locally

1. Set your Ory secret:
   ```bash
   encore app create --example=ts/ory
   cd ory
   npm install
   encore secret set --type dev,local OryProjectSlug
   ```

2. Ory doesn't allow `localhost` as a CORS origin. Run Ory Tunnel to proxy their API through localhost:
   ```bash
   ory tunnel http://localhost:4000 --project your-slug
   ```
   Adjust the port if Encore assigns a different one.

3. Run the app:
   ```bash
   encore run
   ```

4. Open the frontend at the URL shown in `encore run` output.

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/auth/login-info` | No | Returns Ory project URL for frontend |
| GET | `/user/profile` | Yes | Returns user profile with preferences |
| POST | `/user/preferences` | Yes | Updates user preferences |

## How it works

1. Frontend calls Ory's self-service APIs directly for registration/login
2. Ory returns a session token
3. Frontend sends the token as `Authorization: Bearer` to Encore endpoints
4. Encore's auth handler verifies the token by calling `ory.toSession()`
5. Protected endpoints get type-safe access to the user's identity via `getAuthData()`

## Deployment

```bash
git push encore
```

Set the production secret:
```bash
encore secret set --type production OryProjectSlug
```

## Learn More

- [Complete Tutorial](https://encore.dev/blog/ory-tutorial)
- [Ory Documentation](https://www.ory.sh/docs)
- [Encore Documentation](https://encore.dev/docs)
