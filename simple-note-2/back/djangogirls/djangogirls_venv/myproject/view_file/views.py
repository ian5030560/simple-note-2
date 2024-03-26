# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import ViewFile  # 新建檔案改這個
from db_modules.db import DB  # 資料庫來的檔案
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

"""@csrf_exempt"""
"""@csrf_protect"""


class ViewFileView(APIView):
    """
    Method: get.\n
    其他例外:\n
        serializer的raise_exception=False: Response HTTP_404_NOT_FOUND,\n
        JSONDecodeError: Response HTTP_405_METHOD_NOT_ALLOWED.\n
    """

    serializer_class = ViewFileSerializer

    def getUsername(self, username):
        return username

    def getFilename(self, filename):
        return filename

    def get(self, request, username, filename, format=None):
        db = DB()
        output = [{"view_file": output.view_file} for output in ViewFile.objects.all()]
        self.getUsername(username)
        self.getFilename(filename)

        # 將content和mimetype預設為空
        content = ""
        mimetype = ""
        # 將content和mimetype從DB回傳
        content = db.username_file_name_return_content_blob(username, filename)
        mimetype = db.username_file_name_return_content_mimetype(username, filename)
        if 1:  # 資料庫條件
            file_data = content + mimetype
            return Response(file_data, status=status.HTTP_200_OK)
        # close db connection
        db.close_connection()

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)

            # serializer
            serializer = ViewFileSerializer(data=data)

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
