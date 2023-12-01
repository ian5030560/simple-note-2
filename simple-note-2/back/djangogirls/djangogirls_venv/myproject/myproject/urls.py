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
from signin import views
from django.urls import path
from django.contrib import admin
from signin.views import SigninView
from signin_status.views import SigninStatusView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("signin/", SigninView.as_view(), name="signin"),
    path("signin_status/", SigninStatusView.as_view(), name="signin_status"),
    path("csrf/", views.csrf),
    path("ping/", views.ping),
]
