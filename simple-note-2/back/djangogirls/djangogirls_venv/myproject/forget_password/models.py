import sys

sys.path.append("..db_modules")
from django.db import models


# Create your models here.
class ForgetPassword(models.Model):
    forget_password = models.CharField(max_length=100)
