# views.py
import sys
import json

sys.path.append("..db_modules")

from .models import NewNote
from db_modules import UserNoteData
from db_modules import UserSubNoteData
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

@permission_classes([AllowAny])
class NewNoteView(APIView):
    """
    增加筆記: NewNote\n

        前端傳: \n
            帳號名(name: username, type: str)\n
            筆記id(name: noteId, type: str)\n
            筆記名稱(name: noteame, type: str)\n

        後端回:\n
            成功: 200.\n
            失敗: 400.\n
        
        輸入資料為空:\n
            Response 401.\n
    """
    def get(self, request, format=None):
        output = [{"newNote": output.newNote} for output in NewNote.objects.all()]
        return Response("get")

    def post(self, request, format=None):
        data = json.loads(request.body)
        username = data.get("username")  # 帳號名稱
        noteId = data.get("noteId")  # 筆記ID
        notename = data.get("notename")  # 筆記名稱
        parentId = data.get("parentId")  # 父筆記名稱
        silblingId = data.get("silblingId")  # 兄弟筆記名稱
        
        if username is None or noteId is None or notename is None: 
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        # 透過username, notename, noteId來新增資料
        returnStatus = UserNoteData.insert_user_id_note_name(username, notename, noteId)  

        # 透過noteId, parentId, silblingId來新增subnote資料
        subReturnStatus = UserSubNoteData.insert_data(noteId, parentId, silblingId) 
        
        if returnStatus and subReturnStatus:  # 新增成功
            return Response(status=status.HTTP_200_OK)
        
        elif returnStatus != 1 or subReturnStatus != 1:  # error
            return Response([returnStatus, subReturnStatus], status=status.HTTP_400_BAD_REQUEST)