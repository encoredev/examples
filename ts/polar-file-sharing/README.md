# File Sharing with Polar Payments

A WeTransfer-style file sharing service with user authentication and tiered subscriptions. Free users can upload files up to 100MB with 7-day retention. Premium subscribers ($10/month via [Polar](https://polar.sh)) get 5GB uploads and 30-day retention.

Built with [BetterAuth](https://better-auth.com) for authentication, [Polar](https://polar.sh) for subscription payments, and [Drizzle ORM](https://orm.drizzle.team) for database queries.

## Build from scratch with a tutorial

If you prefer, check out the [tutorial](https://encore.dev/blog/polar-tutorial) to learn how to build this application from scratch.

## Prerequisites

**Install Encore:**
- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

**Docker:**
1. Install [Docker](https://docker.com)
2. Start Docker

## Create app

Create a local app from this template:

```bash
encore app create my-app-name --example=ts/polar-file-sharing
```

## Run app locally

Before running your application, make sure you have Docker installed and running. Then install dependencies and set the required secrets:

```bash
npm install
```

```bash
# BetterAuth secret (use any random string, e.g. output of: openssl rand -base64 32)
encore secret set --dev BetterAuthSecret

# Polar API token (get from https://sandbox.polar.sh/settings)
encore secret set --dev PolarAccessToken
```

Then start the app:

```bash
encore run
```

Open the frontend at `http://localhost:4000`.

**Note:** The example uses Polar's sandbox environment for testing without real payments.

## Using the API

Create an account:
```bash
curl -X POST 'http://localhost:4000/auth/signup' \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"secret123","name":"Test User"}'
```

Upload a file (requires auth):
```bash
curl -X POST 'http://localhost:4000/upload' \
  -H 'Cookie: better-auth.session_token=YOUR_SESSION_TOKEN' \
  -F 'file=@./myfile.txt'
```

Check subscription status:
```bash
curl 'http://localhost:4000/subscriptions/me' \
  -H 'Cookie: better-auth.session_token=YOUR_SESSION_TOKEN'
```

Create a checkout session to upgrade:
```bash
curl -X POST 'http://localhost:4000/checkout' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: better-auth.session_token=YOUR_SESSION_TOKEN' \
  -d '{"productId":"YOUR_POLAR_PRODUCT_ID"}'
```

**Note:** Polar webhooks can't reach `localhost`, so subscriptions won't activate locally. Deploy to test the full flow (see below).

## Local Development Dashboard

While `encore run` is running, open [http://localhost:9400/](http://localhost:9400/) to access Encore's [local developer dashboard](https://encore.dev/docs/ts/observability/dev-dash).

Here you can see traces for all requests, see your architecture diagram, and view API documentation in the Service Catalog.

## Connecting to databases

You can connect to your databases via psql shell:

```bash
encore db shell <database-name> --env=local --superuser
```

Learn more in the [CLI docs](https://encore.dev/docs/ts/cli/cli-reference#database-management).

## Deployment

### Self-hosting

See the [self-hosting instructions](https://encore.dev/docs/ts/self-host/build) for how to use `encore build docker` to create a Docker image and configure it.

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
encore secret set --prod PolarAccessToken
```

You can also open your app in the [Cloud Dashboard](https://app.encore.dev) to integrate with GitHub, or connect your AWS/GCP account, enabling Encore to automatically handle cloud deployments for you.

### Configure Polar Webhooks

Once deployed, set up webhooks to enable automatic subscription activation:

1. Go to your Polar dashboard, navigate to Settings then Webhooks
2. Add webhook URL: `https://staging-$APP_ID.encr.app/webhooks/polar`
3. Select events: `subscription.created`, `subscription.updated`, `customer.created`

## Link to GitHub

Follow these steps to link your app to GitHub:

1. Create a GitHub repo, commit and push the app.
2. Open your app in the [Cloud Dashboard](https://app.encore.dev).
3. Go to **Settings ➔ GitHub** and click on **Link app to GitHub** to link your app to GitHub and select the repo you just created.
4. To configure Encore to automatically trigger deploys when you push to a specific branch name, go to the **Overview** page for your intended environment. Click on **Settings** and then in the section **Branch Push** configure the **Branch name** and hit **Save**.
5. Commit and push a change to GitHub to trigger a deploy.

[Learn more in the docs](https://encore.dev/docs/platform/integrations/github)

## Testing

To run tests, configure the `test` command in your `package.json` to the test runner of your choice, and then use the command `encore test` from the CLI. The `encore test` command sets up all the necessary infrastructure in test mode before handing over to the test runner. [Learn more](https://encore.dev/docs/ts/develop/testing)

```bash
encore test
```
