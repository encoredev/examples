# Encore TS with Postgres + TypeORM

## Prerequisites

You should have an instance of Postgres database running.

## Running locally

```bash
npm install
encore  run
```

While `encore run` is running, open <http://localhost:9400/> to view Encore's [local developer dashboard](https://encore.dev/docs/observability/dev-dash).

## Using the API

To see that your app is running, you can ping the API to shorten a url.

Deploy your application to a staging environment in Encore's free development cloud:

```bash
curl 'http://localhost:4000/url' -d '{"URL":"https://news.ycombinator.com"}'
```

Get all apis in the database

```bash
curl 'http://localhost:4000/urls'
```

## Testing

```bash
encore  test
```
