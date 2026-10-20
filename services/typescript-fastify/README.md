# {{name}}

A JSON REST API for todo items, built on [Fastify](https://fastify.dev) and stored in a
Postgres database, running on Bun. A starting point for a CRUD service in TypeScript:
replace the `todos` table and its routes in `index.ts` with your own resource.

## Routes

| Route | What it does |
| --- | --- |
| `GET /{{name}}/todos` | Lists every todo, oldest first. |
| `POST /{{name}}/todos` | Creates a todo from `{"title": "..."}` and answers `201` with it. |
| `GET /{{name}}/todos/:id` | Answers the todo, or `404` if there is none. |
| `PATCH /{{name}}/todos/:id` | Updates `{"title": "...", "done": true}`; leave out a field to keep it. |
| `DELETE /{{name}}/todos/:id` | Deletes the todo and answers `204`, or `404` if there is none. |

A todo looks like `{"id": 1, "title": "Buy milk", "done": false, "created_at": "2026-01-01T12:00:00.000Z"}`.

Request bodies and ids are checked by Fastify against the JSON schemas in `index.ts`: a
missing or blank title, a `done` that is not a boolean, or an id that is not a number is
answered with `400` and `{"error": "..."}`. Responses are serialized with a schema too.

## Database

The database is named `{{ident}}` and declared in `index.ts` with `@encore.dev/sdk`.
Encore provisions it and applies the migrations in `migrations/` when you run the app; no
setup is needed beyond having Docker running. Add a schema change as the next numbered
file, such as `migrations/2_add_due_date.up.sql`.

Queries are tagged templates (`` db.queryRow`... WHERE id = ${id}` ``): the values become
query parameters, never part of the SQL text.

## Try it locally

With `encore run` running, use the gateway's address that it prints in place of
`localhost:4000`:

```bash
curl -s localhost:4000/{{name}}/todos -d '{"title": "Buy milk"}' -H 'content-type: application/json'
# {"id":1,"title":"Buy milk","done":false,"created_at":"..."}

curl -s localhost:4000/{{name}}/todos
curl -s localhost:4000/{{name}}/todos/1
curl -s -X PATCH localhost:4000/{{name}}/todos/1 -d '{"done": true}' -H 'content-type: application/json'
curl -s -X DELETE localhost:4000/{{name}}/todos/1
```

`encore db shell --database {{ident}}` opens `psql` on the database. `bun run typecheck`
type-checks the service.
