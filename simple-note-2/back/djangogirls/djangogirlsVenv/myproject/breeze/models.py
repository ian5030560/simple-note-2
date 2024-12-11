import sys

sys.path.append("..db_modules")
from django.db import models


# Create your models here.
class Breeze(models.Model):
    breeze = models.CharField(max_length=100)
    class Meta:
        app_label = 'breeze'  # Replace 'breeze' with your app's name