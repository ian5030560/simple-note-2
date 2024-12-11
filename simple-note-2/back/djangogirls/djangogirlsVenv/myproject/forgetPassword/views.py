# views.py
import sys
import json

sys.path.append("..db_modules")

from .models import ForgetPassword
from db_modules import UserPersonalInfo
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

# email用
from django.core.mail import EmailMessage
from django.conf import settings
from django.template.loader import render_to_string

from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

@permission_classes([AllowAny])
class ForgetPasswordView(APIView):
    """
    email:\n
       Email成功寄出: 200.\n
       Error: 400.\n
    """

    def get(self, request, format=None):
        output = [
            {"forgetPassword": output.forgetPassword}
            for output in ForgetPassword.objects.all()
        ]
        return Response("get")

    def post(self, request, format=None):
        data = json.loads(request.body)
        email = data.get("email")
        username = data.get("username")

        if not email or not username:
            return Response({"error": "Missing email or username"}, status=status.HTTP_400_BAD_REQUEST)

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