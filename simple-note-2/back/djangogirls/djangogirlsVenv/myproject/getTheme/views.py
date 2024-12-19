# views.py
import sys
import json

sys.path.append("..db_modules")

from .models import GetTheme
from db_modules import UserPersonalInfo
from db_modules import UserPersonalThemeData
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
import typing

class ThemeData(typing.TypedDict):
    colorLightPrimary: str
    colorLightNeutral: str
    colorDarkPrimary: str
    colorDarkNeutral: str
    
class GetThemeReturnData(typing.TypedDict):
    id: int
    name: str
    data: ThemeData
    
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

@permission_classes([AllowAny])
class GetThemeView(APIView):
    """
    取得主題: getTheme\n

        前端傳: \n
            帳號名(name: username, type: str)\n

        後端回:
            主題內容(type: tuple)\n
            400 if error.\n
    """

    def get(self, request, format=None):
        output = [{"getTheme": output.getTheme} for output in GetTheme.objects.all()]
        return Response("get")

    def post(self, request, format=None):
        data = json.loads(request.body)
        username = data.get("username")  # 帳號名稱
        
        if(not username or not UserPersonalInfo.check_username(username)): 
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        themes = UserPersonalThemeData.check_all_theme_data(username)
        
        def convert(theme: tuple[int, str, str, str, str, str, str]) -> GetThemeReturnData:
            
            return {
                "id": theme[0],
                "name": theme[1],
                "data": {
                    "colorLightPrimary": theme[2],
                    "colorLightNeutral": theme[3],
                    "colorDarkPrimary": theme[4],
                    "colorDarkNeutral": theme[5]
                }
            }
        
        converted = list(map(convert, themes))
        
        return JsonResponse(converted, safe=False, status=200)