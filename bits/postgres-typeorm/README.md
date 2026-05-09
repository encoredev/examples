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

POST shorten any url

```bash
curl 'http://localhost:4000/url' -d '{"url":"https://google.com"}'
```

GET all urls in the database

```bash
curl 'http://localhost:4000/urls'
```

GET url by shortened id

```bash
curl 'http://localhost:4000/url/:id'
```

## Testing

```bash
encore  test
```
