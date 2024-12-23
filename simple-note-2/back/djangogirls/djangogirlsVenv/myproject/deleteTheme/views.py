"""刪除主題: 將主題刪除(deleteTheme)"""

import json
import sys

from django.http import HttpResponse
from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

sys.path.append("..db_modules")
from db_modules import UserPersonalThemeData


@permission_classes([AllowAny])
class DeleteThemeView(APIView):
    """
    前端傳: \n
        帳號名(name: username, type: str)\n

    後端回: \n
        主題內容(type: str), 200.\n
        400 if error.\n
    """

    def get(self):
        """Get 方法"""
        return Response("get")

    def post(self, request):
        """Post 方法"""
        data = json.loads(request.body)
        theme_id = data.get("themeId")  # 帳號名稱

        if not theme_id:
            return Response(
                {"error": "Invalid input"}, status=status.HTTP_400_BAD_REQUEST
            )

        is_theme_delete = UserPersonalThemeData.delete_one_theme_data(
            theme_id
        )  # 用theme_id刪除theme

        if is_theme_delete is True:  # 刪除成功
            return HttpResponse(status=status.HTTP_200_OK)

        # error
        return Response(is_theme_delete, status=status.HTTP_400_BAD_REQUEST)
