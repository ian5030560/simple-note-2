# views.py
import sys
import json

sys.path.append("..db_modules")

from .models import NewCollaborate
from db_modules import UserCollaborateNote
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

@permission_classes([AllowAny])
class NewCollaborateView(APIView):
    """
    發起協作(newCollaborate)
    
        前端傳:\n
            帳號名(username, type: str),\n
            筆記id(noteId, type: str),\n
            協作網址(url, type: str)\n
            
        後端傳:\n
            200: 成功.\n
            400: 失敗.\n
    """
    def get(self, request, format=None):
        output = [{"newCollaborate": output.newCollaborate} for output in NewCollaborate.objects.all()]
        return Response("get")

    def post(self, request, format=None):
        data = json.loads(request.body)
        masterName = data.get("username") # master帳號名稱
        noteId = data.get("noteId") # noteTitleId
        url = data.get("url")  # 協作網址

        # join collaborate by master_name, note_title_id, master_name
        isNew = UserCollaborateNote.insert_newData(masterName, noteId, masterName, url)
        
        if isNew:  # 加入成功
            return Response(status=status.HTTP_200_OK)
        
        elif isNew != True:  # 加入失敗
            return Response(status=status.HTTP_400_BAD_REQUEST)