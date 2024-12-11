# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import SaveNote
from db_modules import UserNoteData
from rest_framework import status, permissions
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

class SaveNoteView(APIView):
    """
    儲存筆記: saveNote\n

        前端傳:\n
            帳號名(name: username, type: str)\n
            筆記id(name: noteId, type: str)\n
            筆記內容(name: content, type: str)\n

        後端回: \n
            200 if OK.\n

    其他例外:\n
        Serializer的raise_exception=False: 404,\n
        JSONDecodeError: 405.\n
    """
    # permission_classes = [permissions.AllowAny]
    serializer_class = SaveNoteSerializer

    def get(self, request, format=None):
        output = [{"saveNote": output.saveNote} for output in SaveNote.objects.all()]
        return Response("get")

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            username = data.get("username")  # 帳號名稱
            noteId = data.get("noteId")  # 筆記ID
            content = data.get("content")  # 筆記內容

            returnStatus = UserNoteData.update_content(
                username, noteId, content
            )  # 透過username, noteId, content來更新資料

            if returnStatus:  # 更新成功
                return Response(status=status.HTTP_200_OK)
            elif returnStatus != True:  # error
                return Response(returnStatus, status=status.HTTP_400_BAD_REQUEST)

            # serializer
            serializer = SaveNoteSerializer(data=data)

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
