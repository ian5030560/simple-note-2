import sys

sys.path.append("..db_modules")
from django.db import models


# Create your models here.
class NewMediaFile(models.Model):
    newMediaFile = models.CharField(max_length=100)
