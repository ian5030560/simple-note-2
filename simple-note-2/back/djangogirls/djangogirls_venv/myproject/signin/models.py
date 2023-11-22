import sys

sys.path.append("..db_modules")
from django.db import models
from db_modules.db import SigninData  # 資料庫來的檔案


# Create your models here.
class Signin(models.Model):
    account = models.CharField(max_length=100)
    password = models.CharField(max_length=100)

    class Meta:
        app_label = "signin"
