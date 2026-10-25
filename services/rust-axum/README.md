# {{name}}

A JSON REST API for todo items, built on [Axum](https://github.com/tokio-rs/axum) and
stored in a Postgres database. A starting point for a CRUD service in Rust: replace the
`todos` table and its handlers in `src/main.rs` with your own resource.

## Routes

| Route | What it does |
| --- | --- |
| `GET /{{name}}/todos` | Lists every todo, oldest first. |
| `POST /{{name}}/todos` | Creates a todo from `{"title": "..."}` and answers `201` with it. An empty title is a `400`. |
| `GET /{{name}}/todos/{id}` | Answers the todo, or `404` if there is none. |
| `PATCH /{{name}}/todos/{id}` | Updates `{"title": "...", "done": true}`; leave out a field to keep it. |
| `DELETE /{{name}}/todos/{id}` | Deletes the todo and answers `204`, or `404` if there is none. |

A todo looks like `{"id": 1, "title": "Buy milk", "done": false, "created_at": "2026-01-01T12:00:00.000000Z"}`.

## Database

The database is named `{{ident}}` and declared in `src/main.rs` with Encore's Rust SDK
(`encore-dev`, imported as `encore`). Encore provisions it and applies the migrations in
`src/migrations/` when you run the app; no setup is needed beyond having Docker running.
Add a schema change as the next numbered file, such as
`src/migrations/2_add_due_date.up.sql`.

Queries go through `DB.query`, `DB.query_opt`, `DB.execute` and the other methods of
`tokio_postgres::Client`, with parameters as `$1`, `$2`, ….

## Try it locally

With `encore run` running, call the service through the service proxy at
`localhost:4000/{{name}}`:

```bash
curl -s localhost:4000/{{name}}/todos -d '{"title": "Buy milk"}' -H 'content-type: application/json'
# {"id":1,"title":"Buy milk","done":false,"created_at":"..."}

curl -s localhost:4000/{{name}}/todos
curl -s localhost:4000/{{name}}/todos/1
curl -s -X PATCH localhost:4000/{{name}}/todos/1 -d '{"done": true}' -H 'content-type: application/json'
curl -s -X DELETE localhost:4000/{{name}}/todos/1
```

Axum's `Json` extractor needs the `content-type: application/json` header.

`encore db shell --database {{ident}}` opens `psql` on the database.
