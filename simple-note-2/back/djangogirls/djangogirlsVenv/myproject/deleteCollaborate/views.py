# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import DeleteCollaborate  # 新建檔案改這個
from db_modules import UserFileData  # 資料庫來的檔案
from db_modules import UserNoteData  # 資料庫來的檔案
from db_modules import UserPersonalInfo  # 資料庫來的檔案
from db_modules import UserPersonalThemeData  # 資料庫來的檔案
from db_modules import UserCollaborateNote  # 資料庫來的檔案
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token


"""@csrf_exempt"""
"""@csrf_protect"""


class DeleteCollaborateView(APIView):
    """
    取消協作: 將協作網址刪除(deleteCollaborate)\n
    
    前端傳:\n
        帳號名(username, type: str),\n
        筆記id(noteId, type: str)\n
        
    後端傳:\n
        status code(200: 成功, 400: 失敗)\n
        
    其他例外:\n
        Serializer的raise_exception=False: Response HTTP_404_NOT_FOUND,\n
        JSONDecodeError: Response HTTP_405_METHOD_NOT_ALLOWED\n
    """

    serializer_class = DeleteCollaborateSerializer

    def get(self, request, format=None):
        output = [
            {"deleteCollaborate": output.deleteCollaborate} for output in DeleteCollaborate.objects.all()
        ]
        return Response("get")

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            guestName = data.get("username")  # guest帳號名稱
            masterName = data.get("masterName") # master帳號名稱
            noteId = data.get("noteId") # noteTitleId

            # isDelete = UserCollaborateNote.delete_one_data(masterName, noteId, guestName)
            isDelete = UserCollaborateNote.delete_all_data(masterName, noteId)
            
            if isDelete:  # 若刪除成功
                return Response(status=status.HTTP_200_OK)
            elif isDelete != True:  # 若刪除失敗
                return Response(status=status.HTTP_400_BAD_REQUEST)

            # serializer
            serializer = DeleteCollaborateSerializer(data=data)

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
