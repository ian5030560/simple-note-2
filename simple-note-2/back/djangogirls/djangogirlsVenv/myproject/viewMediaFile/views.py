# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import ViewMediaFile  # 新建檔案改這個
from db_modules import UserFileData  # 資料庫來的檔案
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import FileResponse
from django.conf import settings
import mimetypes
from django.http import HttpResponse, JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

import base64
import os
"""@csrf_exempt"""
"""@csrf_protect"""


class ViewMediaFileView(APIView):
    """
    Method: get.\n
    其他例外:\n
        serializer的raise_exception=False: Response HTTP_404_NOT_FOUND,\n
        JSONDecodeError: Response HTTP_405_METHOD_NOT_ALLOWED.\n
    """

    serializer_class = ViewMediaFileSerializer

    def get(self, request, username, notename, filename, format=None):
        # 构建文件路径
        file_path = os.path.join(settings.BASE_DIR, 'db_modules', 'fileTemp', filename)
        
        # 检查文件是否存在
        if not os.path.exists(file_path):
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # 检测文件类型
        mime_type, _ = mimetypes.guess_type(file_path)
        if not mime_type:
            mime_type = 'application/octet-stream'
        
        checkExistValue = UserFileData.check_file_name(username, notename, filename)
        # if exist, change name
        if checkExistValue == True:
            # 打开并读取文件
            try:
                return FileResponse(open(file_path, 'rb'), content_type=mime_type)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({"error": 'File not found'}, status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request, format=None):
        try:
            data = json.loads(request.body)

            # serializer
            serializer = ViewMediaFileSerializer(data=data)

            if serializer.is_valid(raise_exception=True):
                serializer.save()
                print("serializer is valid")
                return Response(serializer.data)

            elif serializer.is_valid(raise_exception=False):
                print("serializer is not valid", end="")
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

        # Handle JSON decoding error
        except json.JSONDecodeError:
            username = None
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


def csrf(self, request):
    return JsonResponse({"csrfToken": get_token(request)})


def ping(self, request):
    return JsonResponse({"result": "OK"})
