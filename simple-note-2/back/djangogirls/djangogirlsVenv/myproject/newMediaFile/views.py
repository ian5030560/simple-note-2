"""新增檔案: 筆記中新增檔案(newMediaFile)"""

import sys

from django.http import HttpRequest, HttpResponse
from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

sys.path.append("..db_modules")
from db_modules import UserFileData
from db_modules.SaveFile import SaveFile


@permission_classes([AllowAny])
class NewMediaFileView(APIView):
    """
    前端傳來:\n
        帳號名(name: username, type: str),\n
        文件名(name: filename, type: str),\n
        文件內容(name: content, type: blob),\n
        note_id(name: note_id, type: string).\n

    後端回傳:\n
        Str: localhost:8000/view_file/"filename", 200.\n
        Str: insert error, 400.\n

    輸入資料為空:\n
        Response 401.\n
    """

    def get(self):
        """Get 方法"""
        return Response("get")

    def post(self, request: HttpRequest):
        """Post 方法"""
        data = request.POST
        username = data.get("username")  # 帳號名稱
        filename = data.get("filename")  # 文件名稱
        content = request.FILES.get("content")  # 文件內容
        if content is None:
            return Response(
                {"error": "File content  is missing."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        note_id = data.get("noteId")  # note Id

        # 指定save file的路徑
        saver = SaveFile("db_modules/fileTemp")

        # db check if exist
        check_exist_value = UserFileData.check_file_name(username, note_id, filename)

        # if exist, change name
        if check_exist_value is True:
            filename = saver.renameAganistDumplication(filename)

        # db save info
        db_saved = UserFileData.insert_file_name(username, note_id, filename)

        # 儲存文件
        folder_saved = saver.saveNewFile(filename, content)

        if db_saved and folder_saved is True:
            url = f"{request.scheme}://{request.get_host()}/media/{username}/{note_id}/{filename}"
            return HttpResponse(url, status=200)

        return Response(db_saved, status=status.HTTP_400_BAD_REQUEST)
