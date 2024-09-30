import sys
import json
import requests

sys.path.append("..db_modules")

from .serializers import *
from .models import Breeze  # 新建檔案改這個
from rest_framework import status
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token

class BreezeView(APIView):
    """
    前端傳:\n
        指令.\n
    後端回傳:\n
        Response HTTP_200_OK if success.\n

    其他例外:\n
        Serializer的raise_exception=False: Response HTTP_404_NOT_FOUND,\n
        JSONDecodeError: Response HTTP_405_METHOD_NOT_ALLOWED\n
    """

    serializer_class = BreezeSerializer

    def ai(self, text):
        try:
            
            url = "http://localhost:8091"
            post_text = {
                "title": "",
                "content": text
            }
            headers = {
                "Content-Type": "application/json",
                "Authorization": "Bearer your_token"
            }

            # 發送 POST 請求
            response = requests.post(url, json=post_text, headers=headers)

            # 檢查回應
            if response.status_code == 200:
                # 嘗試將回應解析為 JSON 格式
                try:
                    result = response.json()
                    # print(type(result))
                    return result  # 返回解析後的 JSON 回應
                except ValueError:
                    # 如果回應不是 JSON 格式，直接返回原始文本內容
                    return response.text
            else:
                return f"Request failed with status code {response.status_code}"
        except Exception as e:
            return f'ai post error: {str(e)}'

        
        

    def get(self, request, format=None):
        output = [{"breeze": obj.breeze} for obj in Breeze.objects.all()]
        return Response(output)

    def post(self, request, format=None):
        try:
            data = json.loads(request.body)
            text = data.get("text")  # 文字內容
            
            # AI對話
            answer = self.ai(text)
            
            if answer:
                return Response(answer, status=status.HTTP_200_OK)
            
            # serializer
            serializer = BreezeSerializer(data=data)

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
