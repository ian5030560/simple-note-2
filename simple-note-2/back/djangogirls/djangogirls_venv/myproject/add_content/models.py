import sys

sys.path.append("..db_modules")
from django.db import models


# Create your models here.
class AddContent(models.Model):
    add_content = models.CharField(max_length=100)
