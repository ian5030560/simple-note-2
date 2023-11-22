# views.py
import sys

sys.path.append("..db_modules")
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Signin
from db_modules.db import SigninData  # 資料庫來的檔案


class ReactView(APIView):
    """
    def get(self, request):
        output = [
            {"employee": output.employee, "department": output.department}
            for output in React.objects.all()
        ]
        return Response(output)"""

    def post(self, request):
        try:
            account = request.POST["account"]
            password = request.POST["password"]
        except KeyError:
            account = None
            password = None
        """if UserTable.validate(account, password) == True:
            return Response(True)
        else:
            return Response(False)"""
