# views.py
import sys
import json

sys.path.append("..db_modules")

from typing import Any
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.csrf import ensure_csrf_cookie
from .serializers import *
from .models import Signin
from db_modules.db import DB  # 資料庫來的檔案
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

"""@csrf_exempt"""
"""@csrf_protect"""


class SigninView(APIView):
    """
    登入:
       若登入成功, Response HTTP_200_OK
       若登入失敗, Response HTTP_400_BAD_REQUEST

    註冊:
       比較username:
            若username重複, 不能註冊, Response HTTP_401_UNAUTHORIZED
            若username不重複:
                若email重複, 不能註冊, Response HTTP_402_PAYMENT_REQUIRED
                若email不重複, 可以註冊, ResponseHTTP_201_CREATED
    其他例外:
        登入註冊例外, Response HTTP_403_FORBIDDEN
        serializer raise_exception=False, Response HTTP_404_NOT_FOUND
        JSONDecodeError, Response HTTP_405_METHOD_NOT_ALLOWED
    """

    serializer_class = SigninSerializer

    def get(self, request, format=None):
        output = [
            {"account": output.account, "password": output.password}
            for output in Signin.objects.all()
        ]
        return Response("get")

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")
            username = data.get("username")
            id = data.get("id")

            serializer = SigninSerializer(data=data)

            db = DB()

            if id == "sign-in":
                if db.check_signin(username, password):  # 登入成功
                    return Response(status=status.HTTP_200_OK)

                else:  # 登入失敗
                    return Response(status=status.HTTP_400_BAD_REQUEST)

            elif id == "register":
                check_username = db.check_register_username(username)
                check_email = db.check_register_user_email(email)

                if check_username:
                    return Response(
                        status=status.HTTP_401_UNAUTHORIZED
                    )  # username重複，不能註冊

                elif not check_username:  # username不重複
                    if check_email:  # email重複，不能註冊
                        return Response(status=status.HTTP_402_PAYMENT_REQUIRED)

                    elif not check_email:  # email不重複，可以註冊
                        print(
                            "register:",
                            db.insert_into_User_Register_Data(
                                username, password, email
                            ),
                        )
                        return Response(status=status.HTTP_201_CREATED)

            else:  # exception其他例外
                return Response("else exception", status=status.HTTP_403_FORBIDDEN)

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
            email = None
            password = None
            username = None
            id = None
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


def csrf(self, request):
    return JsonResponse({"csrfToken": get_token(request)})


def ping(self, request):
    return JsonResponse({"result": "OK"})
