# views.py
import sys
import json
from typing import Any

sys.path.append("..db_modules")
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Signin
from db_modules.db import DB  # 資料庫來的檔案
from rest_framework import status
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import csrf_protect
from .serializers import *


"""@csrf_exempt"""


"""@csrf_protect"""


class SigninView(APIView):
    serializer_class = SigninSerializer
    """
    @classmethod
    def as_view(cls, **initkwargs):
        view = super(SigninView, cls).as_view(**initkwargs)
        return csrf_exempt(view)"""

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
            print("data:", data)
            print("email:", email)
            print("password:", password)
            print("username:", username)
            print("id:", id)
            serializer = SigninSerializer(data=data)
            db = DB()
            if id == "sign-in":
                if db.check_signin(username, password):
                    print("login successful")
                    return Response(status=status.HTTP_205_RESET_CONTENT)  # 登入成功
                else:
                    print("login false")
                    return Response(status=status.HTTP_301_MOVED_PERMANENTLY)  # 登入失敗
            elif id == "register":
                check_username = db.check_register_username(username)
                check_email = db.check_register_user_email(email)

                if check_username:
                    return Response(status=status.HTTP_302_FOUND)  # username重複，不能註冊

                elif not check_username:  # username不重複
                    if check_email:
                        return Response(
                            status=status.HTTP_303_SEE_OTHER
                        )  # email重複，不能註冊

                    elif not check_email:
                        print(
                            db.insert_into_User_Register_Data(username, password, email)
                        )
                        return Response(
                            status=status.HTTP_206_PARTIAL_CONTENT
                        )  # email不重複，可以註冊

            else:
                print("test")
                return Response(
                    "else123", status=status.HTTP_304_NOT_MODIFIED
                )  # exception

            if serializer.is_valid(raise_exception=True):
                serializer.save()
                print("serializer is valid")
                return Response(serializer.data)
            elif serializer.is_valid(raise_exception=False):
                print("serializer is not valid", end="")
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            db.close_connection()

        except json.JSONDecodeError:
            # Handle JSON decoding error
            email = None
            password = None
            username = None
            id = None
            return Response(status=status.HTTP_400_BAD_REQUEST)


def csrf(self, request):
    return JsonResponse({"csrfToken": get_token(request)})


def ping(self, request):
    return JsonResponse({"result": "OK"})
