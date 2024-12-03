# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import DeleteTheme  # 新建檔案改這個
from db_modules import UserPersonalThemeData  # 資料庫來的檔案
from rest_framework import status
from django.http import JsonResponse, HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

class DeleteThemeView(APIView):
    """
    刪除主題: deleteTheme\n
        前端傳: \n
            帳號名(name: username, type: str)\n
        後端回:
            主題內容(type: str), HTTP_200_OK\n
            HTTP_400 if error

    其他例外:\n
        Serializer的raise_exception=False: Response HTTP_404_NOT_FOUND,\n
        JSONDecodeError: Response HTTP_405_METHOD_NOT_ALLOWED\n
    """

    serializer_class = DeleteThemeSerializer

    def get(self, request, format=None):
        output = [{"deleteTheme": output.deleteTheme} for output in DeleteTheme.objects.all()]
        return Response("get")

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            themeID = data.get("themeId")  # 帳號名稱

            isThemeDelete = UserPersonalThemeData.delete_one_theme_data (
                themeID
            )  # 用theme_id刪除theme

            if isThemeDelete == True :  # 刪除成功
                return HttpResponse(status=status.HTTP_200_OK)
            elif isThemeDelete != True:  # error
                return Response(isThemeDelete, status=status.HTTP_400_BAD_REQUEST)

            # serializer
            serializer = DeleteThemeSerializer(data=data)

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
