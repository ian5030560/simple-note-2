# views.py
import sys

sys.path.append("..db_modules")
from rest_framework.response import Response
from .models import Signin
from db_modules.db import DB  # 資料庫來的檔案
from rest_framework import status


class SigninView:
    """
    def get(self, request, format=None):
        output = [
            {"employee": output.employee, "department": output.department}
            for output in React.objects.all()
        ]
        return Response(output)"""

    def post(self, request, format=None):
        try:
            email = request.POST["email"]
            password = request.POST["password"]
            username = request.POST["username"]
            id = request.POST["id"]
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
                    return Response(status=status.HTTP_201_CREATED)  # email不重複，可以註冊

        print(email, password, username, id)
        return Response(status=status.HTTP_404_NOT_FOUND)
