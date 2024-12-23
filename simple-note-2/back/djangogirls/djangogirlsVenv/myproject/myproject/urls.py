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
from pathlib import Path

# Group related paths
PATHS = {
    'note': [
        'getNote',
        'newNote',
        'deleteNote',
        'saveNote',
        'loadNoteTree'
    ],
    'media': [
        'newMediaFile',
        'deleteFile',
        'viewMediaFile'
    ],
    'user': [
        'registerAndLogin',
        'forgetPassword',
        'getInfo',
        'updateInfo'
    ],
    'collaboration': [
        'newCollaborate',
        'deleteCollaborate',
        'joinCollaborate'
    ],
    'theme': [
        'newTheme',
        'getTheme',
        'deleteTheme'
    ],
    'ai': [
        'aiSocket',
        'breeze'
    ],
    'core': [
        'myapp'
    ]
}

# Add paths using list comprehension
base_dir = Path('..')
[sys.path.append(str(base_dir / path)) 
 for category, paths in PATHS.items() 
 for path in paths]

# new url import here
from django.urls import path, include, re_path
from django.contrib import admin
from registerAndLogin.views import RegisterAndLoginView
from forgetPassword.views import ForgetPasswordView
from saveNote.views import SaveNoteView
from newMediaFile.views import NewMediaFileView
from deleteFile.views import DeleteFileView
from viewMediaFile.views import ViewMediaFileView
from getInfo.views import GetInfoView
from updateInfo.views import UpdateInfoView
from newTheme.views import NewThemeView
from breeze.views import BreezeView
from newNote.views import NewNoteView
from deleteNote.views import DeleteNoteView
from saveNote.views import SaveNoteView
from getNote.views import GetNoteView
from loadNoteTree.views import LoadNoteTreeView
from newCollaborate.views import NewCollaborateView
from deleteCollaborate.views import DeleteCollaborateView
from joinCollaborate.views import JoinCollaborateView
from getTheme.views import GetThemeView
from deleteTheme.views import DeleteThemeView
from aiSocket import views as AISocket

from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
  openapi.Info(
  title='Notes API',
  default_version='v1.0.0',
  description='',
  )
)

# Group related URL patterns
# User note data
note_patterns = [
    path('new/', NewNoteView.as_view(), name='note_new'),
    path('get/', GetNoteView.as_view(), name='note_get'),
    path('delete/', DeleteNoteView.as_view(), name='note_delete'),
    path('save/', SaveNoteView.as_view(), name='note_save'),
    path('tree/', LoadNoteTreeView.as_view(), name='note_tree'),
]

# Media
media_patterns = [
    path('new/', NewMediaFileView.as_view(), name='media_new'),
    path('delete/', DeleteFileView.as_view(), name='media_delete'),
    path('view/', ViewMediaFileView.as_view(), name='media_view'),
    path('<username>/', ViewMediaFileView.as_view(), name='media_view_user'),
    path('<username>/<noteId>/', ViewMediaFileView.as_view(), name='media_view_note'),
    path('<username>/<noteId>/<filename>/', ViewMediaFileView.as_view(), name='media_view_file'),
]

# User collaborate
collaborate_patterns = [
    path('new/', NewCollaborateView.as_view(), name='collaborate_new'),
    path('delete/', DeleteCollaborateView.as_view(), name='collaborate_delete'),
    path('join/', JoinCollaborateView.as_view(), name='collaborate_join'),
]

# User theme
theme_patterns = [
    path('new/', NewThemeView.as_view(), name='theme_new'),
    path('get/', GetThemeView.as_view(), name='theme_get'),
    path('delete/', DeleteThemeView.as_view(), name='theme_delete'),
]

# User info
info_patterns = [
    path('get/', GetInfoView.as_view(), name='info_get'),
    path('update/', UpdateInfoView.as_view(), name='info_update'),
]

# Main URL patterns
urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('rest_framework.urls')),
    path('api/jwtauth/', include('jwtauth.urls'), name='jwtauth'),
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/', include('notes.urls')),
    
    # Group related endpoints under their respective prefixes
    path('note/', include(note_patterns)),
    path('media/', include(media_patterns)),
    path('collaborate/', include(collaborate_patterns)),
    path('theme/', include(theme_patterns)),
    path('info/', include(info_patterns)),
    
    # Authentication and user management
    path('register/', RegisterAndLoginView.as_view(), name='register'),
    path('login/', RegisterAndLoginView.as_view(), name='login'),
    path('forget-password/', ForgetPasswordView.as_view(), name='forget_password'),
    
    # AI features
    path('breeze/', BreezeView.as_view(), name='breeze'),
    path('ai-socket/', AISocket.aiReturn, name='ai_return'),
]