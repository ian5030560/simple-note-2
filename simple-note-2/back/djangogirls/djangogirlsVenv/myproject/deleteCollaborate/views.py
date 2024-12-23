"""取消協作: 將協作網址刪除(deleteCollaborate)"""

import json
import sys

from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

sys.path.append("..db_modules")
from db_modules import UserCollaborateNote


@permission_classes([AllowAny])
class DeleteCollaborateView(APIView):
    """
    前端傳:\n
        帳號名(username, type: str)\n
        筆記id(noteId, type: str)\n

    後端傳:\n
        200: 成功.\n
        400: 失敗.\n
    """

    def get(self):
        """Get 方法"""
        return Response("get")

    def post(self, request):
        """Post 方法"""
        data = json.loads(request.body)
        master_name = data.get("masterName")  # master帳號名稱
        note_id = data.get("noteId")  # noteTitleId

        is_delete = UserCollaborateNote.delete_all_data(master_name, note_id)

        if is_delete:  # 若刪除成功
            return Response(status=status.HTTP_200_OK)

        # 若刪除失敗
        return Response(status=status.HTTP_400_BAD_REQUEST)
