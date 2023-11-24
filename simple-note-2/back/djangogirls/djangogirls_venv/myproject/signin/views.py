# views.py
import sys

sys.path.append("..db_modules")
from rest_framework.response import Response
from .models import Signin
from db_modules.db import SigninData  # 資料庫來的檔案
from rest_framework import status


class SigninView:
    """
    def get(self, request, format=None):
        output = [
            {"employee": output.employee, "department": output.department}
            for output in React.objects.all()
        ]
        return Response(output)"""

    def post(self, request, format=None):
        try:
            account = request.POST["account"]
            password = request.POST["password"]
        except KeyError:
            account = None
            password = None
        return Response(status=status.HTTP_200_OK)
