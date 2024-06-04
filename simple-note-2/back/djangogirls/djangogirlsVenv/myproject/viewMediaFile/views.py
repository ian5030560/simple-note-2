# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import ViewMediaFile  # 新建檔案改這個
from db_modules import UserFileData  # 資料庫來的檔案
from db_modules import UserNoteData  # 資料庫來的檔案
from db_modules import UserPersonalInfo  # 資料庫來的檔案
from db_modules import UserPersonalThemeData  # 資料庫來的檔案
from rest_framework import status
from django.http import HttpResponse, JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token
import base64
"""@csrf_exempt"""
"""@csrf_protect"""


class ViewMediaFileView(APIView):
    """
    Method: get.\n
    其他例外:\n
        serializer的raise_exception=False: Response HTTP_404_NOT_FOUND,\n
        JSONDecodeError: Response HTTP_405_METHOD_NOT_ALLOWED.\n
    """

    serializer_class = ViewMediaFileSerializer

    def get(self, request, username, notename, filename, format=None):

        # Retrieve content and mimetype from the database
        content = UserFileData.check_content_blob_mimetype(username, notename, filename)[0]
        mimetype = UserFileData.check_content_blob_mimetype(username, notename, filename)[1]

        if content is not None and mimetype is not None:
            response = HttpResponse(content, status=status.HTTP_200_OK, content_type=mimetype)

        elif content is None or mimetype is None:
            # If data not found, return HTTP 404 response
            return Response("File not found", status=status.HTTP_404_NOT_FOUND)

        return response
    def post(self, request, format=None):
        try:
            data = json.loads(request.body)

            # serializer
            serializer = ViewMediaFileSerializer(data=data)

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
