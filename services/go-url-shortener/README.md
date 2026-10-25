# {{name}}

A URL shortener. It gives each URL you send it a random 8-character id and stores both in a
Postgres database, so you can look the URL up again by its id.

## Routes

| Route | What it does |
| --- | --- |
| `POST /{{name}}/url` | Shortens `{"url": "https://..."}` and answers `201` with `{"id": "...", "url": "..."}`. The URL must be an absolute `http` or `https` URL, else `400`. |
| `GET /{{name}}/url/{id}` | Answers `{"id": "...", "url": "..."}` for the id, or `404` if there is none. |
| `GET /{{name}}/url` | Lists every shortened URL: `{"urls": [{"id": "...", "url": "..."}, ...]}`. |

## Database

The database is named `{{ident}}` and declared in `main.go`. Encore provisions it and applies
the migrations in `migrations/` when you run the app, so there is nothing to set up.
Add a schema change as the next numbered file, such as `migrations/2_add_created_at.up.sql`.

## Try it locally

With `encore run` running, call the service through the service proxy at
`localhost:4000/{{name}}`:

```bash
curl -s localhost:4000/{{name}}/url -d '{"url": "https://encore.dev"}'
# {"id":"m1qJ8Fmv","url":"https://encore.dev"}

curl -s localhost:4000/{{name}}/url/m1qJ8Fmv
curl -s localhost:4000/{{name}}/url
```
