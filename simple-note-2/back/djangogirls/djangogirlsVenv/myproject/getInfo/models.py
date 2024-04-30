import sys

sys.path.append("..db_modules")
from django.db import models


# Create your models here.
class GetInfo(models.Model):
    getInfo = models.CharField(max_length=100)
