import sys

sys.path.append("..db_modules")
from django.db import models


# Create your models here.
class NewTheme(models.Model):
    newTheme = models.CharField(max_length=100)
