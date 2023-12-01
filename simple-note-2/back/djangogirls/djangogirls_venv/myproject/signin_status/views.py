# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import SigninStatus
from db_modules.db import DB  # 資料庫來的檔案
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

"""@csrf_exempt"""
"""@csrf_protect"""


class SigninStatusView(APIView):
    """
    登入狀態:
       若已登入, Response "true"
       若未登入, Response "false"

    其他例外:
        serializer raise_exception=False, Response HTTP_404_NOT_FOUND
        JSONDecodeError, Response HTTP_405_METHOD_NOT_ALLOWED
    """

    serializer_class = SigninStatusSerializer

    def get(self, request, format=None):
        output = [
            {"account": output.signin_status} for output in SigninStatus.objects.all()
        ]
        return Response("get")

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            username = data.get("username")

            serializer = SigninStatusSerializer(data=data)

            db = DB()

            if db.check_signin_status(username) == True:
                return Response("true")

            elif db.check_signin_status(username) == False:  # exception其他例外
                return Response("false")

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
