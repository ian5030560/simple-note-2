"""載入筆記樹: 載入使用者所有的筆記樹(loadNoteTree)"""

import json
import sys

from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

sys.path.append("..db_modules")
from db_modules import UserCollaborateNote, UserNoteData, UserSubNoteData


@permission_classes([AllowAny])
class LoadNoteTreeView(APIView):
    """
    前端傳: \n
        帳號名(name: username, type: str)\n
        筆記id(name: noteId, type: str)\n

    後端回:
        筆記內容(type: str), 200.\n
        400 if error.\n
    """

    def get(self):
        """Get 方法"""
        return Response("get")

    def post(self, request):
        """Post 方法"""
        data = json.loads(request.body)
        username = data.get("username")  # 帳號名稱

        notes_data = UserNoteData.check_user_all_notes(
            username
        )  # 透過username來取得資料

        if notes_data:  # 取得成功
            single_note_data_array = []  # list of single note
            multiple_note_data_array = []  # list of multiple note

            # single note
            for i, note_data in enumerate(notes_data):
                notes_data_id = note_data[1]
                notes_data_name = note_data[0]

                parent_id = UserSubNoteData.check_parent_id(notes_data_id)
                sibling_id = UserSubNoteData.check_sibling_id(notes_data_id)
                single_note_data = {
                    "noteId": notes_data_id,
                    "noteName": notes_data_name,
                    "parentId": parent_id,
                    "siblingId": sibling_id,
                }
                single_note_data_array.append(single_note_data)

            # multiple note
            # try get collaborate url? True: response, False: don't response
            collaborate_url = UserCollaborateNote.check_url(username)
            if collaborate_url:
                # change collaborator urls from tuple to list
                collaborate_url_list = [str(item[0]) for item in collaborate_url]

                # find all noteID, and change noteID from tuple to list
                note_id = UserCollaborateNote.check_all_noteID_by_guest(username)
                note_id_list = [str(item[0]) for item in note_id]

                for i, url in enumerate(collaborate_url_list):
                    # Get note title id using note id
                    note_title_id = UserNoteData.check_note_title_id_by_note_id(
                        note_id_list[i]
                    )

                    # Find note name
                    note_name = UserNoteData.check_note_name_by_note_id(note_id_list[i])

                    multiple_note_data = {
                        "noteId": note_title_id,
                        "noteName": note_name,
                        "url": url,
                    }
                    multiple_note_data_array.append(multiple_note_data)

            resp_dict = {
                "one": single_note_data_array,
                "multiple": multiple_note_data_array,
            }
            return JsonResponse(resp_dict, status=200)

        if notes_data is False:  # SQL error
            return Response("SQL error.", status=status.HTTP_400_BAD_REQUEST)

        # Handle case where no notes are found
        return JsonResponse({"one": [], "multiple": []}, status=200)
