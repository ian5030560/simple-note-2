import sys

sys.path.append("..db_modules")
from django.db import models


# Create your models here.
class UpdateInfo(models.Model):
    updateInfo = models.CharField(max_length=100)
