# views.py
import sys
import json

sys.path.append("..db_modules")

from .models import GetInfo
from db_modules import UserPersonalInfo
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

@permission_classes([AllowAny])
class GetInfoView(APIView):
    """
    取得個人資訊: get_info\n

    前端傳:\n
        帳號名(username, type: str).\n

    後端回傳:\n
        200 if success.\n
        400 if failure.\n
    """

    def get(self, request, format=None):
        output = [{"getInfo": output.getInfo} for output in GetInfo.objects.all()]
        return Response("get")

    def post(self, request, format=None):

        data = json.loads(request.body)
        username = data.get("username")  # 帳號名稱

        if not username:
            return Response({"error": "Invalid input"}, status=status.HTTP_400_BAD_REQUEST)

        getInfoValue = UserPersonalInfo.check_user_personal_info(username)

        if getInfoValue:  # 取得成功
            return Response(getInfoValue, status=status.HTTP_200_OK)
        
        if not getInfoValue: # 取得失敗
            return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)