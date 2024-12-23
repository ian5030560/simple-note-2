from django.db import models


class GetTheme(models.Model):
    getTheme = models.CharField(max_length=100)
