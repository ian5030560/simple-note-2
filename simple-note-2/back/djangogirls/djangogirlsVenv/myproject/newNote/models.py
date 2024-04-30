import sys

sys.path.append("..db_modules")
from django.db import models


# Create your models here.
class NewNote(models.Model):
    newNote = models.CharField(max_length=100)
