# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import ForgetPassword  # 新建檔案改這個
from db_modules.db import DB  # 資料庫來的檔案
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

# email用
from django.core.mail import EmailMessage
from django.conf import settings
from django.template.loader import render_to_string

"""@csrf_exempt"""
"""@csrf_protect"""


class ForgetPasswordView(APIView):
    """
    email:\n
       \temail成功寄出: Response HTTP_200_OK\n

    其他例外:\n
        serializer的raise_exception=False: Response HTTP_404_NOT_FOUND,\n
        JSONDecodeError: Response HTTP_405_METHOD_NOT_ALLOWED\n
    """

    serializer_class = ForgetPasswordSerializer

    def get(self, request, format=None):
        output = [
            {"forget_password": output.forget_password}
            for output in ForgetPassword.objects.all()
        ]
        return Response("get")

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            email = data.get("email")
            username = data.get("username")
            db = DB()

            password = db.useremail_to_userpassword(email)  # from DB get password
            # 電子郵件內容
            email_template = render_to_string(
                "change_password.html",
                {"username": username},
            )

            email = EmailMessage(
                "更改密碼通知信",  # 電子郵件標題
                email_template + str(password),  # 電子郵件內容
                settings.EMAIL_HOST_USER,  # 寄件者
                [email],  # 收件者
            )
            email.fail_silently = False
            if email.send():
                return Response(status=status.HTTP_200_OK)

            # serializer

            serializer = ForgetPasswordSerializer(data=data)

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
