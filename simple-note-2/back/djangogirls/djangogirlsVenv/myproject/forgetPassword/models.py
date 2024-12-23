from django.db import models


class ForgetPassword(models.Model):
    forgetPassword = models.CharField(max_length=100)
