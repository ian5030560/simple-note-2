# views.py
import sys
import os
import mimetypes

sys.path.append("..db_modules")

from db_modules import UserFileData
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import FileResponse
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

@permission_classes([AllowAny])
class ViewMediaFileView(APIView):
    """
    Method: get.\n

    """
    def get(self, request, username, noteId, filename, format=None):
        # create file path
        file_path = os.path.join(settings.BASE_DIR, 'db_modules', 'fileTemp', filename)
        
        # check if file exists
        if not os.path.exists(file_path):
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # check file type
        mime_type, _ = mimetypes.guess_type(file_path)
        
        if not mime_type:
            mime_type = 'application/octet-stream'
        
        checkExistValue = UserFileData.check_file_name(username, noteId, filename)
        # if exist, change name
        
        if checkExistValue == True:
            # open and read file
            try:
                return FileResponse(open(file_path, 'rb'), content_type=mime_type)
            
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        else:
            return Response({"error": 'File not found'}, status=status.HTTP_400_BAD_REQUEST)