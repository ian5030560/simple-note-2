"""載入筆記樹: 載入使用者所有的筆記樹(loadNoteTree)"""

import json
import sys

from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

sys.path.append("..db_modules")
from db_modules import UserPersonalThemeData


@permission_classes([AllowAny])
class NewThemeView(APIView):
    """
    前端傳來:\n
        帳號名(name: username, type: str),\n
        主題(name: theme, type: theme).\n

    後端回傳:\n
        200 if success.\n
        Sqlite error, 400 if failure.\n

    輸入資料為空:\n
        Response 401.\n
    """

    def get(self):
        """Get 方法"""
        return Response("get")

    def post(self, request):
        """Post 方法"""
        data = json.loads(request.body)
        username = data.get("username")  # 帳號名稱
        theme = data.get("theme")  # 主題資訊

        if username is None or theme is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        theme_name = theme.get("name")  # 主題名稱
        theme_data = theme.get("data")  # 主題內容

        if theme_name is None or theme_data is None:
            return Response(status=status.HTTP_402_PAYMENT_REQUIRED)

        color_light_pimary = theme_data.get("colorLightPrimary")
        color_light_neutral = theme_data.get("colorLightNeutral")
        color_dark_primary = theme_data.get("colorDarkPrimary")
        color_dark_neutral = theme_data.get("colorDarkNeutral")

        add_theme = UserPersonalThemeData.insert_themeData_by_usernames(
            username,
            theme_name,
            color_light_pimary,
            color_light_neutral,
            color_dark_primary,
            color_dark_neutral,
        )

        if add_theme:  # 新增主題成功
            return Response(status=status.HTTP_200_OK)

        # error
        return Response(add_theme, status=status.HTTP_400_BAD_REQUEST)
