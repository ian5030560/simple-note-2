from django.db import models


class DeleteTheme(models.Model):
    deleteTheme = models.CharField(max_length=100)
