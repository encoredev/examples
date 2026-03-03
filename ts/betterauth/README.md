# Better Auth + Encore Starter

Production-ready authentication with [Better Auth](https://www.better-auth.com) and [Encore](https://encore.dev). Encore provisions the database and manages secrets. Better Auth handles users, sessions, and OAuth.

## What's included

- **Database** provisioned automatically by Encore (PostgreSQL)
- **Better Auth** configured with email/password login
- **Auth routes** exposed at `/auth/*` via a raw endpoint
- **Auth handler** that validates sessions for protected endpoints
- **Protected endpoint** at `/profile` that requires authentication
- **Frontend** at `/site` with a sign-in/sign-up form

## Get started

1. Install Encore if you haven't already:
   ```bash
   curl -L https://encore.dev/install.sh | bash
   ```

2. Create a new app from this example:
   ```bash
   encore app create --example=ts/betterauth
   ```

3. Set your auth secret (generate one with `openssl rand -base64 32`):
   ```bash
   encore secret set --type dev,local,pr,production AuthSecret
   ```

4. Make sure [Docker](https://docker.com/get-started) is running (Encore uses it for the local database).

5. Run the app:
   ```bash
   encore run
   ```

6. Open http://localhost:4000/site to sign up and sign in.

## Adding OAuth providers

To enable GitHub login:

1. Create an OAuth app at [GitHub Developer Settings](https://github.com/settings/developers). Set the callback URL to `http://localhost:4000/auth/callback/github`.
2. Uncomment the `socialProviders` section in `auth/auth.ts`.
3. Set the secrets:
   ```bash
   encore secret set --type local GithubClientId
   encore secret set --type local GithubClientSecret
   ```

Better Auth supports [20+ OAuth providers](https://www.better-auth.com/docs/concepts/oauth) — Google, Discord, Apple, and more.

## Learn more

- [Better Auth + Encore integration guide](https://encore.dev/docs/ts/develop/integrations/better-auth)
- [Better Auth documentation](https://www.better-auth.com/docs)
- [Encore databases docs](https://encore.dev/docs/ts/primitives/databases)
- [Encore auth docs](https://encore.dev/docs/ts/develop/auth)
