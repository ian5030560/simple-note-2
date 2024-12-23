from django.db import models


class DeleteFile(models.Model):
    deleteFile = models.CharField(max_length=100)
