# WorkOS AuthKit + Encore Authentication Example

A production-ready authentication backend using [WorkOS AuthKit](https://workos.com/) and [Encore.ts](https://encore.dev).

[![Deploy to Encore](https://github.com/encoredev/examples/raw/main/assets/deploytoenc.svg)](https://app.encore.cloud/create-app/clone/ts-workos)

This example demonstrates:
- WorkOS AuthKit redirect-based authentication flow
- JWT verification using `jose` and WorkOS JWKS
- Protected API endpoints with type-safe auth data
- Auto-provisioned PostgreSQL database for user preferences
- Organization and role support from JWT claims
- Logout with AuthKit session termination

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

**WorkOS Account:**
1. Sign up at [workos.com](https://workos.com/)
2. Create a new project
3. Copy your **API Key** and **Client ID** from the dashboard
4. Go to **Redirects** and configure:
   - **Redirect URI**: add `http://localhost:4000/auth/callback` (adjust the port if Encore assigns a different one — check the output of `encore run`)
   - **Sign-out redirect**: set to `http://localhost:4000/` (same port as above)

## Getting Started

1. Create a new app from this example:
   ```bash
   encore app create --example=ts/workos
   ```

2. Set your WorkOS secrets:
   ```bash
   encore secret set --type dev,local,pr,production WorkOSApiKey
   encore secret set --type dev,local,pr,production WorkOSClientID
   encore secret set --type dev,local WorkOSRedirectURI
   ```
   For the redirect URI, enter `http://localhost:4000/auth/callback` (or whatever port Encore is running on).

3. Run the app:
   ```bash
   encore run
   ```

4. Open the frontend at the URL shown in `encore run` output (e.g. `http://localhost:4000/`).

5. Open the local dashboard at [localhost:9400](http://localhost:9400) to explore the API and traces.

## Auth Flow

1. `GET /auth/login` — returns the AuthKit authorization URL
2. User authenticates on AuthKit's hosted UI (email/password, Google, etc.)
3. WorkOS redirects to `GET /auth/callback` with an authorization code
4. The callback exchanges the code for an access token and redirects to the frontend
5. The frontend stores the access token and sends it as `Authorization: Bearer <token>` on API requests
6. The auth handler verifies the JWT against WorkOS JWKS and makes user data available to protected endpoints
7. `POST /auth/logout` ends both the local session and the AuthKit session

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/auth/login` | No | Returns AuthKit authorization URL |
| GET | `/auth/callback` | No | Exchanges auth code for tokens, redirects to frontend |
| POST | `/auth/logout` | No | Returns WorkOS logout URL to end AuthKit session |
| GET | `/user/profile` | Yes | Returns user profile with preferences |
| POST | `/user/preferences` | Yes | Updates user preferences |

## Deployment

```bash
git add .
git commit -m "Add WorkOS authentication"
git push encore
```

Set production secrets before deploying:
```bash
encore secret set --type production WorkOSApiKey
encore secret set --type production WorkOSClientID
encore secret set --type production WorkOSRedirectURI
```

For production, update the redirect URI to your production URL and add it in the WorkOS dashboard.

## Learn More

- [WorkOS AuthKit Docs](https://workos.com/docs/authkit)
- [Encore.ts Auth Handler Docs](https://encore.dev/docs/ts/develop/auth)
- [Tutorial: WorkOS + Encore](https://encore.dev/blog/workos-tutorial)
