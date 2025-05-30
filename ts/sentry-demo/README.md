# Sentry Demo Setup

## Developing locally

When you have [installed Encore](https://encore.dev/docs/ts/install), you can create a new Encore application and clone this example with this command.

```bash
encore app create my-app-name --example=ts/sentry-demo
```

## Setting up Sentry

To integrate Sentry with your Encore application, you need to set up the Sentry DSN secret:

```bash
encore secret set --type dev SENTRY_DSN="https://abc123.ingest.sentry.io/987654"
```

## Running locally
Before running your application locally, ensure you’re authenticated with the Encore CLI:
```bash
# Check your current authentication status
encore auth whoami

# If you are not logged in, authenticate:
encore auth login
```

Now, start your application:
```bash
encore run
```

While `encore run` is running, open <http://localhost:9400/> to view Encore's [local developer dashboard](https://encore.dev/docs/ts/observability/dev-dash).

## Deployment

Deploy your application to a staging environment in Encore's free development cloud:

```bash
git add -A .
git commit -m 'Commit message'
git push encore
```

Then head over to the [Cloud Dashboard](https://app.encore.dev) to monitor your deployment and find your production URL.

From there you can also connect your own AWS or GCP account to use for deployment.

Now off you go into the clouds!

## Testing

```bash
encore test
```
