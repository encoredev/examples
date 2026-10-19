from django.db import models


class Note(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["id"]

    def __str__(self) -> str:
        return self.title

    def as_dict(self) -> dict:
        return {
            "id": self.pk,
            "title": self.title,
            "body": self.body,
            "created_at": self.created_at.isoformat(),
        }
