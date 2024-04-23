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

    def get(self, request, username, filename, format=None):
        db = DB()

        # Retrieve content and mimetype from the database
        content = db.username_note_name_return_content_blob(username, filename)
        mimetype = db.username_note_name_return_content_mimetype(username, filename)

        # Check if content and mimetype are not None
        if content is not None and mimetype is not None:
            # Combine content and mimetype
            file_data = content + mimetype
            # Return response with the file data
            return Response(file_data, status=status.HTTP_200_OK)
        elif content is None or mimetype is None:
            # If data not found, return HTTP 404 response
            return Response("File not found", status=status.HTTP_404_NOT_FOUND)

        # Close db connection
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
