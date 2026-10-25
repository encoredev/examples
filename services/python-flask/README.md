# {{name}}

A REST API for notes, built on [Flask](https://flask.palletsprojects.com/). Notes are kept in a
Postgres database that Encore provisions. The views are `async def`, so they await the Encore
SDK directly, and errors are answered as JSON.

## Routes

| Route | What it does |
| --- | --- |
| `GET /{{name}}/notes` | Lists every note: `{"notes": [{"id": 1, "title": "...", "body": "...", "created_at": "..."}, ...]}`. |
| `POST /{{name}}/notes` | Creates a note from `{"title": "...", "body": "..."}` (`body` is optional) and answers `201` with it. A missing, empty or over 200-character title answers `400` with `{"detail": "..."}`. |
| `GET /{{name}}/notes/{id}` | Answers the note, or `404`. |
| `PATCH /{{name}}/notes/{id}` | Updates `title` and/or `body`; a field left out keeps its value. |
| `DELETE /{{name}}/notes/{id}` | Deletes the note and answers `204`, or `404`. |

Send request bodies with `Content-Type: application/json`.

## Running it

You need [uv](https://docs.astral.sh/uv/). `encore run` starts the service with `uv run main.py`,
which installs the dependencies on first run and writes a `uv.lock`; commit it, since Encore's
builds install from it.

`main.py` serves the app with `encore.run`, on Encore's own HTTP server, where Encore assigns the
service. Flask is a WSGI app, so [a2wsgi](https://github.com/abersheeran/a2wsgi) adapts it,
running the views on a thread pool in one process (the Encore runtime does not support forked
workers, as Gunicorn's are). Each request gets a trace, and the service shuts down gracefully:
on stop, the requests in flight finish first.

## Database

The database is named `{{ident}}` and declared in `main.py`. Encore provisions it and applies
the migrations in `migrations/` when you run the app. Add a schema change as the next numbered
file, such as `migrations/2_add_tags.up.sql`.

## Try it locally

With `encore run` running, call the service through the service proxy at
`localhost:4000/{{name}}`:

```bash
curl -s localhost:4000/{{name}}/notes -H 'Content-Type: application/json' \
  -d '{"title": "Hello", "body": "From Flask"}'
# {"body":"From Flask","created_at":"...","id":1,"title":"Hello"}

curl -s localhost:4000/{{name}}/notes/1
curl -s -X PATCH localhost:4000/{{name}}/notes/1 -H 'Content-Type: application/json' \
  -d '{"body": "Edited"}'
curl -s localhost:4000/{{name}}/notes
curl -s -X DELETE localhost:4000/{{name}}/notes/1
```
