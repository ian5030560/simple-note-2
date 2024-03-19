import sys

sys.path.append("..db_modules")
from django.db import models


# Create your models here.
class Gemma(models.Model):
    gemma = models.CharField(max_length=100)
