# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import UpdateInfo  # 新建檔案改這個
from db_modules.db import DB  # 資料庫來的檔案
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

"""@csrf_exempt"""
"""@csrf_protect"""


class UpdateInfoView(APIView):
    """
    更新個人資訊:update_info\n
    前端傳:\n
        帳號名(username, type: str),\n
        更新的資料(name: data, type: Info, 若Info中的項目為null, ignore it).\n
    後端回傳:\n
        Response HTTP_200_OK if success.\n

    其他例外:\n
        serializer的raise_exception=False: Response HTTP_404_NOT_FOUND,\n
        JSONDecodeError: Response HTTP_405_METHOD_NOT_ALLOWED.\n
    """

    serializer_class = UpdateInfoSerializer

    def get(self, request, format=None):
        output = [
            {"update_info": output.update_info} for output in UpdateInfo.objects.all()
        ]
        return Response("get")

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            username = data.get("username")  # 帳號名稱
            newname = data.get("name")  # 要更新的名稱
            db = DB()

            if 1:  # 更新成功(資料庫條件)
                return Response(status=status.HTTP_200_OK)

            # serializer
            serializer = UpdateInfoSerializer(data=data)

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
