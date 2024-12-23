"""加入協作: 加入協作筆記(joinCollaborate)"""

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
class JoinCollaborateView(APIView):
    """
    前端傳:\n
        帳號名(username, type: str),\n
        協作網址(url, type: str),\n

    後端傳:\n
        筆記內容(type: str), 200: 成功.\n
        400: 失敗.\n
    """

    def get(self):
        """Get 方法"""
        return Response("get")

    def post(self, request):
        """Post 方法"""
        data = json.loads(request.body)
        guest_name = data.get("username")  # guest帳號名稱
        master_name = data.get("mastername")  # master帳號名稱
        note_id = data.get("noteId")  # noteTitleId
        url = data.get("url")  # 協作網址

        # find all joined guest to check if they are already in the collaborate
        joined_users = UserCollaborateNote.check_all_guest(master_name, note_id)

        if not joined_users:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        exist = False
        user: tuple[str]
        for user in joined_users:
            name = user[0]
            if name == guest_name:
                exist = True
                break

        if exist:
            return Response(status=status.HTTP_200_OK)

        is_join = UserCollaborateNote.insert_newData(
            master_name, note_id, guest_name, url
        )

        if is_join:  # 加入成功
            return Response(status=status.HTTP_201_CREATED)

        # 加入失敗
        return Response(status=status.HTTP_401_UNAUTHORIZED)
