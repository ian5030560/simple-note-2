# views.py
import sys
import json

sys.path.append("..db_modules")

from .models import SaveNote
from db_modules import UserNoteData
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

@permission_classes([AllowAny])
class SaveNoteView(APIView):
    """
    儲存筆記: saveNote\n

        前端傳:\n
            帳號名(name: username, type: str)\n
            筆記id(name: noteId, type: str)\n
            筆記內容(name: content, type: str)\n

        後端回: \n
            200 if OK.\n
            400 if not OK.\n

        輸入資料為空:\n
            Response 401.\n
    """
    def get(self, request, format=None):
        output = [{"saveNote": output.saveNote} for output in SaveNote.objects.all()]
        return Response("get")

    def post(self, request, format=None):
        data = json.loads(request.body)
        username = data.get("username")  # 帳號名稱
        noteId = data.get("noteId")  # 筆記ID
        content = data.get("content")  # 筆記內容

        if username is None or noteId is None or content is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        returnStatus = UserNoteData.update_content(username, noteId, content)  # 透過username, noteId, content來更新資料

        if returnStatus:  # 更新成功
            return Response(status=status.HTTP_200_OK)
        
        elif returnStatus != True:  # error
            return Response(returnStatus, status=status.HTTP_400_BAD_REQUEST)