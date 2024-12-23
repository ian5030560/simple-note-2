"""刪除檔案: 將檔案刪除(deleteFile)"""

import json
import sys

from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

sys.path.append("..db_modules")
from db_modules import UserFileData


@permission_classes([AllowAny])
class DeleteFileView(APIView):
    """
    前端傳:\n
        帳號名(name: username, type: str)\n
        文件網址(name: url(新增文件所提供的網址), type: str)\n
        帳號名稱(noteTitleId, type: str)\n

    後端回傳:\n
        200 if success.\n
        400 if failure.\n
    """

    def get(self):
        """Get 方法"""
        return Response("get")

    def post(self, request):
        """Post 方法"""
        data = json.loads(request.body)
        username = data.get("username")  # 帳號名稱
        note_title_id = data.get("note_title_id")  # 帳號名稱
        url = data.get("url")  # 要刪除的文件網址

        if not username or not note_title_id or not url:
            return Response(
                {"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST
            )

        # 刪除帳號名稱所屬文件
        # 將網址前贅詞刪除，留下filename
        url.replace("http://localhost:8000/viewMediaFile/", "")

        # 呼叫資料庫的刪除方法
        delete_file_value = UserFileData.delete_file_name(username, note_title_id, url)

        if delete_file_value is True:  # 若刪除成功
            return Response(status=status.HTTP_200_OK)

        # 若刪除失敗
        return Response(delete_file_value, status=status.HTTP_400_BAD_REQUEST)
