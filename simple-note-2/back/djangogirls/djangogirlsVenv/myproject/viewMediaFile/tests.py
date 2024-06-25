import os
import django
from django.conf import settings

# 配置 Django 设置模块
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()

# 现在可以访问 settings 了
print(settings.BASE_DIR)

filename = '123'
# file_path = os.path.join(settings.BASE_DIR, 'db_modules', filename)
# print(file_path)