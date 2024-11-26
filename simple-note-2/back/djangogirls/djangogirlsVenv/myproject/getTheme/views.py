# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import GetTheme  # 新建檔案改這個
from db_modules import UserFileData  # 資料庫來的檔案
from db_modules import UserNoteData  # 資料庫來的檔案
from db_modules import UserPersonalInfo  # 資料庫來的檔案
from db_modules import UserPersonalThemeData  # 資料庫來的檔案
from rest_framework import status
from django.http import JsonResponse, HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token
import typing

"""@csrf_exempt"""
"""@csrf_protect"""

class GetThemeReturnData(typing.TypedDict):
    id: int
    name: str
    colorLightPrimary: str
    colorLightNeutral: str
    colorDarkPrimary: str
    colorDarkNeutral: str
    
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
            print("------------------------------------------")
            print(data)
            print("------------------------------------------")
            username = data.get("username")  # 帳號名稱
            if(not username or not UserPersonalInfo.check_username(username)): return Response(status=status.HTTP_403_FORBIDDEN)
            
            themes = UserPersonalThemeData.check_all_theme_data(username)
            
            def convert(theme: tuple[int, str, str, str, str, str, str]) -> GetThemeReturnData:
                return {
                    "id": theme[0],
                    "name": theme[1],
                    "colorLightPrimary": theme[2],
                    "colorLightNeutral": theme[3],
                    "colorDarkPrimary": theme[4],
                    "colorLightNeutral": theme[5]
                }
            
            converted = list(map(convert, themes))
            return JsonResponse(converted, safe=False)
            # themeContent = UserPersonalThemeData.check_all_theme_data (
            #     username
            # )  # 用username取得theme

            # if themeContent != False:  # 取得成功
            #     return HttpResponse(themeContent, status=status.HTTP_200_OK)
            # elif themeContent == False:  # error
            #     return Response(themeContent, status=status.HTTP_400_BAD_REQUEST)

            # # serializer
            # serializer = GetThemeSerializer(data=data)

            # if serializer.is_valid(raise_exception=True):
            #     serializer.save()
            #     print("serializer is valid")
            #     return Response(serializer.data)

            # elif serializer.is_valid(raise_exception=False):
            #     print("serializer is not valid", end="")
            #     print(serializer.errors)
            #     return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

        # Handle JSON decoding error
        except json.JSONDecodeError:
            username = None
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


def csrf(self, request):
    return JsonResponse({"csrfToken": get_token(request)})


def ping(self, request):
    return JsonResponse({"result": "OK"})
