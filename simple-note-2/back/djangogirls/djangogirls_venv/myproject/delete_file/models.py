import sys

sys.path.append("..db_modules")
from django.db import models


# Create your models here.
class DeleteFile(models.Model):
    delete_file = models.CharField(max_length=100)
