# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import DeleteFile  # 新建檔案改這個
from db_modules.db import DB  # 資料庫來的檔案
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

"""@csrf_exempt"""
"""@csrf_protect"""


class DeleteFileView(APIView):
    """
    前端傳:\n
        帳號名(name: username, type: str),\n
        文件網址(name: url(新增文件所提供的網址), type: str).\n
    後端回傳:\n
        Response HTTP_200_OK if success.\n

    其他例外:\n
        serializer的raise_exception=False: Response HTTP_404_NOT_FOUND,\n
        JSONDecodeError: Response HTTP_405_METHOD_NOT_ALLOWED\n
    """

    serializer_class = DeleteFileSerializer

    def get(self, request, format=None):
        output = [
            {"delete_file": output.delete_file} for output in DeleteFile.objects.all()
        ]
        return Response("get")

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            username = data.get("username")  # 帳號名稱
            url = data.get("url")  # 要刪除的文件網址
            db = DB()

            # 刪除帳號名稱所屬文件
            # 將網址前贅詞刪除，留下filename
            url.replace("localhost:8000/view_file/", "")

            if 1:
                return Response(status=status.HTTP_200_OK)

            # serializer
            serializer = DeleteFileSerializer(data=data)

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
