"""A notes REST API on Flask, stored in an Encore-provisioned Postgres database.

GET    /{{name}}/notes       list every note
POST   /{{name}}/notes       create one from {"title": "...", "body": "..."}
GET    /{{name}}/notes/<id>  get one
PATCH  /{{name}}/notes/<id>  update {"title": "...", "body": "..."}, either field optional
DELETE /{{name}}/notes/<id>  delete one
"""

import logging

import encore
from a2wsgi import WSGIMiddleware
from encore.logs import ConsoleHandler
from encore.storage import postgres
from flask import Blueprint, Flask, abort, jsonify, request
from werkzeug.exceptions import HTTPException

SERVICE = "{{name}}"

# Encore finds this declaration, provisions the database and applies the
# migrations in ./migrations before the service starts.
db = postgres.Database("{{ident}}", migrations="./migrations")

# Print `logging` records in Encore's log format, with the current trace ids.
logging.basicConfig(level=logging.INFO, handlers=[ConsoleHandler()])
logger = logging.getLogger(__name__)

# Rows are dicts of these columns; the SDK gives timestamps as ISO 8601
# strings, so a row is ready to answer as JSON.
COLUMNS = "id, title, body, created_at"

# The service receives the full path, its /{{name}} prefix included.
notes = Blueprint("notes", __name__, url_prefix=f"/{SERVICE}")


def note_fields(partial: bool) -> tuple[str | None, str | None]:
    """The title and body of the request's JSON object, answering 400 when
    they are invalid. With `partial`, either may be left out."""
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        abort(400, "expected a JSON object")
    title, body = data.get("title"), data.get("body")
    if title is None and not partial:
        abort(400, "title is required")
    if title is not None and (not isinstance(title, str) or not 1 <= len(title) <= 200):
        abort(400, "title must be a string of 1 to 200 characters")
    if body is not None and not isinstance(body, str):
        abort(400, "body must be a string")
    return title, body


# Flask runs `async def` views on an event loop of their own, so they can
# await the Encore SDK directly.
@notes.get("/notes")
async def list_notes():
    rows = await db.read().query(f"SELECT {COLUMNS} FROM note ORDER BY id").all()
    return {"notes": rows}


@notes.post("/notes")
async def create_note():
    title, body = note_fields(partial=False)
    row = await db.query(
        f"INSERT INTO note (title, body) VALUES ($1, $2) RETURNING {COLUMNS}",
        title,
        body or "",
    ).one()
    logger.info("created note", extra={"note_id": row["id"]})
    return row, 201


@notes.get("/notes/<int:note_id>")
async def get_note(note_id: int):
    row = (
        await db.read()
        .query(f"SELECT {COLUMNS} FROM note WHERE id = $1", note_id)
        .first()
    )
    if row is None:
        abort(404, "note not found")
    return row


@notes.patch("/notes/<int:note_id>")
async def update_note(note_id: int):
    title, body = note_fields(partial=True)
    # A field left out keeps its current value.
    row = await db.query(
        f"""UPDATE note SET title = COALESCE($2, title), body = COALESCE($3, body)
            WHERE id = $1 RETURNING {COLUMNS}""",
        note_id,
        title,
        body,
    ).first()
    if row is None:
        abort(404, "note not found")
    return row


@notes.delete("/notes/<int:note_id>")
async def delete_note(note_id: int):
    result = await db.exec("DELETE FROM note WHERE id = $1", note_id)
    if result.rows_affected == 0:
        abort(404, "note not found")
    return "", 204


app = Flask(__name__)
app.register_blueprint(notes)


@app.errorhandler(HTTPException)
def json_error(error: HTTPException):
    """Answer errors as JSON rather than Flask's HTML pages."""
    return jsonify(detail=error.description), error.code


if __name__ == "__main__":
    # Serve the app where Encore assigns the service, on Encore's HTTP server:
    # each request is traced, and the service shuts down gracefully with Encore.
    # Flask is a WSGI app, so a2wsgi adapts it to ASGI, running the views on a
    # thread pool in this one process; the Encore runtime does not support
    # forked workers.
    encore.run(WSGIMiddleware(app))
