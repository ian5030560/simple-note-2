"""更新資料: 更新使用者資料(updateInfo)"""

import hashlib
import json
import sys
import typing

from django.http import HttpRequest
from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

sys.path.append("..db_modules")
from db_modules import UserPersonalInfo, UserPersonalThemeData


@permission_classes([AllowAny])
class ThemeDict(typing.TypedDict):
    """Theme Dict 格式"""

    id: str
    name: str


class UpdateInfoData(typing.TypedDict):
    """Update Info Data 格式"""

    image: str | None
    password: str | None
    theme: ThemeDict | None


class UpdateInfoBody(typing.TypedDict):
    """Update Info Body 格式"""

    username: str
    data: UpdateInfoData


class UpdateInfoView(APIView):
    """
    前端傳:\n
        帳號名(username, type: str),\n
        更新的資料(name: data, type: Info, 若Info中的項目為null, ignore it).\n
        type: Info {
            頭像(name: image): 文件網址(string),\n
            主題(name: theme): Theme,\n
            密碼(name: password): string,\n
        }\n

    後端回傳:\n
        if image != "": \n
            Response 200 if success.\n
            Response 400 if failure.\n
        if theme != "": \n
            Response 201 if success.\n
            Response 401 if failure.\n
        if password != "": \n
            Response 202 if success.\n
            Response 402 if failure.\n
    """

    def get(self):
        """Get 方法"""
        return Response("get")

    def post(self, request: HttpRequest):
        """Post 方法"""
        data: UpdateInfoBody = json.loads(request.body)
        username = data["username"]

        if not username or not UserPersonalInfo.check_username(username):
            return Response(status=status.HTTP_403_FORBIDDEN)

        inner_data = data["data"]

        if inner_data["image"]:
            image = inner_data["image"]
            check_image_exist = UserPersonalInfo.check_profile_photo_by_username(
                username
            )
            insert_image_value: bool

            if check_image_exist is False:
                insert_image_value = UserPersonalInfo.insert_profile_photo_by_username(
                    username, image
                )

            else:
                insert_image_value = UserPersonalInfo.update_profile_photo_by_username(
                    username, image
                )

            if not insert_image_value:
                return Response(status=status.HTTP_417_EXPECTATION_FAILED)

        if inner_data["password"]:
            password = inner_data["password"]
            info = UserPersonalInfo.check_user_personal_info(username)

            if info is False:
                return Response(status=status.HTTP_400_BAD_REQUEST)

            addr = hashlib.sha256()
            b_password = bytes(password, encoding="utf-8")
            addr.update(b_password)
            hash_hexdigest = addr.hexdigest()

            UserPersonalInfo.update_user_password_by_usernames(username, hash_hexdigest)

        if inner_data["theme"]:
            theme = inner_data["theme"]
            is_default_theme = not theme["id"] and not theme["name"]

            if is_default_theme:
                UserPersonalInfo.update_user_theme_id_by_usernames(
                    username, theme["id"]
                )

            else:
                check_theme_exist = UserPersonalThemeData.check_theme_name(
                    username, theme["name"]
                )

                if not check_theme_exist:
                    return Response(status=status.HTTP_400_BAD_REQUEST)

                sccuess = UserPersonalInfo.update_user_theme_id_by_usernames(
                    username, theme["id"]
                )

                if not sccuess:
                    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(status=status.HTTP_200_OK)
