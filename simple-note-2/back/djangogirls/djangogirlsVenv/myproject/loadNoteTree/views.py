# views.py
import sys
import json

sys.path.append("..db_modules")

from .models import LoadNoteTree
from db_modules import UserNoteData
from db_modules import UserSubNoteData
from db_modules import UserCollaborateNote
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

@permission_classes([AllowAny])
class LoadNoteTreeView(APIView):
    """
    取得筆記: LoadNoteTree\n

        前端傳: \n
            帳號名(name: username, type: str)\n
            筆記id(name: noteId, type: str)\n

        後端回:
            筆記內容(type: str), 200.\n
            400 if error.\n
    """
    def get(self, request, format=None):
        output = [{"loadNoteTree": output.loadNoteTree} for output in LoadNoteTree.objects.all()]
        return Response("get")

    def post(self, request, format=None):
        data = json.loads(request.body)
        username = data.get("username")  # 帳號名稱
        
        notesData = UserNoteData.check_user_all_notes(username)  # 透過username來取得資料
            
        if notesData:  # 取得成功
            singleNoteDataArray = [] # list of single note
            multipleNoteDataArray = [] # list of multiple note

            # single note
            for i in range(len(notesData)):
                notesDataID = notesData[i][1]
                notesDataName = notesData[i][0]
                
                parentId = UserSubNoteData.check_parent_id(notesDataID)
                silblingId = UserSubNoteData.check_sibling_id(notesDataID)
                singleNoteData = {"noteId": notesDataID, "noteName": notesDataName, "parentId": parentId, "silblingId": silblingId}
                singleNoteDataArray.append(singleNoteData)
                
            # multiple note  
            # try get collaborate url? True: response, False: don't response
            collaborateUrl = UserCollaborateNote.check_url(username)
            if collaborateUrl:
                # change collaborator urls from tuple to list
                collaborateUrlList = [str(item[0]) for item in collaborateUrl]
                
                # find all noteID, and change noteID from tuple to list
                noteID = UserCollaborateNote.check_all_noteID_by_guest(username)
                noteIDList = [str(item[0]) for item in noteID]

                for i in range(len(collaborateUrlList)):
                    # get note title id using note id
                    noteTitleID = UserNoteData.check_note_title_id_by_note_id(noteIDList[i])

                    # find note name
                    noteName = UserNoteData.check_note_name_by_note_id(noteIDList[i])
                    multipleNoteData = {"noteId": noteTitleID, "noteName": noteName, "url": collaborateUrlList[i]}
                    multipleNoteDataArray.append(multipleNoteData)

            respDict = {"one": singleNoteDataArray, "multiple": multipleNoteDataArray}
            return JsonResponse(respDict, status=200)
        
        elif notesData == False:  # SQL error
            return Response("SQL error.", status=status.HTTP_400_BAD_REQUEST)
        
        # Handle case where no notes are found
        return JsonResponse({"one": [], "multiple": []}, status=200)