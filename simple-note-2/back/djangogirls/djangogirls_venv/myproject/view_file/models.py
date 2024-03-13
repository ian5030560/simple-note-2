import sys

sys.path.append("..db_modules")
from django.db import models


# Create your models here.
class ViewFile(models.Model):
    view_file = models.CharField(max_length=100)
