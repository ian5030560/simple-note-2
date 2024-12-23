from django.db import models


class GetNote(models.Model):
    getNote = models.CharField(max_length=100)
