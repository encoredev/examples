# {{name}}

An uptime monitor. It keeps a list of websites in Postgres, checks whether each
one is up, and posts to Slack when a site goes down or comes back up.

- A cron job checks every site once an hour.
- Each check is recorded. When a site's status differs from its previous
  check, an event is published to the `{{kebab}}-transition` Pub/Sub topic.
- The `slack-notification` subscription posts the event to a Slack incoming
  webhook. Without the webhook secret it logs the message instead, so the
  service runs without Slack.

It runs on Bun with no web framework: `encore run` starts it with `bun run start`.

A site counts as up when a `GET` for it answers within 10 seconds with a
2xx status. A URL without a scheme is checked over `https://`. At most
20 sites can be monitored.

## Routes

```sh
# Monitor a site. It is checked right away.
curl -X POST localhost:4000/{{name}}/sites -d '{"url": "encore.dev"}'

# List, get and delete sites.
curl localhost:4000/{{name}}/sites
curl localhost:4000/{{name}}/sites/1
curl -X DELETE localhost:4000/{{name}}/sites/1

# Check one site now, or all of them (what the cron job does).
curl -X POST localhost:4000/{{name}}/sites/1/check
curl -X POST localhost:4000/{{name}}/check-all

# Each site's most recent check.
curl localhost:4000/{{name}}/status

# Check any URL once, without recording it.
curl localhost:4000/{{name}}/ping/encore.dev
```

## Slack

Create an [incoming webhook](https://api.slack.com/messaging/webhooks) and set
its URL as this service's `SlackWebhookURL` secret. `encore secret set` reads
the value from stdin and sets it for local development on this machine:

```sh
encore secret set --service {{name}} SlackWebhookURL
```

## Cron

Cron jobs don't run locally: `POST /{{name}}/check-all` to run the check
yourself. The job (`{{kebab}}-check-all` in `check.ts`) requests that path: if you
change its `path`, change the route in `index.ts` to match.
