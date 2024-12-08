# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import NewMediaFile  # 新建檔案改這個
from db_modules import UserFileData  # 資料庫來的檔案
from db_modules.SaveFile import SaveFile  # 資料庫來的檔案
from rest_framework import status, permissions
from django.http import JsonResponse, HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

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

    其他例外:\n
        Serializer的raise_exception=False: 404.\n
        JSONDecodeError: 405.\n
    """
    permission_classes = [permissions.AllowAny]
    serializer_class = NewMediaFileSerializer

    def get(self, request, format=None):
        output = [
            {"newMediaFile": output.newMediaFile}
            for output in NewMediaFile.objects.all()
        ]
        return Response("get")

    def post(self, request, format=None):
        try:
            # data = json.loads(request.body)
            data = request.POST

            username = data.get("username")  # 帳號名稱
            filename = data.get("filename")  # 文件名稱
            content = request.FILES.get("content")  # 文件內容
            noteId = data.get("noteId")

            print(username, filename, content, noteId)
            content = content.read()

            # 创建一个 SaveFile 实例，并指定保存文件的文件夹路径
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
            print(folderSaved)
            if dbSaved and folderSaved == True:
                url = f"http://localhost:8000/media/{username}/{noteId}/{filename}"
                return HttpResponse(url, status=200)

            elif dbSaved or folderSaved != True:
                return Response(dbSaved, status=status.HTTP_400_BAD_REQUEST)

            # serializer
            serializer = NewMediaFileSerializer(data=request.POST)

            if serializer.is_valid(raise_exception=True):
                serializer.save()
                print("serializer is valid")
                return Response(serializer.data)

            elif serializer.is_valid(raise_exception=False):
                print("serializer is not valid", end="")
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

        # Handle JSON decoding error
        except json.JSONDecodeError:
            username = None
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

def csrf(self, request):
    return JsonResponse({"csrfToken": get_token(request)})


def ping(self, request):
    return JsonResponse({"result": "OK"})