# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import GetNote
from db_modules import UserNoteData
from rest_framework import status
from django.http import JsonResponse, HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

class GetNoteView(APIView):
    """
    取得筆記: getNote\n

        前端傳: \n
            帳號名(name: username, type: str)\n
            筆記id(name: noteId, type: str)\n

        後端回:\n
            筆記內容(type: str), 200.\n
            400 if error.\n

    其他例外:\n
        Serializer的raise_exception=False: 404.\n
        JSONDecodeError: 405.\n
    """

    serializer_class = GetNoteSerializer

    def get(self, request, format=None):
        output = [{"getNote": output.getNote} for output in GetNote.objects.all()]
        return Response("get")

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            username = data.get("username")  # 帳號名稱
            noteId = data.get("noteId")  # 筆記ID

            returnNoteContent = UserNoteData.check_content(
                username, noteId
            )  # 透過noteId來取得資料
            returnNoteContent = returnNoteContent[0]

            if returnNoteContent != False:  # 取得成功
                return HttpResponse(returnNoteContent, status=status.HTTP_200_OK if returnNoteContent else status.HTTP_204_NO_CONTENT, content_type="text/plain")
            elif returnNoteContent == False:  # error
                return Response(returnNoteContent, status=status.HTTP_400_BAD_REQUEST)

            # serializer
            serializer = GetNoteSerializer(data=data)

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
