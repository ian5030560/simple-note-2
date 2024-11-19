import sys

sys.path.append("..db_modules")
from django.db import models


# Create your models here.
class DeleteTheme(models.Model):
    deleteTheme = models.CharField(max_length=100)
