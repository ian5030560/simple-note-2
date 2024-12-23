"""刪除筆記: 將筆記刪除(deleteNote)"""

import json
import sys

from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

sys.path.append("..db_modules")
from db_modules import UserNoteData, UserSubNoteData


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

    def get(self):
        """Get 方法"""
        return Response("get")

    def post(self, request):
        """Post 方法"""
        data = json.loads(request.body)
        if not all(key in data for key in ("username", "noteId")):
            return Response(
                {"error": "Missing required fields"},
                status=status.HTTP_402_PAYMENT_REQUIRED,
            )

        username = data.get("username")  # 帳號名稱
        note_id = data.get("noteId")  # 筆記ID

        sub_note_deleted = UserSubNoteData.delete_data(
            note_id
        )  # 透過noteId來刪除sub note資料
        # delete sub note Data error
        if isinstance(sub_note_deleted, dict) and sub_note_deleted is not True:
            return Response(sub_note_deleted, status=status.HTTP_400_BAD_REQUEST)

        main_note_deleted = UserNoteData.delete_note_by_usernames_note_title_id(
            username, note_id
        )  # delete main note
        # delete main note Note error
        if isinstance(main_note_deleted, dict) and main_note_deleted is not True:
            return Response(main_note_deleted, status=status.HTTP_401_UNAUTHORIZED)

        # 刪除成功
        return Response(
            {"message": "Note deleted successfully"}, status=status.HTTP_200_OK
        )
