"""發起協作: 發起協作筆記(newCollaborate)"""

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
class NewCollaborateView(APIView):
    """
    前端傳:\n
        帳號名(username, type: str),\n
        筆記id(noteId, type: str),\n
        協作網址(url, type: str)\n

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
        master_name = data.get("username")  # master帳號名稱
        note_id = data.get("noteId")  # noteTitleId
        url = data.get("url")  # 協作網址

        # join collaborate by master_name, note_title_id, master_name
        is_new = UserCollaborateNote.insert_newData(
            master_name, note_id, master_name, url
        )

        if is_new:  # 加入成功
            return Response(status=status.HTTP_200_OK)

        # 加入失敗
        return Response(status=status.HTTP_400_BAD_REQUEST)
