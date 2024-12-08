# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import JoinCollaborate
from db_modules import UserCollaborateNote
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

class JoinCollaborateView(APIView):
    """
    加入協作(joinCollaborate)\n
    
    前端傳:\n
        帳號名(username, type: str),\n
        協作網址(url, type: str),\n
        
    後端傳:\n
        筆記內容(type: str), 200: 成功.\n
        400: 失敗.\n

    其他例外:\n
        Serializer的raise_exception=False: 404.\n
        JSONDecodeError: 405.\n
    """

    serializer_class = JoinCollaborateSerializer

    def get(self, request, format=None):
        output = [{"joinCollaborate": output.joinCollaborate} for output in JoinCollaborate.objects.all()]
        return Response("get")

    def post(self, request, format=None):
        try:
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
                return Response(status=status.HTTP_200_OK)
            elif isJoin != True:  # 加入失敗
                return Response(status=status.HTTP_400_BAD_REQUEST)

            # serializer
            serializer = JoinCollaborateSerializer(data=data)

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
