# {{name}}

A [Next.js](https://nextjs.org) guestbook hosted by an Encore service. Its pages render on the
server and read straight from the service's own Postgres database: a Server Component lists
the entries, a Server Action signs the guestbook, and a route handler serves the entries as
JSON.

## How it is reached

The service hosts a frontend (the `frontend` section in `encore.service.json`), so Encore runs
`next dev` itself and gives it a port of its own that stays the same between runs. The app is
served at the root of that origin, not under `/{{name}}` on the gateway. `encore run` prints it:

```
frontend {{name}} running at http://127.0.0.1:63861
```

| Route | What it does |
| --- | --- |
| `GET /` | The guestbook page, with a form to sign it. |
| `GET /api/entries` | The newest 50 entries as JSON, newest first: `{"entries": [{"id": 1, "name": "...", "message": "...", "createdAt": "..."}]}`. |
| `POST /api/entries` | Adds `{"name": "...", "message": "..."}` and answers `201` with the entry, or `400`. |

With the address it printed in place of `127.0.0.1:63861`:

```bash
curl -s 127.0.0.1:63861/api/entries -d '{"name": "Ada", "message": "Hello!"}'
curl -s 127.0.0.1:63861/api/entries
```

## Database

The database is named `{{ident}}` and declared in `db.ts`. Encore provisions it and applies the
migrations in `migrations/` when you run the app; no setup is needed beyond having Docker
running. Add a schema change as the next numbered file, such as
`migrations/2_add_email.up.sql`.

Being a service, this app can use anything else from `@encore.dev/sdk` on the server too:
secrets, Pub/Sub, object storage. Keep those imports out of `"use client"` modules.

## Building

`next build` loads every route to read its configuration, and nothing Encore runs is there to
give it a database. So `db.ts` isn't imported at the top of the pages and routes that use it,
but where they need it, with `await import("@/db")`. Do the same for other modules that declare
Encore resources.

## Calling other services

`frontend.gateways` lists the gateway `api`, so the server gets its base URL in
`ENCORE_GATEWAY_API_URL` (and `NEXT_PUBLIC_ENCORE_GATEWAY_API_URL` for code in the browser).
To call another service's API through it, for example:

```ts
const res = await fetch(`${process.env.ENCORE_GATEWAY_API_URL}/other-service/items`);
```
