import sys

sys.path.append("..db_modules")
from django.db import models


# Create your models here.
class RegisterAndLogin(models.Model):
    account = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
