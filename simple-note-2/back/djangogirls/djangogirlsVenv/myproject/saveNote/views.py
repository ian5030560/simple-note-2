"""儲存筆記樹: 儲存使用者筆記(saveNote)"""

import json
import sys

from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

sys.path.append("..db_modules")
from db_modules import UserNoteData


@permission_classes([AllowAny])
class SaveNoteView(APIView):
    """
    前端傳:\n
        帳號名(name: username, type: str)\n
        筆記id(name: noteId, type: str)\n
        筆記內容(name: content, type: str)\n

    後端回: \n
        200 if OK.\n
        400 if not OK.\n

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
        content = data.get("content")  # 筆記內容

        if username is None or note_id is None or content is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        return_status = UserNoteData.update_content(
            username, note_id, content
        )  # 透過username, note_id, content來更新資料

        if return_status:  # 更新成功
            return Response(status=status.HTTP_200_OK)

        # error
        return Response(return_status, status=status.HTTP_400_BAD_REQUEST)
