# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import DeleteNote  # 新建檔案改這個
from db_modules.db import DB  # 資料庫來的檔案
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

"""@csrf_exempt"""
"""@csrf_protect"""


class DeleteNoteView(APIView):
    """
    刪除筆記: deleteNote\n
        前端傳:\n
            帳號名(name: username, type: str)\n
            筆記id(name: noteId, type: str)\n
        後端回: status code 200 if success\n

    其他例外:\n
        Serializer的raise_exception=False: Response HTTP_404_NOT_FOUND,\n
        JSONDecodeError: Response HTTP_405_METHOD_NOT_ALLOWED\n
    """

    serializer_class = DeleteNoteSerializer

    def get(self, request, format=None):
        output = [
            {"deleteNote": output.deleteNote} for output in DeleteNote.objects.all()
        ]
        return Response("get")

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            username = data.get("username")  # 帳號名稱
            noteId = data.get("noteId")  # 筆記ID
            db = DB()

            returnStatus = db.delete_User_Note_Data_username_file_title_id(
                username, noteId
            )  # 透過username, noteId來刪除資料

            if returnStatus:  # 刪除成功
                return Response(status=status.HTTP_200_OK)

            # serializer
            serializer = DeleteNoteSerializer(data=data)

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
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


def csrf(self, request):
    return JsonResponse({"csrfToken": get_token(request)})


def ping(self, request):
    return JsonResponse({"result": "OK"})
