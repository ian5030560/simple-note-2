import sys

sys.path.append("..db_modules")
from django.db import models


# Create your models here.
class SigninStatus(models.Model):
    signin_status = models.CharField(max_length=100)
