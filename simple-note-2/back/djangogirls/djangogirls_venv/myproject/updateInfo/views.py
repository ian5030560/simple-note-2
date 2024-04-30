# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import UpdateInfo  # 新建檔案改這個
from db_modules.db import DB  # 資料庫來的檔案
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

"""@csrf_exempt"""
"""@csrf_protect"""


class UpdateInfoView(APIView):
    """
    更新個人資訊:update_info\n
    前端傳:\n
        帳號名(username, type: str),\n
        更新的資料(name: data, type: Info, 若Info中的項目為null, ignore it).\n
        type: Info {
            頭像(name: image): 文件網址(string),
            主題(name: theme): Theme,
            密碼(name: password): string
            }
    後端回傳:\n
        if image != "":
            Response HTTP_200_OK if success.\n
            Response HTTP_400_BAD_REQUEST if failure.\n
        if theme != "":
            Response HTTP_201_CREATED if success.\n
            Response HTTP_401_UNAUTHORIZED if failure.\n
        if password !=:
            Response HTTP_202_ACCEPTED if success.\n
            Response HTTP_402_PAYMENT_REQUIRED if failure.\n
    其他例外:\n
        Serializer的raise_exception=False: Response HTTP_404_NOT_FOUND,\n
        JSONDecodeError: Response HTTP_405_METHOD_NOT_ALLOWED.\n
    """

    serializer_class = UpdateInfoSerializer

    def get(self, request, format=None):
        output = [
            {"updateInfo": output.updateInfo} for output in UpdateInfo.objects.all()
        ]
        return Response("get")

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            username = data.get("username")  # 帳號名稱
            image = ""  # 預設頭像 = null
            theme = ""  # 預設主題 = null
            password = ""  # 預設密碼 = null
            image = data.get("image")  # 更新的頭像
            theme = data.get("theme")  # 更新的主題
            password = data.get("password")  # 更新的密碼
            db = DB()

            if image != "":
                updateImageValue = db.update_profile_photo_by_username(username, image)
                if updateImageValue == 1:
                    return Response(status=status.HTTP_200_OK)
                else:
                    return Response(
                        updateImageValue, status=status.HTTP_400_BAD_REQUEST
                    )
            if theme != "":
                updateThemeValue = db.update_theme_by_username(username, theme)
                if updateThemeValue == 1:
                    return Response(status=status.HTTP_201_CREATED)
                else:
                    return Response(
                        updateThemeValue, status=status.HTTP_401_UNAUTHORIZED
                    )

            if password != "":
                updatePasswordValue = db.update_user_password_by_username(
                    username, password
                )
                if updatePasswordValue == 1:
                    return Response(status=status.HTTP_202_ACCEPTED)
                else:
                    return Response(
                        updatePasswordValue, status=status.HTTP_402_PAYMENT_REQUIRED
                    )
            # serializer
            serializer = UpdateInfoSerializer(data=data)

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
