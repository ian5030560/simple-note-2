import sys

sys.path.append("..db_modules")
from django.db import models


# Create your models here.
class AddTheme(models.Model):
    add_theme = models.CharField(max_length=100)
