# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import RegisterAndLogin
from db_modules import UserFileData  # 資料庫來的檔案
from db_modules import UserNoteData  # 資料庫來的檔案
from db_modules import UserPersonalInfo  # 資料庫來的檔案
from db_modules import UserPersonalThemeData  # 資料庫來的檔案
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

"""@csrf_exempt"""
"""@csrf_protect"""


class RegisterAndLoginView(APIView):
    """
    登入:\n
       若登入成功: Response HTTP_200_OK,\n
       若登入失敗: Response HTTP_400_BAD_REQUEST,\n

    註冊:\n
        比較username:\n
            若username重複, 不能註冊: Response HTTP_401_UNAUTHORIZED\n
            若username不重複:\n
                若email重複, 不能註冊: Response HTTP_402_PAYMENT_REQUIRED\n
                若email不重複, 可以註冊: ResponseHTTP_201_CREATED\n
    其他例外:\n
        登入註冊例外: Response HTTP_403_FORBIDDEN\n
        Serializer raise_exception=False: Response HTTP_404_NOT_FOUND\n
        JSONDecodeError: Response HTTP_405_METHOD_NOT_ALLOWED\n
    """

    serializer_class = RegisterAndLoginSerializer

    def get(self, request, format=None):
        output = [
            {"email": output.account, "password": output.password}
            for output in RegisterAndLogin.objects.all()
        ]
        return Response("get")

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")
            username = data.get("username")
            id = data.get("id")
            
            serializer = RegisterAndLoginSerializer(data=data)
            
            # hash password
            import hashlib
            addr = hashlib.sha256()
            b_password = bytes(password, encoding='utf-8')
            addr.update(b_password)
            hash_hexdigest = addr.hexdigest()

            if id == "sign-in":
                if UserPersonalInfo.check_username_password(
                    username, hash_hexdigest
                ):  # 登入成功
                    if UserPersonalInfo.update_user_login_status_by_usernames(
                        username, 1
                    ):
                        return Response(status=status.HTTP_200_OK)
                    else:
                        return Response(status=status.HTTP_400_BAD_REQUEST)

                else:  # 登入失敗
                    return Response(status=status.HTTP_401_UNAUTHORIZED)

            elif id == "register":
                check_username = UserPersonalInfo.check_username(username)
                check_email = UserPersonalInfo.check_email(email)

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
                            UserPersonalInfo.insert_username_password_email(
                                username, hash_hexdigest, email
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
