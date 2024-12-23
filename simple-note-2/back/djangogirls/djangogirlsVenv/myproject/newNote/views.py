"""新增筆記: 新增使用者筆記(newNote)"""

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
class NewNoteView(APIView):
    """
    前端傳: \n
        帳號名(name: username, type: str)\n
        筆記id(name: noteId, type: str)\n
        筆記名稱(name: noteame, type: str)\n

    後端回:\n
        成功: 200.\n
        失敗: 400.\n

    輸入資料為空:\n
        Response 401.\n
    """

    def get(self):
        """Get 方法"""
        return Response("get")

    def post(self, request):
        """Post 方法"""
        data = json.loads(request.body)
        username = data.get("username")  # 帳號名稱
        note_id = data.get("noteId")  # 筆記ID
        notename = data.get("notename")  # 筆記名稱
        parent_id = data.get("parentId")  # 父筆記名稱
        silbling_id = data.get("silblingId")  # 兄弟筆記名稱

        if username is None or note_id is None or notename is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        # 透過username, notename, note_id來新增資料
        return_status = UserNoteData.insert_user_id_note_name(
            username, notename, note_id
        )

        # 透過note_id, parent_id, silbling_id來新增subnote資料
        sub_return_status = UserSubNoteData.insert_data(note_id, parent_id, silbling_id)

        if return_status and sub_return_status:  # 新增成功
            return Response(status=status.HTTP_200_OK)

        # 新增失敗
        return Response(
            [return_status, sub_return_status], status=status.HTTP_400_BAD_REQUEST
        )
