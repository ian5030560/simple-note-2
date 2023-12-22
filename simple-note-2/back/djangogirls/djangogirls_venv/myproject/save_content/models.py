import sys

sys.path.append("..db_modules")
from django.db import models


# Create your models here.
class SaveContent(models.Model):
    username = models.CharField(max_length=100)
    fid = models.CharField(max_length=100)
    content = models.CharField(max_length=100)
