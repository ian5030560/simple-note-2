# views.py
import sys
import json

sys.path.append("..db_modules")

from .models import DeleteNote
from db_modules import UserNoteData
from db_modules import UserSubNoteData
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

@permission_classes([AllowAny])
class DeleteNoteView(APIView):
    """
    刪除筆記: deleteNote\n

        前端傳:\n
            帳號名(name: username, type: str)\n
            筆記id(name: noteId, type: str)\n

        後端回:\n
            200 if success.\n
            400 if error.\n
    """

    def get(self, request, format=None):
        output = [
            {"deleteNote": output.deleteNote} for output in DeleteNote.objects.all()
        ]
        return Response("get")

    def post(self, request, format=None):
        # try:
        data = json.loads(request.body)
        if not all(key in data for key in ("username", "noteId")):
            return Response({"error": "Missing required fields"}, status=status.HTTP_402_PAYMENT_REQUIRED)

        username = data.get("username")  # 帳號名稱
        noteId = data.get("noteId")  # 筆記ID

        sub_note_deleted  = UserSubNoteData.delete_data(noteId)  # 透過noteId來刪除sub note資料
        # delete sub note Data error
        if isinstance(sub_note_deleted, dict) and sub_note_deleted != True:
            return Response(sub_note_deleted, status=status.HTTP_400_BAD_REQUEST)
        
        main_note_deleted  = UserNoteData.delete_note_by_usernames_note_title_id(username, noteId) #delete main note
        # delete main note Note error
        if isinstance(main_note_deleted, dict) and main_note_deleted != True:
            return Response(main_note_deleted, status=status.HTTP_401_UNAUTHORIZED)

        # 刪除成功
        return Response({"message": "Note deleted successfully"}, status=status.HTTP_200_OK)
        