# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import Signout  # 新建檔案改這個
from db_modules.db import DB  # 資料庫來的檔案
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

"""@csrf_exempt"""
"""@csrf_protect"""


class SignoutView(APIView):
    """
    忘記密碼:\n
       \temail輸入正確: Response HTTP_200_OK,\n
       \temail輸入錯誤: Response HTTP_404_NOT_FOUND\n
    """

    serializer_class = SignoutSerializer

    def get(self, request, format=None):
        output = [{"username": output.username} for output in Signout.objects.all()]
        return Response("get")

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            username = data.get("username")

            serializer = SignoutSerializer(data=data)

            db = DB()

            db.change_login_status(username)
            return Response(status=status.HTTP_200_OK)

            # serializer
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
