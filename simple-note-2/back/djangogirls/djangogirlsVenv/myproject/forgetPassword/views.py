# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import ForgetPassword
from db_modules import UserPersonalInfo
from rest_framework import status, permissions
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

# email用
from django.core.mail import EmailMessage
from django.conf import settings
from django.template.loader import render_to_string

class ForgetPasswordView(APIView):
    """
    email:\n
       Email成功寄出: 200.\n
       Error: 4000.\n

    其他例外:\n
        Serializer的raise_exception=False: 404.\n
        JSONDecodeError: 405.\n
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = ForgetPasswordSerializer

    def get(self, request, format=None):
        output = [
            {"forgetPassword": output.forgetPassword}
            for output in ForgetPassword.objects.all()
        ]
        return Response("get")

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            email = data.get("email")
            username = data.get("username")

            password = UserPersonalInfo.search_password(email)  # from DB get password
            if password:
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
            elif password == False:
                return Response(status=status.HTTP_400_BAD_REQUEST)

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


        # Handle JSON decoding error
        except json.JSONDecodeError:
            username = None
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


def csrf(self, request):
    return JsonResponse({"csrfToken": get_token(request)})


def ping(self, request):
    return JsonResponse({"result": "OK"})
