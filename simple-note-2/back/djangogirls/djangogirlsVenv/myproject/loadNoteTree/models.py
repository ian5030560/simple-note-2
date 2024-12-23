from django.db import models


class LoadNoteTree(models.Model):
    loadNoteTree = models.CharField(max_length=100)
