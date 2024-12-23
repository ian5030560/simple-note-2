"""取得筆記: 取得使用者筆記資訊(getNote)"""

import json
import sys

from django.http import HttpResponse
from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

sys.path.append("..db_modules")
from db_modules import UserNoteData


@permission_classes([AllowAny])
class GetNoteView(APIView):
    """
    前端傳: \n
        帳號名(name: username, type: str)\n
        筆記id(name: noteId, type: str)\n

    後端回:\n
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
        note_id = data.get("noteId")  # 筆記ID

        return_note_content = UserNoteData.check_content(
            username, note_id
        )  # 透過noteId來取得資料
        if return_note_content:
            return_note_content = return_note_content[0]

        if return_note_content is not False:  # 取得成功
            return HttpResponse(
                return_note_content,
                status=(
                    status.HTTP_200_OK
                    if return_note_content
                    else status.HTTP_204_NO_CONTENT
                ),
                content_type="text/plain",
            )

        # error
        return Response(status=status.HTTP_400_BAD_REQUEST)
