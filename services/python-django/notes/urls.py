from django.urls import path

from . import views

urlpatterns = [
    path("notes", views.notes),
    path("notes/<int:note_id>", views.note),
]
