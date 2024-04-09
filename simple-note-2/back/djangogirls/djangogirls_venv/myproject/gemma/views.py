import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import Gemma  # 新建檔案改這個
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

class GemmaView(APIView):
    """
    前端傳:\n
        指令.\n
    後端回傳:\n
        Response HTTP_200_OK if success.\n

    其他例外:\n
        Serializer的raise_exception=False: Response HTTP_404_NOT_FOUND,\n
        JSONDecodeError: Response HTTP_405_METHOD_NOT_ALLOWED\n
    """

    serializer_class = GemmaSerializer

    def get(self, request, format=None):
        output = [{"gemma": obj.gemma} for obj in Gemma.objects.all()]
        return Response(output)

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            text = data.get("text")  # 文字內容
            
            import ollama

            answer = (((ollama.chat(model="gemma", messages=[{"role": "user", "content": text}]))["message"])["content"])
            if answer:
                return Response(answer, status=status.HTTP_200_OK)
            
            # serializer
            serializer = GemmaSerializer(data=data)

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
            text = None
            return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def csrf(self, request):
        return JsonResponse({"csrfToken": get_token(request)})

    def ping(self, request):
        return JsonResponse({"result": "OK"})
