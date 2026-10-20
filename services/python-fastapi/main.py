"""A notes REST API on FastAPI, stored in an Encore-provisioned Postgres database.

GET    /{{name}}/notes       list every note
POST   /{{name}}/notes       create one from {"title": "...", "body": "..."}
GET    /{{name}}/notes/{id}  get one
PATCH  /{{name}}/notes/{id}  update {"title": "...", "body": "..."}, either field optional
DELETE /{{name}}/notes/{id}  delete one
"""

import logging
import os
from datetime import datetime

import uvicorn
from encore.logs import ConsoleHandler
from encore.storage import postgres
from fastapi import APIRouter, FastAPI, HTTPException, Response
from pydantic import BaseModel, Field

SERVICE = "{{name}}"

# Encore finds this declaration, provisions the database and applies the
# migrations in ./migrations before the service starts.
db = postgres.Database("{{ident}}", migrations="./migrations")

# Print `logging` records in Encore's log format, with the current trace ids.
logging.basicConfig(level=logging.INFO, handlers=[ConsoleHandler()])
logger = logging.getLogger(__name__)


class NoteIn(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    body: str = ""


class NoteUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    body: str | None = None


class Note(BaseModel):
    id: int
    title: str
    body: str
    created_at: datetime


class NoteList(BaseModel):
    notes: list[Note]


COLUMNS = "id, title, body, created_at"

# The service receives the full path, its /{{name}} prefix included.
router = APIRouter(prefix=f"/{SERVICE}", tags=["notes"])


@router.get("/notes")
async def list_notes() -> NoteList:
    rows = await db.read().query(f"SELECT {COLUMNS} FROM note ORDER BY id").all()
    return NoteList(notes=[Note(**row) for row in rows])


@router.post("/notes", status_code=201)
async def create_note(note: NoteIn) -> Note:
    row = await db.query(
        f"INSERT INTO note (title, body) VALUES ($1, $2) RETURNING {COLUMNS}",
        note.title,
        note.body,
    ).one()
    logger.info("created note", extra={"note_id": row["id"]})
    return Note(**row)


@router.get("/notes/{note_id}")
async def get_note(note_id: int) -> Note:
    row = (
        await db.read()
        .query(f"SELECT {COLUMNS} FROM note WHERE id = $1", note_id)
        .one()
    )
    if row is None:
        raise HTTPException(status_code=404, detail="note not found")
    return Note(**row)


@router.patch("/notes/{note_id}")
async def update_note(note_id: int, update: NoteUpdate) -> Note:
    # A field left out (or null) keeps its current value.
    row = await db.query(
        f"""UPDATE note SET title = COALESCE($2, title), body = COALESCE($3, body)
            WHERE id = $1 RETURNING {COLUMNS}""",
        note_id,
        update.title,
        update.body,
    ).one()
    if row is None:
        raise HTTPException(status_code=404, detail="note not found")
    return Note(**row)


@router.delete("/notes/{note_id}", status_code=204)
async def delete_note(note_id: int) -> Response:
    result = await db.exec("DELETE FROM note WHERE id = $1", note_id)
    if result.rows_affected == 0:
        raise HTTPException(status_code=404, detail="note not found")
    return Response(status_code=204)


# Keep the interactive docs under the service's prefix, where the gateway
# routes requests: /{{name}}/docs.
app = FastAPI(
    title=SERVICE,
    docs_url=f"/{SERVICE}/docs",
    redoc_url=None,
    openapi_url=f"/{SERVICE}/openapi.json",
)
app.include_router(router)


def listen_addr() -> tuple[str, int]:
    """Encore's local run supplies ENCORE_LISTEN_ADDR as host:port. Run on its
    own, this falls back to PORT and then to 8080."""
    addr = os.environ.get("ENCORE_LISTEN_ADDR")
    if addr:
        host, _, port = addr.rpartition(":")
        return host or "0.0.0.0", int(port)
    return "0.0.0.0", int(os.environ.get("PORT", "8080"))


if __name__ == "__main__":
    host, port = listen_addr()
    uvicorn.run(app, host=host, port=port)
