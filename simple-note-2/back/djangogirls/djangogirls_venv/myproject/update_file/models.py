import sys

sys.path.append("..db_modules")
from django.db import models


# Create your models here.
class UpdateFile(models.Model):
    update_file = models.CharField(max_length=100)
