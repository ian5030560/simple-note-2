# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import SaveContent  # 新建檔案改這個
from db_modules.db import DB  # 資料庫來的檔案
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

"""@csrf_exempt"""
"""@csrf_protect"""


class SaveContentView(APIView):
    """
    儲存成功:200\n
    儲存失敗:400\n
    """

    serializer_class = SaveContentSerializer

    def get(self, request, format=None):
        output = [
            {"username": output.username, "id": output.id, "content": output.content}
            for output in SaveContent.objects.all()
        ]
        return Response("get")

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            username = data.get("username")
            id = data.get("id")
            content = data.get("content")

            serializer = SaveContentSerializer(data=data)

            db = DB()

            save = filename_insert_content(username, id, content)
            if save == True:
                return Response("save successfully", status=status.HTTP_200_OK)

            elif save == False:  # exception其他例外
                return Response("else exception", status=status.HTTP_400_BAD_REQUEST)

            # serializer
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                print("serializer is valid")
                return Response(serializer.data)

            elif serializer.is_valid(raise_exception=False):
                print("serializer is not valid", end="")
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

            # close db connection
            db.close_connection()

        # Handle JSON decoding error
        except json.JSONDecodeError:
            username = None
            id = None
            content = None
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


def csrf(self, request):
    return JsonResponse({"csrfToken": get_token(request)})


def ping(self, request):
    return JsonResponse({"result": "OK"})
