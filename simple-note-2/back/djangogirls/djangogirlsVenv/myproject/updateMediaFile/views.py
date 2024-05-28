# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import UpdateMediaFile  # 新建檔案改這個
from db_modules import UserFileData  # 資料庫來的檔案
from db_modules import UserNoteData  # 資料庫來的檔案
from db_modules import UserPersonalInfo  # 資料庫來的檔案
from db_modules import UserPersonalThemeData  # 資料庫來的檔案
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

"""@csrf_exempt"""
"""@csrf_protect"""


class UpdateMediaFileView(APIView):
    """
    前端傳:\n
        帳號名(username, type: str),\n
        文件網址(新增文件所提供的網址, type: str),\n
        文件內容(content, type: blob).\n
    後端回傳:\n
        Response HTTP_200_OK if success if true.\n
        Response HTTP_400_BAD_REQUEST if false.\n
    其他例外:\n
        Serializer的raise_exception=False: Response HTTP_404_NOT_FOUND,\n
        JSONDecodeError: Response HTTP_405_METHOD_NOT_ALLOWED.\n
    """

    serializer_class = UpdateMediaFileSerializer

    def get(self, request, format=None):
        output = [
            {"updateMediaFile": output.updateMediaFile}
            for output in UpdateMediaFile.objects.all()
        ]
        return Response("get")

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            username = data.get("username")  # 帳號名稱
            url = data.get("url")  # 文件網址
            content = data.get("content")  # 文件內容
            mimetype = data.get("mimetype")  # 文件型態

            # 更新帳號名稱所屬文件網址之內容
            # 將網址前贅詞刪除，留下filename
            filename = url.replace("localhost:8000/viewMediaFile/", "")

            returnValueInsertContent = (
                UserFileData.update_content_blob_mimetype_by_usernames_note_name(
                    username, filename, content, mimetype
                )
            )  # 透過content來新增資料

            if returnValueInsertContent:  # 新增成功(透過content, mimetype都成功)
                return Response(filename, status=status.HTTP_200_OK)

            elif returnValueInsertContent != True:  # 透過content新增失敗
                return Response(
                    "error = ",
                    returnValueInsertContent,
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # serializer
            serializer = UpdateMediaFileSerializer(data=data)

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
