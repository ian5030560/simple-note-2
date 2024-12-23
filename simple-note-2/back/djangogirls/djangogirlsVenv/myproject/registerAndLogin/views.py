"""註冊與登入: 使用者註冊與登入(registerAndLogin)"""

import hashlib
import json
import sys

from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

sys.path.append("..db_modules")
from db_modules import UserPersonalInfo


@permission_classes([AllowAny])
class RegisterAndLoginView(APIView):
    """
    登入:\n
       若登入成功: Response 200,\n
       若登入失敗: Response 400,\n

    註冊:\n
        比較username:\n
            若username重複, 不能註冊: 401\n
            若username不重複:\n
                若email重複, 不能註冊: 402\n
                若email不重複, 可以註冊: 201\n

    輸入資料為空:\n
        Response 403.\n
    """

    def get(self):
        """Get 方法"""
        return Response("get")

    def post(self, request):
        """Post 方法"""
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")
        username = data.get("username")
        id = data.get("id")

        # hash password
        addr = hashlib.sha256()
        if password is None:
            return Response(status=status.HTTP_403_FORBIDDEN)
        b_password = bytes(password, encoding="utf-8")
        addr.update(b_password)
        hash_hexdigest = addr.hexdigest()

        if id == "sign-in":
            if UserPersonalInfo.check_username_password(
                username, hash_hexdigest
            ):  # 登入成功

                if UserPersonalInfo.update_user_login_status_by_usernames(username, 1):
                    return Response(status=status.HTTP_200_OK)

                return Response(status=status.HTTP_400_BAD_REQUEST)

            # 登入失敗
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        if id == "register":

            if email is None or password is None or username is None:
                return Response(status=status.HTTP_403_FORBIDDEN)

            check_username = UserPersonalInfo.check_username(username)
            check_email = UserPersonalInfo.check_email(email)

            if check_username:
                return Response(
                    status=status.HTTP_401_UNAUTHORIZED
                )  # username重複，不能註冊

            # username不重複
            if check_email:  # email重複，不能註冊
                return Response(status=status.HTTP_402_PAYMENT_REQUIRED)

            UserPersonalInfo.insert_username_password_email(
                username, hash_hexdigest, email
            )
            return Response(status=status.HTTP_201_CREATED)

        # exception其他例外
        return Response("else exception", status=status.HTTP_403_FORBIDDEN)
