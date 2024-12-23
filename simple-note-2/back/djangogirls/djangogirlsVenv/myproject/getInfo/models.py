from django.db import models


class GetInfo(models.Model):
    getInfo = models.CharField(max_length=100)
