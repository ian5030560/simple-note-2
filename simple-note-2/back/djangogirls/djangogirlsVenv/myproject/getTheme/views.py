# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import GetTheme  # 新建檔案改這個
from db_modules import UserPersonalInfo  # 資料庫來的檔案
from db_modules import UserPersonalThemeData  # 資料庫來的檔案
from rest_framework import status
from django.http import JsonResponse, HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token
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

class GetThemeView(APIView):
    """
    取得主題: getTheme\n
        前端傳: \n
            帳號名(name: username, type: str)\n
        後端回:
            主題內容(type: str), HTTP_200_OK\n
            HTTP_400 if error

    其他例外:\n
        Serializer的raise_exception=False: Response HTTP_404_NOT_FOUND,\n
        JSONDecodeError: Response HTTP_405_METHOD_NOT_ALLOWED\n
    """

    serializer_class = GetThemeSerializer

    def get(self, request, format=None):
        output = [{"getTheme": output.getTheme} for output in GetTheme.objects.all()]
        return Response("get")

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            username = data.get("username")  # 帳號名稱
            if(not username or not UserPersonalInfo.check_username(username)): return Response(status=status.HTTP_403_FORBIDDEN)
            
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
            return JsonResponse(converted, safe=False)
        
        # Handle JSON decoding error
        except json.JSONDecodeError:
            username = None
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


def csrf(self, request):
    return JsonResponse({"csrfToken": get_token(request)})


def ping(self, request):
    return JsonResponse({"result": "OK"})
