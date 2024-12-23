"""取得主題: 取得使用者筆記主題資訊(getTheme)"""

import json
import typing
import sys

from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny

sys.path.append("..db_modules")
from db_modules import UserPersonalInfo, UserPersonalThemeData


class ThemeData(typing.TypedDict):
    """Theme Data"""
    colorLightPrimary: str
    colorLightNeutral: str
    colorDarkPrimary: str
    colorDarkNeutral: str


class GetThemeReturnData(typing.TypedDict):
    """Theme Return Data"""
    id: int
    name: str
    data: ThemeData


@permission_classes([AllowAny])
class GetThemeView(APIView):
    """
    前端傳: \n
        帳號名(name: username, type: str)\n

    後端回:
        主題內容(type: tuple)\n
        400 if error.\n
    """

    def get(self):
        """Get 方法"""
        return Response("get")

    def post(self, request):
        """Post 方法"""
        data = json.loads(request.body)
        username = data.get("username")  # 帳號名稱

        if not username or not UserPersonalInfo.check_username(username):
            return Response(status=status.HTTP_400_BAD_REQUEST)

        themes = UserPersonalThemeData.check_all_theme_data(username)

        def convert(
            theme: tuple[int, str, str, str, str, str, str]
        ) -> GetThemeReturnData:

            return {
                "id": theme[0],
                "name": theme[1],
                "data": {
                    "colorLightPrimary": theme[2],
                    "colorLightNeutral": theme[3],
                    "colorDarkPrimary": theme[4],
                    "colorDarkNeutral": theme[5],
                },
            }

        converted = list(map(convert, themes))

        return JsonResponse(converted, safe=False, status=200)
