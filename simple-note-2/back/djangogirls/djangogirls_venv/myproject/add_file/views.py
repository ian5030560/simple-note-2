# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import AddFile  # 新建檔案改這個
from db_modules.db import DB  # 資料庫來的檔案
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

"""@csrf_exempt"""
"""@csrf_protect"""


class AddFileView(APIView):
    """
    前端傳來:\n
        帳號名(name: username, type: str),\n
        文件名(name: filename, type: str),\n
        文件內容(name: content, type: blob),\n
        mimetype(name: mimetype, type: string).\n
    後端回傳:\n
        str: localhost:8000/view_file/"filename",\n
        Response HTTP_200_OK.\n

    其他例外:\n
        serializer的raise_exception=False: Response HTTP_404_NOT_FOUND,\n
        JSONDecodeError: Response HTTP_405_METHOD_NOT_ALLOWED\n
    """

    serializer_class = AddFileSerializer

    def get(self, request, format=None):
        output = [{"add_file": output.add_file} for output in AddFile.objects.all()]
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
                return Response(url, status=status.HTTP_200_OK)

            # serializer
            serializer = AddFileSerializer(data=data)

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