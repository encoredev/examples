# Event-Driven Architecture Starter

This is an event-driven microservices application using Pub/Sub for asynchronous communication between services.

The example in this starter is an Uptime Monitoring System that continuously monitors the uptime of a list of websites. 

When it detects a website is down, it posts a Slack message notifying that the website is down, and another message when the website is back up again.

It has a react frontend and you can try a demo version [here](https://uptime.encore.build/).

![Frontend](https://encore.dev/assets/tutorials/uptime/frontend.png)
![Architecture](https://encore.dev/assets/tutorials/uptime/encore-flow.png)


## Build from scratch with a tutorial

If you prefer, check out the [tutorial](https://encore.dev/docs/tutorials/uptime) to learn how to build this application from scratch.

## Developing locally

When you have [installed Encore](https://encore.dev/docs/install), you can create a new Encore application and clone this example with this command.

```bash
encore app create my-app-name --example=uptime
```

## Running locally

Run your application:
```bash
encore run
```
To use the Slack integration, set the Slack Webhook URL (see tutorial above):
```bash
encore secret set SlackWebhookURL
```

Note that to avoid confusion, Cron Jobs do not execute when running locally.

## Local Development Dashboard

While `encore run` is running, open [http://localhost:9400/](http://localhost:9400/) to access Encore's [local developer dashboard](https://encore.dev/docs/observability/dev-dash).

Here you can see API docs, make requests in the API explorer, and view traces of the responses.

## View the frontend

While `encore run` is running, head over to [http://localhost:4000/frontend/](http://localhost:4000/frontend/) to view the frontend for your uptime monitor.

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
encore test ./...
```
