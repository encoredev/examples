# {{name}}

A Django project serving a JSON API for notes, built on the Django ORM, with the Django admin
for browsing them. Encore provisions the Postgres database; Django's own migrations manage its
schema.

## Routes

| Route | What it does |
| --- | --- |
| `GET /{{name}}/notes` | Lists every note: `{"notes": [{"id": 1, "title": "...", "body": "...", "created_at": "..."}, ...]}`. |
| `POST /{{name}}/notes` | Creates a note from `{"title": "...", "body": "..."}` (`body` is optional) and answers `201` with it. A missing or too long title answers `400` with Django's form errors. |
| `GET /{{name}}/notes/{id}` | Answers the note, or `404`. |
| `PATCH /{{name}}/notes/{id}` | Updates `title` and/or `body`; a field left out keeps its value. |
| `DELETE /{{name}}/notes/{id}` | Deletes the note and answers `204`, or `404`. |
| `/{{name}}/admin/` | The Django admin. |

## Running it

You need [uv](https://docs.astral.sh/uv/). `encore run` starts the service with `uv run main.py`,
which installs the dependencies on first run and writes a `uv.lock`; commit it, since Encore's
builds install from it. `.python-version` asks for Python 3.14 with the GIL (`3.14+gil`), since
psycopg's binary package has no build for free-threaded Python.

`main.py` applies Django's migrations (`manage.py migrate`) and then serves the project's ASGI
application with `encore.run`, on Encore's own HTTP server, where Encore assigns the service.
Each request gets a trace, and the service shuts down gracefully: on stop, the requests in
flight finish first.

Run other management commands through `encore exec`, so Django gets the database's connection
settings:

```bash
encore exec -- uv run python manage.py createsuperuser   # to sign in to the admin
encore exec -- uv run python manage.py makemigrations    # after changing notes/models.py
```

## Database

The database is named `{{ident}}` and declared in `notes/resources.py`. `config/settings.py`
gives its connection string to Django's standard PostgreSQL backend (psycopg), so the ORM, the
admin, auth and sessions all use it. It has no Encore migrations directory: the schema is
Django's, in each app's `migrations/`.

## Secrets

`config/settings.py` reads Django's `SECRET_KEY` from the Encore secret `DjangoSecretKey`. Locally
a fixed development key stands in until you set it; elsewhere it must be set. The command
reads the value from stdin and sets it for this machine:

```bash
python3 -c 'import secrets; print(secrets.token_urlsafe(50))' | encore secret set --service {{name}} DjangoSecretKey
```

`DEBUG` is on only when running locally. The admin's CSRF check trusts the local gateway's
address, `http://localhost:4000`; if you run on another port (`encore run --port`), add it to
`CSRF_TRUSTED_ORIGINS` in `config/settings.py`.

## Try it locally

With `encore run` running, use the gateway's address that it prints in place of
`localhost:4000`:

```bash
curl -s localhost:4000/{{name}}/notes -H 'Content-Type: application/json' \
  -d '{"title": "Hello", "body": "From Django"}'
# {"id": 1, "title": "Hello", "body": "From Django", "created_at": "..."}

curl -s localhost:4000/{{name}}/notes/1
curl -s -X PATCH localhost:4000/{{name}}/notes/1 -H 'Content-Type: application/json' \
  -d '{"body": "Edited"}'
curl -s localhost:4000/{{name}}/notes
curl -s -X DELETE localhost:4000/{{name}}/notes/1
```

The JSON API has no cookie-based authentication, so it is exempt from CSRF checks; the admin
keeps them.

## Layout

- `config/` — settings, URLs (everything under `/{{name}}/`), ASGI/WSGI entrypoints.
- `notes/` — the Django app: model, form, views, admin, migrations, and `resources.py` with the
  database declaration.
- `main.py` — migrates, then serves `config.asgi` with `encore.run`. When debugging it also
  serves the static files, as `runserver` would. Don't serve the project with forked workers
  (Gunicorn's): the Encore runtime does not support them.
