# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import LoadNoteTree  # 新建檔案改這個
from db_modules import UserFileData  # 資料庫來的檔案
from db_modules import UserNoteData  # 資料庫來的檔案
from db_modules import UserPersonalInfo  # 資料庫來的檔案
from db_modules import UserPersonalThemeData  # 資料庫來的檔案
from db_modules import UserSubNoteData  # 資料庫來的檔案
from db_modules import UserCollaborateNote  # 資料庫來的檔案
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token
import json

"""@csrf_exempt"""
"""@csrf_protect"""


class LoadNoteTreeView(APIView):
    """
    取得筆記: LoadNoteTree\n
        前端傳: \n
            帳號名(name: username, type: str)\n
            筆記id(name: noteId, type: str)\n
        後端回:
            筆記內容(type: str), HTTP_200_OK\n
            HTTP_400 if error

    其他例外:\n
        Serializer的raise_exception=False: Response HTTP_404_NOT_FOUND,\n
        JSONDecodeError: Response HTTP_405_METHOD_NOT_ALLOWED\n
    """

    serializer_class = LoadNoteTreeSerializer

    def get(self, request, format=None):
        output = [{"loadNoteTree": output.loadNoteTree} for output in LoadNoteTree.objects.all()]
        return Response("get")

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            username = data.get("username")  # 帳號名稱

            notesData = UserNoteData.check_user_all_notes(username)  # 透過username來取得資料
                
            if notesData:  # 取得成功
                singleNoteDataArray = [] # list of single note
                multipleNoteDataArray = [] # list of multiple note
                isCollaborativeNoteExist = 0 # check is Collaborative Note Exist? 0: no, 1: yes
                
                
                for i in range(len(notesData)):
                    notesDataID = notesData[i][1]
                    notesDataName = notesData[i][0]
                    
                    # single note
                    parentId = UserSubNoteData.check_parent_id(notesDataID)
                    silblingId = UserSubNoteData.check_sibling_id(notesDataID)
                    singleNoteData = {"noteId": notesDataID, "noteName": notesDataName, "parentId": parentId, "silblingId": silblingId}
                    singleNoteDataArray.append(singleNoteData)
                    
                    # multiple note  
                    # check Collaborative Note Exist? 0: no, 1: yes
                    if UserCollaborateNote.check_collaborativeNote_exist(username, notesDataID):
                        isCollaborativeNoteExist = 1 # Collaborative Note Exist
                        
                        # try get collaborateb url
                        # collaborateUrl = UserCollaborateNote.check_url(username)
                        collaborateUrl = UserCollaborateNote.get_note_url(username, notesDataID)
                        if collaborateUrl != []: # url != null
                            multipleNoteData = {"noteId": notesDataID, "noteName": notesDataName, "url": collaborateUrl}
                        else: # url == null
                            multipleNoteData = []
                        multipleNoteDataArray.append(multipleNoteData)
                    
                respDict = {"one": singleNoteDataArray, "multiple": multipleNoteDataArray}
          
                return JsonResponse(respDict)
            
            elif notesData == False:  # SQL error
                return Response("SQL error.", status=status.HTTP_400_BAD_REQUEST)

            # serializer
            serializer = LoadNoteTreeSerializer(data=data)

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
