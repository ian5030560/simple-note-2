# views.py
import sys

sys.path.append("..db_modules")
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.request import Request
from .models import React
from .serializer import ReactSerializer
from db_modules.db import SigninData  # 資料庫來的檔案

"""
class ReactView(APIView):

    serializer_class = ReactSerializer

    def get(self, request):
        output = [
            {"employee": output.employee, "department": output.department}
            for output in React.objects.all()
        ]
        return Response(output)

    def post(self, request):
        serializer = ReactSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
"""
