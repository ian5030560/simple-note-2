# urls.py
from django.urls import path
from .views import receive_data

urlpatterns = [
    # 其他路径...
    path("receive_data/", receive_data, name="receive_data"),
]
