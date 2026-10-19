# {{name}}

A REST API for notes, built on [FastAPI](https://fastapi.tiangolo.com/). Notes are kept in a
Postgres database that Encore provisions; requests and responses are validated with Pydantic.

## Routes

| Route | What it does |
| --- | --- |
| `GET /{{name}}/notes` | Lists every note: `{"notes": [{"id": 1, "title": "...", "body": "...", "created_at": "..."}, ...]}`. |
| `POST /{{name}}/notes` | Creates a note from `{"title": "...", "body": "..."}` (`body` is optional) and answers `201` with it. A missing, empty or over 200-character title answers `422`. |
| `GET /{{name}}/notes/{id}` | Answers the note, or `404`. |
| `PATCH /{{name}}/notes/{id}` | Updates `title` and/or `body`; a field left out keeps its value. |
| `DELETE /{{name}}/notes/{id}` | Deletes the note and answers `204`, or `404`. |
| `GET /{{name}}/docs` | FastAPI's interactive API docs (OpenAPI at `/{{name}}/openapi.json`). |

## Running it

You need [uv](https://docs.astral.sh/uv/) and Docker. `encore run` starts the service with
`uv run main.py`, which installs the dependencies on first run and writes a `uv.lock`; commit it,
since Encore's builds install from it. `main.py` serves the app with Uvicorn on the address
Encore gives it.

## Database

The database is named `{{ident}}` and declared in `main.py`. Encore provisions it and applies
the migrations in `migrations/` when you run the app. Add a schema change as the next numbered
file, such as `migrations/2_add_tags.up.sql`.

## Try it locally

With `encore run` running, use the gateway's address that it prints in place of
`localhost:4000`:

```bash
curl -s localhost:4000/{{name}}/notes -H 'Content-Type: application/json' \
  -d '{"title": "Hello", "body": "From FastAPI"}'
# {"id":1,"title":"Hello","body":"From FastAPI","created_at":"..."}

curl -s localhost:4000/{{name}}/notes/1
curl -s -X PATCH localhost:4000/{{name}}/notes/1 -H 'Content-Type: application/json' \
  -d '{"body": "Edited"}'
curl -s localhost:4000/{{name}}/notes
curl -s -X DELETE localhost:4000/{{name}}/notes/1
```

Or open `http://localhost:4000/{{name}}/docs` to try the routes in the browser.
