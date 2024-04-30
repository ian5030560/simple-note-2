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

# new url add path here
sys.path.append("..deleteFile")
sys.path.append("..deleteNote")
sys.path.append("..forgetPassword")
sys.path.append("..gemma")
sys.path.append("..getInfo")
sys.path.append("..getNote")
sys.path.append("..logout")
sys.path.append("..myapp")
sys.path.append("..newMediaFile")
sys.path.append("..newNote")
sys.path.append("..newTheme")
sys.path.append("..registerAndLogin")
sys.path.append("..saveNote")
sys.path.append("..updateInfo")
sys.path.append("..updateMediaFile")
sys.path.append("..viewMediaFile")

# new url import here
from django.urls import path
from django.contrib import admin
from registerAndLogin.views import RegisterAndLoginView
from forgetPassword.views import ForgetPasswordView
from logout.views import LogoutView
from saveNote.views import SaveNoteView
from newMediaFile.views import NewMediaFileView
from updateMediaFile.views import UpdateMediaFileView
from deleteFile.views import DeleteFileView
from viewMediaFile.views import ViewMediaFileView
from getInfo.views import GetInfoView
from updateInfo.views import UpdateInfoView
from newTheme.views import NewThemeView
from gemma.views import GemmaView
from newNote.views import NewNoteView
from deleteNote.views import DeleteNoteView
from saveNote.views import SaveNoteView
from getNote.views import GetNoteView

# urls
urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "registerAndLogin/", RegisterAndLoginView.as_view(), name="registerAndLogin"
    ),  # registerAndLogin
    path(
        "forgetPassword/", ForgetPasswordView.as_view(), name="forgetPassword"
    ),  # forgetPassword
    path("logout/", LogoutView.as_view(), name="logout"),  # logout
    path("newMediaFile/", NewMediaFileView.as_view(), name="newMedia"),  # newMedia
    path(
        "updateMediaFile/", UpdateMediaFileView.as_view(), name="updateMediaFile"
    ),  # updateMediaFile
    path("deleteFile/", DeleteFileView.as_view(), name="deleteFile"),  # deleteFile
    path("viewMediaFile/", ViewMediaFileView.as_view(), name="viewMedia"),  # viewMedia
    path("getInfo/", GetInfoView.as_view(), name="getInfo"),  # getInfo
    path("updateInfo/", UpdateInfoView.as_view(), name="updateInfo"),  # updateInfo
    path("newTheme/", NewThemeView.as_view(), name="newTheme"),  # newTheme
    path("gemma/", GemmaView.as_view(), name="gemma"),  # gemma
    path(
        "viewMediaFile/<username>",
        ViewMediaFileView.as_view(),
        name="viewMediaFile/<username>",
    ),  # viewMediaFile/username
    path(
        "viewMediaFile/<username>/<filename>",
        ViewMediaFileView.as_view(),
        name="viewMediaFile/<username>/<filename>",
    ),  # viewMediaFile/username/filename
    path("getNote/", GetNoteView.as_view(), name="getNote"),  # getNote
    path("newNote/", NewNoteView.as_view(), name="newNote"),  # newNote
    path("deleteNote/", DeleteNoteView.as_view(), name="deleteNote"),  # deleteNote
    path("saveNote/", SaveNoteView.as_view(), name="saveNote"),  # saveNote
]
