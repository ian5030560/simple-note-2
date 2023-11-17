# models.py
from django.db import models


class YourModel(models.Model):
    your_field = models.CharField(max_length=100)
    # 添加其他需要的字段
