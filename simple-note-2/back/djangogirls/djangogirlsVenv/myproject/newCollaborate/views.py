# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import NewCollaborate  # 新建檔案改這個
from db_modules import UserFileData  # 資料庫來的檔案
from db_modules import UserNoteData  # 資料庫來的檔案
from db_modules import UserPersonalInfo  # 資料庫來的檔案
from db_modules import UserPersonalThemeData  # 資料庫來的檔案
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

"""@csrf_exempt"""
"""@csrf_protect"""


class NewCollaborateView(APIView):
    """
    發起協作(newCollaborate)
    
    前端傳:\n
        帳號名(username, type: str),\n
        筆記id(noteId, type: str),\n
        協作網址(url, type: str)\n
        
    後端傳:\n
        status code(200: 成功, 400: 失敗)\n

    其他例外:\n
        Serializer的raise_exception=False: Response HTTP_404_NOT_FOUND,\n
        JSONDecodeError: Response HTTP_405_METHOD_NOT_ALLOWED\n
    """

    serializer_class = NewCollaborateSerializer

    def get(self, request, format=None):
        output = [{"newCollaborate": output.newCollaborate} for output in NewCollaborate.objects.all()]
        return Response("get")

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            username = data.get("username")  # 帳號名稱
            noteId = data.get("noteId")  # 筆記id
            url = data.get("url")  # 協作網址

            if 1:  # 取得成功
                return Response(status=status.HTTP_200_OK)
            elif 0 == False:  # error
                return Response(status=status.HTTP_400_BAD_REQUEST)

            # serializer
            serializer = NewCollaborateSerializer(data=data)

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
