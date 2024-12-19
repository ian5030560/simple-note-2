# views.py
import sys
import json

sys.path.append("..db_modules")

from .models import NewMediaFile  # 新建檔案改這個
from db_modules import UserFileData  # 資料庫來的檔案
from db_modules.SaveFile import SaveFile  # 資料庫來的檔案
from rest_framework import status
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

@permission_classes([AllowAny])
class NewMediaFileView(APIView):
    """
    前端傳來:\n
        帳號名(name: username, type: str),\n
        文件名(name: filename, type: str),\n
        文件內容(name: content, type: blob),\n
        mimetype(name: mimetype, type: string).\n

    後端回傳:\n
        Str: localhost:8000/view_file/"filename", 200.\n
        Str: insert error, 400.\n
    
    輸入資料為空:\n
        Response 401.\n
    """
    def get(self, request, format=None):
        output = [
            {"newMediaFile": output.newMediaFile}
            for output in NewMediaFile.objects.all()
        ]
        return Response("get")

    def post(self, request, format=None):
        data = request.POST
        username = data.get("username")  # 帳號名稱
        filename = data.get("filename")  # 文件名稱
        content = request.FILES.get("content")  # 文件內容
        if content is None:
            return Response({"error": "File content  is missing."}, status=status.HTTP_401_UNAUTHORIZED)
        noteId = data.get("noteId") # note Id

        # 指定save file的路徑
        saver = SaveFile('db_modules/fileTemp')
        
        # db check if exist
        checkExistValue = UserFileData.check_file_name(username, noteId, filename)
        
        # if exist, change name
        if checkExistValue == True:
            filename = saver.renameAganistDumplication(filename)
        
        # db save info
        dbSaved = UserFileData.insert_file_name(username, noteId, filename)

        # 保存一个新文件
        folderSaved = saver.saveNewFile(filename, content)
        
        if dbSaved and folderSaved == True:
            url = f"http://localhost:8000/media/{username}/{noteId}/{filename}"
            return HttpResponse(url, status=200)

        elif dbSaved or folderSaved != True:
            return Response(dbSaved, status=status.HTTP_400_BAD_REQUEST)