# Clerk + Encore Authentication Example

A production-ready authentication backend using [Clerk](https://clerk.com/) and [Encore.ts](https://encore.dev).

This example demonstrates:
- Clerk session verification and user management
- Protected API endpoints with type-safe auth data
- Auto-provisioned PostgreSQL database for user preferences
- Static frontend for testing authentication flow
- User profile management with database storage

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

**Clerk Account:**
1. Sign up at [clerk.com](https://clerk.com/)
2. Create a new application in the Clerk Dashboard
3. Copy your secret key from **API Keys**
4. Note your publishable key for the frontend

## Running locally

Clone and install dependencies:
```bash
git clone https://github.com/encoredev/examples
cd examples/ts/clerk-simple
npm install
```

Set your Clerk secret key:
```bash
encore secret set --dev ClerkSecretKey
```

Run the backend:
```bash
encore run
```

Open the frontend at `http://localhost:4000` to test the authentication flow.

**Note:** Replace `YOUR_PUBLISHABLE_KEY` in `frontend/assets/index.html` with your actual Clerk publishable key from the dashboard.

View the local development dashboard at [http://localhost:9400](http://localhost:9400) to explore:
- API documentation
- Distributed tracing
- Database explorer
- Service catalog

## API Endpoints

### `GET /user/profile` (Protected)
Get the current user's profile with preferences from the database.

Requires `Authorization: Bearer <clerk-session-token>` header.

### `POST /user/preferences` (Protected)
Update user preferences (theme, notifications, bio).

### `POST /webhooks/clerk`
Handle Clerk webhook events (user.created, user.updated, user.deleted).

## Deployment

Deploy to Encore Cloud:
```bash
git push encore
```

Set production secrets:
```bash
encore secret set --prod ClerkSecretKey
```

Configure Clerk webhooks in the dashboard to point to your deployed URL: `https://your-app.com/webhooks/clerk`

For production deployments to your own AWS/GCP account, see [connecting your cloud](https://encore.dev/docs/platform/infrastructure/infra).

## Learn More

- [Complete Tutorial](https://encore.dev/blog/clerk-encore) - Step-by-step guide
- [Encore Documentation](https://encore.dev/docs) - Framework features and concepts
- [Clerk Documentation](https://clerk.com/docs) - User management platform details
