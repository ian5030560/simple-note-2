# views.py
import sys
import json

sys.path.append("..db_modules")

from .models import Logout
from db_modules import UserPersonalInfo
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

@permission_classes([AllowAny])
class LogoutView(APIView):
    """
    忘記密碼:\n
       Logout 成功: 200.\n
       Logout 失敗: 400.\n
    """
    def get(self, request, format=None):
        output = [{"logout": output.logout} for output in Logout.objects.all()]
        return Response("get")

    def post(self, request, format=None):
        data = json.loads(request.body)
        username = data.get("username")
        
        updateStatus = UserPersonalInfo.update_user_login_status_by_usernames(username)

        if updateStatus == True:
            return Response(status=status.HTTP_200_OK)
        
        elif updateStatus != True:
            return Response(updateStatus, status=status.HTTP_400_BAD_REQUEST)