# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import NewMediaFile  # 新建檔案改這個
from db_modules.db import DB  # 資料庫來的檔案
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

"""@csrf_exempt"""
"""@csrf_protect"""


class NewMediaFileView(APIView):
    """
    前端傳來:\n
        帳號名(name: username, type: str),\n
        文件名(name: filename, type: str),\n
        文件內容(name: content, type: blob),\n
        mimetype(name: mimetype, type: string).\n
    後端回傳:\n
        Str: localhost:8000/view_file/"filename", Response HTTP_200_OK.\n
        Str: sqlite error.\n
            insert content error: HTTP_400_BAD_REQUEST.\n
            insert mimetype error: HTTP_401_UNAUTHORIZED.\n

    其他例外:\n
        Serializer的raise_exception=False: Response HTTP_404_NOT_FOUND,\n
        JSONDecodeError: Response HTTP_405_METHOD_NOT_ALLOWED\n
    """

    serializer_class = NewMediaFileSerializer

    def get(self, request, format=None):
        output = [
            {"newMediaFile": output.newMediaFile}
            for output in NewMediaFile.objects.all()
        ]
        return Response("get")

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            username = data.get("username")  # 帳號名稱
            filename = data.get("filename")  # 文件名稱
            content = data.get("content")  # 文件內容
            mimetype = data.get("mimetype")  # 媒體種類
            db = DB()
            returnValue = db.update_User_File_Data_content_blob_and_content_mimetype(
                username, filename, content, mimetype
            )  # 透過content來新增資料
            print(returnValue)
            if returnValue == "Update successful !!!":
                url = (
                    "localhost:8000/viewMediaFile/"
                    + str(username)
                    + "/"
                    + str(filename)
                )
                return Response(url, status=status.HTTP_200_OK)

            elif returnValue != "Update successful !!!":
                returnValue = (
                    db.insert_User_File_Data_content_blob_and_content_mimetype(
                        username, filename, content, mimetype
                    )
                )
                if returnValue == "Insert successful !!!":
                    url = (
                        "localhost:8000/viewMediaFile/"
                        + str(username)
                        + "/"
                        + str(filename)
                    )
                    return Response(url, status=status.HTTP_201_CREATED)
                elif returnValue != "Insert successful !!!":
                    return Response(returnValue, status=status.HTTP_401_UNAUTHORIZED)

            # serializer
            serializer = NewMediaFileSerializer(data=data)

            if serializer.is_valid(raise_exception=True):
                serializer.save()
                print("serializer is valid")
                return Response(serializer.data)

            elif serializer.is_valid(raise_exception=False):
                print("serializer is not valid", end="")
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

            # close db connection
            db.close_connection()

        # Handle JSON decoding error
        except json.JSONDecodeError:
            username = None
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


def csrf(self, request):
    return JsonResponse({"csrfToken": get_token(request)})


def ping(self, request):
    return JsonResponse({"result": "OK"})