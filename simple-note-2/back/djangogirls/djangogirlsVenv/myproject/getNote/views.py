# views.py
import sys
import json

sys.path.append("..db_modules")

from .models import GetNote
from db_modules import UserNoteData
from rest_framework import status
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

@permission_classes([AllowAny])
class GetNoteView(APIView):
    """
    取得筆記: getNote\n

    前端傳: \n
        帳號名(name: username, type: str)\n
        筆記id(name: noteId, type: str)\n

    後端回:\n
        筆記內容(type: str), 200.\n
        400 if error.\n
    """

    def get(self, request, format=None):
        output = [{"getNote": output.getNote} for output in GetNote.objects.all()]
        return Response("get")

    def post(self, request, format=None):
        data = json.loads(request.body)
        username = data.get("username")  # 帳號名稱
        noteId = data.get("noteId")  # 筆記ID

        returnNoteContent = UserNoteData.check_content(username, noteId) # 透過noteId來取得資料
        if returnNoteContent:
            returnNoteContent = returnNoteContent[0]

        if returnNoteContent != False: # 取得成功
            return HttpResponse(returnNoteContent, status=status.HTTP_200_OK if returnNoteContent else status.HTTP_204_NO_CONTENT, content_type="text/plain")
        
        elif returnNoteContent == False: # error
            return Response(status=status.HTTP_400_BAD_REQUEST)