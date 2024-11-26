# Event-Driven Architecture Starter

This is an event-driven microservices application using Pub/Sub for asynchronous communication between services.

The example in this starter is an Uptime Monitoring System that continuously monitors the uptime of a list of websites. 

When it detects a website is down, it posts a Slack message notifying that the website is down, and another message when the website is back up again.

It has a react frontend and you can try a demo version [here](https://uptime.encore.build/).

![Frontend](https://encore.dev/assets/tutorials/uptime/frontend.png)
![Architecture](https://encore.dev/assets/tutorials/uptime/encore-flow.png)


## Build from scratch with a tutorial

If you prefer, check out the [tutorial](https://encore.dev/docs/ts/tutorials/uptime) to learn how to build this application from scratch.

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
encore app create uptime-example --example=ts/uptime
```

## Run app locally

Before running your application, make sure you have Docker installed and running. Then run this command from your application's root folder:

```bash
encore run
```

To use the Slack integration, set the Slack Webhook URL (see tutorial above):
```bash
encore secret set --type local,dev,pr,prod SlackWebhookURL
```

**Note:** Cron Jobs do not execute when running locally.

## View the frontend

While `encore run` is running, head over to [http://localhost:4000/](http://localhost:4000/) to view the frontend for your uptime monitor.

## Using the API

Check if a given site is up (defaults to 'https://' if left out):
```bash
curl 'http://localhost:4000/ping/google.com'
```

Add a site to be automatically pinged every 1 hour:
```bash
curl 'http://localhost:4000/site' -d '{"url":"google.com"}'
```

Check all tracked sites immediately:
```bash
curl -X POST 'http://localhost:4000/check-all'
```

Get the current status of all tracked sites:
```bash
curl 'http://localhost:4000/status'
```

## Local Development Dashboard

While `encore run` is running, open [http://localhost:9400/](http://localhost:9400/) to access Encore's [local developer dashboard](https://encore.dev/docs/ts/observability/dev-dash).

Here you can see traces for all requests that you made while using the frontend, see your architecture diagram, and view API documentation in the Service Catalog.

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
