"""A JSON notes API on the Django ORM.

GET    /{{name}}/notes       list every note
POST   /{{name}}/notes       create one from {"title": "...", "body": "..."}
GET    /{{name}}/notes/{id}  get one
PATCH  /{{name}}/notes/{id}  update {"title": "...", "body": "..."}, either field optional
DELETE /{{name}}/notes/{id}  delete one
"""

import json
import logging

from django.http import HttpRequest, HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .forms import NoteForm
from .models import Note

logger = logging.getLogger(__name__)


def json_body(request: HttpRequest) -> dict | None:
    try:
        data = json.loads(request.body or b"{}")
    except ValueError:
        return None
    return data if isinstance(data, dict) else None


def invalid(form: NoteForm) -> JsonResponse:
    return JsonResponse({"errors": form.errors.get_json_data()}, status=400)


# This JSON API has no cookie-based authentication, so it is exempt from
# Django's CSRF checks; the admin keeps them.
@csrf_exempt
@require_http_methods(["GET", "POST"])
def notes(request: HttpRequest) -> JsonResponse:
    if request.method == "GET":
        return JsonResponse({"notes": [n.as_dict() for n in Note.objects.all()]})

    data = json_body(request)
    if data is None:
        return JsonResponse({"detail": "expected a JSON object"}, status=400)
    form = NoteForm(data)
    if not form.is_valid():
        return invalid(form)
    note = form.save()
    logger.info("created note", extra={"note_id": note.pk})
    return JsonResponse(note.as_dict(), status=201)


@csrf_exempt
@require_http_methods(["GET", "PATCH", "DELETE"])
def note(request: HttpRequest, note_id: int) -> HttpResponse:
    try:
        note = Note.objects.get(pk=note_id)
    except Note.DoesNotExist:
        return JsonResponse({"detail": "note not found"}, status=404)
    if request.method == "GET":
        return JsonResponse(note.as_dict())
    if request.method == "DELETE":
        note.delete()
        return HttpResponse(status=204)

    data = json_body(request)
    if data is None:
        return JsonResponse({"detail": "expected a JSON object"}, status=400)
    # A field left out keeps its current value.
    form = NoteForm({**note.as_dict(), **data}, instance=note)
    if not form.is_valid():
        return invalid(form)
    return JsonResponse(form.save().as_dict())
