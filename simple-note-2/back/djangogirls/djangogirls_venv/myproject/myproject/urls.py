"""
URL configuration for myproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import sys

sys.path.append("..signin")
sys.path.append("..signin_status")
sys.path.append("..myapp")
sys.path.append("..forget_password")
from signin import views
from django.urls import path
from django.contrib import admin
from signin.views import SigninView
from signin_status.views import SigninStatusView
from myapp.views import ReactView
from forget_password.views import ForgetPasswordView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("myapp/", ReactView.as_view(), name="myapp"),  # 測試路徑
    path("signin/", SigninView.as_view(), name="signin"),  # signin路徑
    path(
        "signin_status/", SigninStatusView.as_view(), name="signin_status"
    ),  # signin_status路徑
    path(
        "forget_password/", ForgetPasswordView.as_view(), name="forget_password"
    ),  # forget_password路徑
    path("csrf/", views.csrf),
    path("ping/", views.ping),
]
