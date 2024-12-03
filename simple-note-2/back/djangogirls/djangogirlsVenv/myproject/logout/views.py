# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import Logout
from db_modules import UserPersonalInfo
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

class LogoutView(APIView):
    """
    忘記密碼:\n
       \tLogout成功:200.\n

    其他例外:\n
        Serializer的raise_exception=False: 404.\n
        JSONDecodeError: 405.\n
    """

    serializer_class = LogoutSerializer

    def get(self, request, format=None):
        output = [{"logout": output.logout} for output in Logout.objects.all()]
        return Response("get")

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            username = data.get("username")
            updateStatus = UserPersonalInfo.update_user_login_status_by_usernames(
                username
            )
            if updateStatus == True:
                return Response(status=status.HTTP_200_OK)
            elif updateStatus != True:
                return Response(updateStatus, status=status.HTTP_400_BAD_REQUEST)
            serializer = LogoutSerializer(data=data)

            # serializer
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
