# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import GetInfo  # 新建檔案改這個
from db_modules import UserPersonalInfo  # 資料庫來的檔案
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

class GetInfoView(APIView):
    """
    取得個人資訊: get_info\n
    前端傳:\n
        帳號名(username, type: str).\n
    後端回傳:\n
        Response HTTP_200_OK if success.\n
        Sqlite error, Response HTTP_400_BAD_REQUEST if failure.\n

    其他例外:\n
        Serializer的raise_exception=False: Response HTTP_404_NOT_FOUND,\n
        JSONDecodeError: Response HTTP_405_METHOD_NOT_ALLOWED\n
    """

    serializer_class = GetInfoSerializer

    def get(self, request, format=None):
        output = [{"getInfo": output.getInfo} for output in GetInfo.objects.all()]
        return Response("get")

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            username = data.get("username")  # 帳號名稱

            # 2024/5/7回傳值有問題
            getInfoValue = UserPersonalInfo.check_user_personal_info(username)
            if getInfoValue:  # 取得成功(資料庫條件)
                return Response(getInfoValue, status=status.HTTP_200_OK)

            # serializer
            serializer = GetInfoSerializer(data=data)

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
