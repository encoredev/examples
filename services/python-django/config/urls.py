from django.contrib import admin
from django.urls import include, path

# The service receives the full path, its /{{name}} prefix included.
urlpatterns = [
    path("{{name}}/admin/", admin.site.urls),
    path("{{name}}/", include("notes.urls")),
]
