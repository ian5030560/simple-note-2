# views.py
import sys
import json

sys.path.append("..db_modules")

from .models import NewTheme
from db_modules import UserPersonalThemeData
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

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
    def get(self, request, format=None):
        output = [{"newTheme": output.newTheme} for output in NewTheme.objects.all()]
        return Response("get")

    def post(self, request, format=None):
        data = json.loads(request.body)
        username = data.get("username")  # 帳號名稱
        theme = data.get("theme")  # 主題資訊

        if username is None or theme is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        themeName = theme.get("name") #主題名稱
        themeData = theme.get("data") #主題內容

        if themeName is None or themeData is None:
            return Response(status=status.HTTP_402_PAYMENT_REQUIRED)

        colorLightPrimary = themeData.get("colorLightPrimary")
        colorLightNeutral = themeData.get("colorLightNeutral")
        colorDarkPrimary = themeData.get("colorDarkPrimary")
        colorDarkNeutral = themeData.get("colorDarkNeutral")

        addTheme = UserPersonalThemeData.insert_themeData_by_usernames(username, themeName, colorLightPrimary, colorLightNeutral, colorDarkPrimary, colorDarkNeutral)
        
        if addTheme:  # 新增主題成功
            return Response(status=status.HTTP_200_OK)
        
        elif addTheme != True:  # error

            return Response(addTheme, status=status.HTTP_400_BAD_REQUEST)