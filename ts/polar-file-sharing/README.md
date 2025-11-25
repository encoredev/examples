# File Sharing Service with Polar

A WeTransfer-style file sharing service with authentication and tiered subscriptions using [Polar](https://polar.sh) and [BetterAuth](https://better-auth.com).

## Build from scratch with a tutorial

If you prefer, check out the [full tutorial](https://encore.dev/blog/polar-tutorial) to learn how to build this application from scratch.

## Features

**Authentication:**
- Email/password signup and login
- Secure session management with BetterAuth
- Protected API endpoints

**Free Tier:**
- Upload files up to 100MB
- Files stored for 7 days
- Generate shareable download links

**Premium Tier ($10/month):**
- Upload files up to 5GB
- Files stored for 30 days

## Architecture

- **Auth Service** - User authentication with BetterAuth
- **Files Service** - File upload/download with object storage
- **Payments Service** - Polar subscription management and webhooks
- **Frontend Service** - Static HTML/JS frontend

## Prerequisites

**Install Encore:**
- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

**Docker:**
- Install [Docker](https://docker.com)
- Start Docker

## Running locally

1. Install dependencies:
```bash
npm install
```

2. Set the BetterAuth secret:
```bash
encore secret set --dev BetterAuthSecret
```
When prompted, enter a random string (e.g., output of: `openssl rand -base64 32`)

3. Start the backend (make sure Docker is running):
```bash
encore run
```

4. Open the frontend at `http://localhost:4000`

**Note:** The example uses Polar's **sandbox environment** for testing without real payments.

## Local Testing

### 1. Create an account

1. Open `http://localhost:4000`
2. Click "Don't have an account? Sign up"
3. Enter your details and create an account
4. You'll be automatically signed in

### 2. Upload a free file

1. Select a file under 100MB
2. Click "Upload File"
3. You'll see the download link and expiration date (7 days)

### 3. Test the premium upgrade flow

1. Click "Upgrade Now" button
2. You'll be redirected to Polar's sandbox checkout
3. Complete the checkout (use test card info)
4. **Important:** After checkout, webhooks won't work locally

**Local limitation:** Polar webhooks can't reach `localhost`, so your subscription won't activate automatically. See "Deployment" below for full webhook testing.

## Local Development Dashboard

Open `http://localhost:9400` to access Encore's local development dashboard with:

- API Explorer with interactive documentation
- Service architecture diagram
- Distributed tracing for all requests
- Database explorer

## Deployment

### Self-hosting

See the [self-hosting instructions](https://encore.dev/docs/how-to/self-host) for how to use `encore build docker` to create a Docker image and configure it.

### Encore Cloud Platform

Deploy your application to a free staging environment in Encore's development cloud using `git push encore`:

```bash
git add -A .
git commit -m 'Commit message'
git push encore
```

Set your production secrets:
```bash
encore secret set --prod BetterAuthSecret
# For production Polar, also set:
# encore secret set --prod PolarAccessToken
```

You can also open your app in the [Cloud Dashboard](https://app.encore.cloud) to integrate with GitHub, or connect your AWS/GCP account, enabling Encore to automatically handle cloud deployments for you.

### Configure Polar Webhooks

To enable automatic subscription activation:

1. Go to https://sandbox.polar.sh/dashboard → Settings → Webhooks
2. Add webhook URL: `https://[your-app].encr.app/webhooks/polar`
3. Select events: `subscription.created`, `subscription.updated`, `customer.created`

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new account
- `POST /auth/signin` - Sign in
- `POST /auth/signout` - Sign out

### Files
- `POST /upload` - Upload file (requires auth)
- `GET /download/:fileId` - Download file

### Payments
- `GET /subscriptions/me` - Check subscription status (requires auth)
- `POST /checkout` - Create Polar checkout session (requires auth)
- `POST /webhooks/polar` - Polar webhook handler

## Tech Stack

- **[Encore.ts](https://encore.dev)** - Backend framework with Infrastructure from Code
- **[BetterAuth](https://better-auth.com)** - TypeScript authentication framework
- **[Polar](https://polar.sh)** - Merchant of record for subscriptions
- **[Drizzle ORM](https://orm.drizzle.team)** - Type-safe database queries
- **PostgreSQL** - Database (automatically provisioned by Encore)
- **Object Storage** - File storage (S3/GCS, automatically provisioned by Encore)

## Project Structure

```
├── auth/                  # Authentication service
│   ├── auth.ts           # Signup/signin/signout endpoints
│   ├── handler.ts        # Auth handler for protected endpoints
│   ├── better-auth.ts    # BetterAuth configuration
│   └── migrations/       # Database schema for auth tables
├── files/                # File management service
│   ├── upload.ts        # File upload endpoint
│   ├── download.ts      # File download endpoint
│   └── bucket.ts        # Object storage bucket
├── payments/            # Payments service
│   ├── checkout.ts     # Create Polar checkout sessions
│   ├── webhooks.ts     # Handle Polar webhooks
│   └── subscriptions.ts # Check subscription status
└── frontend/           # Static frontend
    └── assets/
        └── index.html  # Single-page app
```

## Learn More

- [Encore.ts Documentation](https://encore.dev/docs/ts)
- [BetterAuth Documentation](https://better-auth.com/docs)
- [Polar Documentation](https://polar.sh/docs)
- [Tutorial Article](https://encore.dev/blog/polar-tutorial) - Full step-by-step guide

## License

MIT
