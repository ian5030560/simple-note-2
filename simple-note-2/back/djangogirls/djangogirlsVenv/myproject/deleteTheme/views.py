# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import DeleteTheme
from db_modules import UserPersonalThemeData
from rest_framework import status
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

@permission_classes([AllowAny])
class DeleteThemeView(APIView):
    """
    刪除主題: deleteTheme\n

        前端傳: \n
            帳號名(name: username, type: str)\n

        後端回: \n
            主題內容(type: str), 200.\n
            400 if error.\n
    """

    def get(self, request, format=None):
        output = [{"deleteTheme": output.deleteTheme} for output in DeleteTheme.objects.all()]
        return Response("get")

    def post(self, request, format=None):
        data = json.loads(request.body)
        themeID = data.get("themeId")  # 帳號名稱
        
        if not themeID:
            return Response({"error": "Invalid input"}, status=status.HTTP_400_BAD_REQUEST)

        isThemeDelete = UserPersonalThemeData.delete_one_theme_data(themeID)  # 用theme_id刪除theme

        if isThemeDelete == True :  # 刪除成功
            return HttpResponse(status=status.HTTP_200_OK)
        
        elif isThemeDelete != True:  # error
            return Response(isThemeDelete, status=status.HTTP_400_BAD_REQUEST)