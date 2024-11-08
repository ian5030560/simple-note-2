# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import NewNote  # 新建檔案改這個
from db_modules import UserFileData  # 資料庫來的檔案
from db_modules import UserNoteData  # 資料庫來的檔案
from db_modules import UserPersonalInfo  # 資料庫來的檔案
from db_modules import UserPersonalThemeData  # 資料庫來的檔案
from db_modules import UserSubNoteData  # 資料庫來的檔案
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

"""@csrf_exempt"""
"""@csrf_protect"""


class NewNoteView(APIView):
    """
    增加筆記: NewNote\n
        前端傳: \n
            帳號名(name: username, type: str)\n
            筆記id(name: noteId, type: str)\n
            筆記名稱(name: noteame, type: str)\n
        後端回: status code 200 if success\n

    其他例外:\n
        Serializer的raise_exception=False: Response HTTP_404_NOT_FOUND,\n
        JSONDecodeError: Response HTTP_405_METHOD_NOT_ALLOWED\n
    """

    serializer_class = NewNoteSerializer

    def get(self, request, format=None):
        output = [{"newNote": output.newNote} for output in NewNote.objects.all()]
        return Response("get")

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            username = data.get("username")  # 帳號名稱
            noteId = data.get("noteId")  # 筆記ID
            notename = data.get("notename")  # 筆記名稱
            parentId = data.get("parentId")  # 父筆記名稱
            silblingId = data.get("silblingId")  # 兄弟筆記名稱
            
            if parentId:
                pass
            else:
                parentId = None
                
            if silblingId:
                pass
            else:
                silblingId = None
                
            returnStatus = UserNoteData.insert_user_id_note_name(
                username, notename, noteId
            )  # 透過username, notename, noteId來新增資料

            subReturnStatus = UserSubNoteData.insert_data(noteId, parentId, silblingId) # 透過noteId, parentId, silblingId來新增subnote資料
            
            if returnStatus and subReturnStatus:  # 新增成功
                return Response(status=status.HTTP_200_OK)
            elif returnStatus!=1 or subReturnStatus!=1:  # error
                return Response([returnStatus, subReturnStatus], status=status.HTTP_400_BAD_REQUEST)

            # serializer
            serializer = NewNoteSerializer(data=data)

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
