# Resend Email Service

An email service using [Resend](https://resend.com/) and Encore. It supports sending transactional emails (welcome, password reset) with React Email templates, tracking delivery status via webhooks, and storing email history in PostgreSQL.

## Build from scratch with a tutorial

If you prefer, check out the [tutorial](https://encore.dev/blog/resend-tutorial) to learn how to build this application from scratch.

## Prerequisites

**Install Encore:**
- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

**Docker:**
1. Install [Docker](https://docker.com)
2. Start Docker

**Resend Account:**
- Sign up at [resend.com](https://resend.com/)
- Create an API key in the dashboard

## Create app

Create a local app from this template:

```bash
encore app create my-app-name --example=ts/resend
```

## Run app locally

Before running your application, make sure you have Docker installed and running. Then install dependencies and set your Resend API key:

```bash
npm install
```

```bash
encore secret set --dev ResendApiKey
```

Then start the app:

```bash
encore run
```

## Using the API

Send a welcome email:
```bash
curl -X POST 'http://localhost:4000/email/welcome' \
  -H 'Content-Type: application/json' \
  -d '{"to":"your-email@example.com","name":"Test User","loginUrl":"https://example.com/login"}'
```

Send a password reset email:
```bash
curl -X POST 'http://localhost:4000/email/password-reset' \
  -H 'Content-Type: application/json' \
  -d '{"to":"your-email@example.com","resetUrl":"https://example.com/reset?token=abc"}'
```

List sent emails:
```bash
curl 'http://localhost:4000/email/list'
```

**Note:** Replace `your-email@example.com` with the email you used to sign up for Resend, or any email on your verified domain.

## Local Development Dashboard

While `encore run` is running, open [http://localhost:9400/](http://localhost:9400/) to access Encore's [local developer dashboard](https://encore.dev/docs/ts/observability/dev-dash).

Here you can see traces for all requests, see your architecture diagram, and view API documentation in the Service Catalog.

## Connecting to databases

You can connect to your databases via psql shell:

```bash
encore db shell <database-name> --env=local --superuser
```

Learn more in the [CLI docs](https://encore.dev/docs/ts/cli/cli-reference#database-management).

## Webhook Configuration

Once deployed, set up webhooks to receive delivery status updates from Resend:

1. In your Resend dashboard, navigate to Webhooks
2. Add webhook URL: `https://staging-$APP_ID.encr.app/webhooks/resend`
3. Select events: `email.sent`, `email.delivered`, `email.bounced`, `email.complained`

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

Set your production secret:
```bash
encore secret set --prod ResendApiKey
```

You can also open your app in the [Cloud Dashboard](https://app.encore.dev) to integrate with GitHub, or connect your AWS/GCP account, enabling Encore to automatically handle cloud deployments for you.

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
