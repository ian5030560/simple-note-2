"""取得資訊: 取得使用者資訊(getInfo)"""

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
class GetInfoView(APIView):
    """
    前端傳:\n
        帳號名(username, type: str).\n

    後端回傳:\n
        200 if success.\n
        400 if failure.\n
    """

    def get(self):
        """Get 方法"""
        return Response("get")

    def post(self, request):
        """Post 方法"""
        data = json.loads(request.body)
        username = data.get("username")  # 帳號名稱

        if not username:
            return Response(
                {"error": "Invalid input"}, status=status.HTTP_400_BAD_REQUEST
            )

        get_info_value = UserPersonalInfo.check_user_personal_info(username)

        if get_info_value:  # 取得成功
            return Response(get_info_value, status=status.HTTP_200_OK)

        # 取得失敗
        return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)
