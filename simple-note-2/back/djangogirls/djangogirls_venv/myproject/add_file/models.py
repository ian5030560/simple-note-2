import sys

sys.path.append("..db_modules")
from django.db import models


# Create your models here.
class AddFile(models.Model):
    add_file = models.CharField(max_length=100)
