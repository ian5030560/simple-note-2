# views.py
import sys
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

"""@csrf_exempt"""


"""@csrf_protect"""


class SigninView(APIView):
    """
    @classmethod
    def as_view(cls, **initkwargs):
        view = super(SigninView, cls).as_view(**initkwargs)
        return csrf_exempt(view)"""

    """
    def get(self, request, format=None):
        output = [
            {"employee": output.employee, "department": output.department}
            for output in React.objects.all()
        ]
        return Response(output)"""

    def post(self, request, format=None):
        try:
            email = request.POST("email")
            password = request.POST("password")
            username = request.POST("username")
            id = request.POST("id")
        except KeyError:
            email = None
            password = None
            username = None
            id = None
        if id == "sign-in":
            if DB.check_signin(username, password) == True:
                return Response(status=status.HTTP_200_OK)  # 登入成功
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)  # 登入失敗
        elif id == "register":
            check_username = DB.check_register_username(username)
            check_email = DB.check_register_user_email(email)

            if check_username == True:
                return Response(status=status.HTTP_401_UNAUTHORIZED)  # username重複，不能註冊

            elif check_username == False:  # username不重複
                if check_email == True:
                    return Response(
                        status=status.HTTP_402_PAYMENT_REQUIRED
                    )  # email重複，不能註冊

                elif check_email == False:
                    print(DB.insert_into_User_Register_Data(username, password, email))
                    return Response(status=status.HTTP_201_CREATED)  # email不重複，可以註冊
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)  # exception
        DB.close_connection()


def csrf(self, request):
    return JsonResponse({"csrfToken": get_token(request)})


def ping(self, request):
    return JsonResponse({"result": "OK"})
