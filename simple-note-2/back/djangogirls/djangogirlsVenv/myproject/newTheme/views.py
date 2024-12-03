# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import NewTheme
from db_modules import UserPersonalThemeData
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

class NewThemeView(APIView):
    """
    前端傳來:\n
        帳號名(name: username, type: str),\n
        主題(name: theme, type: theme).\n

    後端回傳:\n
        200 if success.\n
        Sqlite error, 400 if failure.\n

    其他例外:\n
        Serializer的raise_exception=False: 404.\n
        JSONDecodeError: 405.\n
    """

    serializer_class = NewThemeSerializer

    def get(self, request, format=None):
        output = [{"newTheme": output.newTheme} for output in NewTheme.objects.all()]
        return Response("get")

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            username = data.get("username")  # 帳號名稱
            theme = data.get("theme")  # 主題資訊
            themeName = theme.get("name") #主題名稱
            themeData = theme.get("data") #主題內容
            colorLightPrimary = themeData.get("colorLightPrimary")
            colorLightNeutral = themeData.get("colorLightNeutral")
            colorDarkPrimary = themeData.get("colorDarkPrimary")
            colorDarkNeutral = themeData.get("colorDarkNeutral")

            addTheme = UserPersonalThemeData.insert_themeData_by_usernames(
                username, themeName, colorLightPrimary, colorLightNeutral, colorDarkPrimary, colorDarkNeutral
            )
            if addTheme:  # 新增主題成功(資料庫條件)
                return Response(status=status.HTTP_200_OK)
            elif addTheme != True:  # error
                return Response(addTheme, status=status.HTTP_400_BAD_REQUEST)

            # serializer
            serializer = NewThemeSerializer(data=data)

            if serializer.is_valid(raise_exception=True):
                serializer.save()
                print("serializer is valid")
                return Response(serializer.data)

            elif serializer.is_valid(raise_exception=False):
                print("serializer is not valid", end="")
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

        # Handle JSON decoding error
        except json.JSONDecodeError:
            username = None
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


def csrf(self, request):
    return JsonResponse({"csrfToken": get_token(request)})


def ping(self, request):
    return JsonResponse({"result": "OK"})
