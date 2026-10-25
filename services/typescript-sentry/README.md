# {{name}}

Error tracking with [Sentry](https://sentry.io). An error thrown by one of the service's routes
is reported to Sentry, with the request it happened in and an `encore_trace_id` tag that finds
the request's trace in Encore, and answered with a `500` that carries the Sentry event id:

```json
{"error": "internal error", "eventId": "fbce43e4610448f7aa0528001a26b499"}
```

Sentry is used for errors only (`tracesSampleRate: 0`), since Encore traces every request
already. Wrap a new route with `withSentry` in `index.ts` to have its errors reported the same
way.

## Routes

| Route | What it does |
| --- | --- |
| `GET /{{name}}/users` | A page of sample users. Query parameters: `page` (from 1), `limit` (default 10) and `department`. |
| `POST /{{name}}/trigger-error` | Throws an error, to see it arrive in Sentry. The body picks it: `{"errorType": "validation" \| "database" \| "permission" \| "timeout" \| "notfound" \| "generic"}`, `generic` when left out. |

```bash
curl 'localhost:4000/{{name}}/users?page=1&limit=2'

curl localhost:4000/{{name}}/trigger-error -d '{"errorType": "database"}'
```

## Secrets

| Secret | Value |
| --- | --- |
| `SentryDsn` | Your Sentry project's DSN: **Project Settings → Client Keys (DSN)**, like `https://<key>@o0.ingest.sentry.io/0`. |

`encore secret set` reads the value from stdin and stores it for this machine:

```bash
encore secret set --service {{name}} SentryDsn
```

Until it is set, Sentry is disabled: the service logs a warning at startup, and errors are only
logged. The DSN is read when the service starts, so restart it after setting the secret.
