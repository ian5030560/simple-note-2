"""更新資料: 更新使用者資料(updateInfo)"""

import mimetypes
import os
import sys

from django.conf import settings
from django.http import FileResponse
from rest_framework import status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

sys.path.append("..db_modules")
from db_modules import UserFileData


@permission_classes([AllowAny])
class ViewMediaFileView(APIView):
    """
    Method: get.\n
    """

    def get(self, username, note_id, filename):
        """get方法。"""
        # create file path
        file_path = os.path.join(settings.BASE_DIR, "db_modules", "fileTemp", filename)

        # check if file exists
        if not os.path.exists(file_path):
            return Response(
                {"error": "File not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # check file type
        mime_type, _ = mimetypes.guess_type(file_path)

        if not mime_type:
            mime_type = "application/octet-stream"

        check_exist_value = UserFileData.check_file_name(username, note_id, filename)
        # if exist, change name

        if check_exist_value is True:
            # open and read file
            try:
                return FileResponse(open(file_path, "rb"), content_type=mime_type)

            except Exception as e:
                return Response(
                    {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        return Response({"error": "File not found"}, status=status.HTTP_400_BAD_REQUEST)
