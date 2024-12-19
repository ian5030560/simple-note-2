# views.py
import sys
import json

sys.path.append("..db_modules")

from .models import JoinCollaborate
from db_modules import UserCollaborateNote
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

@permission_classes([AllowAny])
class JoinCollaborateView(APIView):
    """
    加入協作(joinCollaborate)\n
    
        前端傳:\n
            帳號名(username, type: str),\n
            協作網址(url, type: str),\n
            
        後端傳:\n
            筆記內容(type: str), 200: 成功.\n
            400: 失敗.\n
    """
    def get(self, request, format=None):
        output = [{"joinCollaborate": output.joinCollaborate} for output in JoinCollaborate.objects.all()]
        return Response("get")

    def post(self, request, format=None):
        data = json.loads(request.body)
        guestName = data.get("username")  # guest帳號名稱
        masterName = data.get("mastername") # master帳號名稱
        noteId = data.get("noteId") # noteTitleId
        url = data.get("url")  # 協作網址

        # find all joined guest to check if they are already in the collaborate 
        joinedUsers = UserCollaborateNote.check_all_guest(masterName, noteId)

        if not joinedUsers: return Response(status=status.HTTP_400_BAD_REQUEST)
        
        exist = False
        user: tuple[str]
        for user in joinedUsers:
            name = user[0]
            if(name == guestName):
                exist = True
                break
        
        if exist: return Response(status=status.HTTP_200_OK)
        
        isJoin = UserCollaborateNote.insert_newData(masterName, noteId, guestName, url)
        
        if isJoin:  # 加入成功
            return Response(status=status.HTTP_201_CREATED)
        
        elif isJoin != True:  # 加入失敗
            return Response(status=status.HTTP_401_UNAUTHORIZED)
