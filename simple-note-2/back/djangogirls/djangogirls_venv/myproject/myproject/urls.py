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
sys.path.append("..signout")
sys.path.append("..save_content")
sys.path.append("..load_content")
sys.path.append("..update_file")
sys.path.append("..upload_file")
sys.path.append("..delete_file")
sys.path.append("..view_file")
from signin import views
from django.urls import path
from django.contrib import admin
from signin.views import SigninView
from signin_status.views import SigninStatusView
from myapp.views import ReactView
from forget_password.views import ForgetPasswordView
from signout.views import SignoutView
from save_content.views import SaveContentView
from load_content.views import LoadContentView
from upload_file.views import UploadFileView
from update_file.views import UpdateFileView
from delete_file.views import DeleteFileView
from view_file.views import ViewFileView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("myapp/", ReactView.as_view(), name="myapp"),  # 測試
    path("signin/", SigninView.as_view(), name="signin"),  # signin
    path(
        "signin_status/", SigninStatusView.as_view(), name="signin_status"
    ),  # signin_status
    path(
        "forget_password/", ForgetPasswordView.as_view(), name="forget_password"
    ),  # forget_password
    path("signout/", SignoutView.as_view(), name="signout"),  # signout
    path(
        "load_content/", LoadContentView.as_view(), name="load_content"
    ),  # load_content
    path(
        "save_content/", SaveContentView.as_view(), name="save_content"
    ),  # save_content
    path("upload_file/", UploadFileView.as_view(), name="upload_file"),  # upload_file
    path("update_file/", UpdateFileView.as_view(), name="update_file"),  # update_file
    path("delete_file/", DeleteFileView.as_view(), name="delete_file"),  # delete_file
    path("view_file/", ViewFileView.as_view(), name="view_file"),  # view_file
    path("csrf/", views.csrf),
    path("ping/", views.ping),
]
