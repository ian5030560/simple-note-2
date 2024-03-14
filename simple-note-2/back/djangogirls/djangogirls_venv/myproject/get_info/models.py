import sys

sys.path.append("..db_modules")
from django.db import models


# Create your models here.
class GetInfo(models.Model):
    get_info = models.CharField(max_length=100)
