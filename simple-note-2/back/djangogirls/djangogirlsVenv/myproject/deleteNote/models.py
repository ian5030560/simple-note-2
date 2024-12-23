from django.db import models


class DeleteNote(models.Model):
    deleteNote = models.CharField(max_length=100)
