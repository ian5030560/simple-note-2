# views.py
import sys
import json

sys.path.append("..db_modules")

from .models import DeleteCollaborate
from db_modules import UserCollaborateNote
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

@permission_classes([AllowAny])
class DeleteCollaborateView(APIView):
    """
    取消協作: 將協作網址刪除(deleteCollaborate)\n
    
    前端傳:\n
        帳號名(username, type: str)\n
        筆記id(noteId, type: str)\n
        
    後端傳:\n
        200: 成功.\n
        400: 失敗.\n
    """

    def get(self, request, format=None):
        output = [
            {"deleteCollaborate": output.deleteCollaborate} for output in DeleteCollaborate.objects.all()
        ]
        return Response("get")

    def post(self, request, format=None):
        data = json.loads(request.body)
        masterName = data.get("masterName") # master帳號名稱
        noteId = data.get("noteId") # noteTitleId

        isDelete = UserCollaborateNote.delete_all_data(masterName, noteId)
        
        if isDelete:  # 若刪除成功
            return Response(status=status.HTTP_200_OK)
        elif isDelete != True:  # 若刪除失敗
            return Response(status=status.HTTP_400_BAD_REQUEST)
