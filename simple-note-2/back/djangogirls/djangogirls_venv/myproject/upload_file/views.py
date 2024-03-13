# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import UploadFile  # 新建檔案改這個
from db_modules.db import DB  # 資料庫來的檔案
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

"""@csrf_exempt"""
"""@csrf_protect"""


class UploadFileView(APIView):
    """
    前端傳來:\n
        帳號名(name:username, type:str)、文件名(name: filename, type:str)、文件內容(name: content, type: blob)、mimetype(name: mimetype, type: string)
    後端回傳:\n
        str: localhost:8000/view_file/"filename"

    其他例外:\n
        serializer的raise_exception=False: Response HTTP_404_NOT_FOUND,\n
        JSONDecodeError: Response HTTP_405_METHOD_NOT_ALLOWED\n
    """

    serializer_class = UploadFileSerializer

    def get(self, request, format=None):
        output = [
            {"upload_file": output.upload_file} for output in UploadFile.objects.all()
        ]
        return Response("get")

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            username = data.get("username")  # 帳號名稱
            filename = data.get("filename")  # 文件名稱
            content = data.get("content")  # 文件內容
            mimetype = data.get("mimetype")  # 媒體種類
            db = DB()

            if 1:  # 新增成功(資料庫條件)
                url = "localhost:8000/view_file/" + str(filename)
                return url

            # serializer
            serializer = UploadFileSerializer(data=data)

            if serializer.is_valid(raise_exception=True):
                serializer.save()
                print("serializer is valid")
                return Response(serializer.data)

            elif serializer.is_valid(raise_exception=False):
                print("serializer is not valid", end="")
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

            # close db connection
            db.close_connection()

        # Handle JSON decoding error
        except json.JSONDecodeError:
            username = None
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


def csrf(self, request):
    return JsonResponse({"csrfToken": get_token(request)})


def ping(self, request):
    return JsonResponse({"result": "OK"})
