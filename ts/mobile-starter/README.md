# Mobile App Starter with WorkOS Auth

A full-stack monorepo starter with an **Encore.ts** backend, **Vite/React** web app, and **Expo/React Native** mobile app -- all sharing the same WorkOS-powered authentication system.

## Features

- Email/password authentication with email verification
- OAuth login (Google, Microsoft)
- Password reset flow
- Organization management with role-based access control
- Member invitations with role assignment
- Token refresh with automatic scheduling
- Protected routes on both web and mobile

## Roles & Permissions

| Permission | Admin | Member |
|---|---|---|
| View dashboard | Yes | Yes |
| View/edit profile | Yes | Yes |
| View members | Yes | Yes |
| Invite members | Yes | No |
| Remove members | Yes | No |

## Prerequisites

- **[Encore CLI](https://encore.dev/docs/ts/install)** installed
- **[Bun](https://bun.sh/)** (package manager)
- **[WorkOS](https://workos.com/)** account with:
  - Client ID
  - API Key
  - An organization created
  - Email/password authentication enabled
  - OAuth providers configured (Google and/or Microsoft)

## Create app

Create a new Encore application from this template:

```bash
encore app create --example=ts/mobile-starter
```

## Configure WorkOS Secrets

Set the required secrets for the auth service:

```bash
encore secret set WorkOSClientId --type dev,local,pr
# Enter your WorkOS Client ID

encore secret set WorkOSApiKey --type dev,local,pr
# Enter your WorkOS API Key
```

## WorkOS Configuration

In your [WorkOS Dashboard](https://dashboard.workos.com/):

1. **Authentication**: Enable "Email + Password" authentication method
2. **OAuth**: Configure Google and/or Microsoft OAuth providers
3. **Redirect URIs**: Add the following:
   - Web: `http://localhost:3001/auth/oauth/callback`
   - Native: `mobile-starter://auth/callback`
4. **Organizations**: Create at least one organization
5. **Roles**: Create `admin` and `member` roles in your organization settings

## Run the Backend

```bash
encore run
```

The Encore development dashboard is available at [http://localhost:9400](http://localhost:9400).

## Run the Web App

```bash
cd web
bun install
bun run dev
```

The web app runs at [http://localhost:3001](http://localhost:3001).

## Run the Native App

```bash
cd native
bun install
bun run dev
```

This starts the Expo development server. Use the Expo Go app or a simulator to run it.

## Generate API Clients

After modifying backend endpoints, regenerate the typed API clients:

```bash
# Install task runner (if not already installed)
# brew install go-task

# Generate for both web and native
task gen:api

# Or individually
task gen:api:web
task gen:api:native
```

## Project Structure

```
├── backend/               # Encore.ts backend
│   └── auth/              # Auth service (WorkOS)
│       ├── auth.ts        # JWT verification + gateway
│       ├── permissions.ts # Roles & permissions
│       ├── sign-in.ts     # Email/password login
│       ├── sign-up.ts     # Registration
│       ├── oauth.ts       # OAuth URL + callback
│       ├── invitations.ts # Invite/list/revoke members
│       └── ...            # refresh, verify-email, password-reset, session, sign-out
│
├── web/                   # Vite + React 19 + TanStack Router
│   └── src/
│       ├── features/auth/ # Auth provider, forms, OAuth buttons
│       ├── features/invitations/ # Invite form + list
│       ├── routes/        # TanStack file-based routes
│       └── lib/           # API client, permissions, utilities
│
└── native/                # Expo 54 + React Native
    ├── app/               # Expo Router (tabs: Dashboard, Members, Profile)
    ├── features/auth/     # SecureStore-based auth provider
    └── lib/               # API client, permissions, token utils
```

## Deployment

### Self-hosting

See the [Encore self-hosting docs](https://encore.dev/docs/ts/self-host/build) for how to build and deploy your application.

### Encore Cloud Platform

Deploy your application to a free staging environment on Encore's cloud:

```bash
git add -A .
git commit -m "Initial commit"
git push encore
```

Then head over to the [Encore Cloud Dashboard](https://app.encore.dev) to monitor your deployment.
