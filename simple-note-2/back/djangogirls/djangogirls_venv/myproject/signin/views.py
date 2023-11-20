# views.py
import sys

sys.path.append("..db_module")
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.request import Request
from .models import React
from .serializer import ReactSerializer
from db_module.db import DB


class ReactView(APIView):
    def get(self, request):
        output = [
            {"employee": output.employee, "department": output.department}
            for output in React.objects.all()
        ]
        return Response(output)

    def post(self, request):
        try:
            email = request.POST["email"]
        except KeyError:
            email = None
        if email == #DB比對路徑:

            return Response(True)
        else:
            return Response(False)
