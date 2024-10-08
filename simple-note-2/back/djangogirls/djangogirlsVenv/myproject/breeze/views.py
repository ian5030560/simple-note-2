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
            # url = "http://127.0.0.1:8091/"  # 確認這個端點正確
            url = "https://85a3-140-127-74-150.ngrok-free.app/"
            post_text = {
                "title": "",
                "content": text
            }
            headers = {
                "Content-Type": "application/json",
                # "Accept": "*/*",
                # "Accept-Encoding": "gzip, deflate, br",
                # "Connection": "keep-alive"
            }

            # 發送 POST 請求
            response = requests.post(url, json=post_text, headers=headers)
            response.close()
            # Debug print to see the response status and content
            print(f"Response status: {response.status_code}")
            print(f"Response content: {response.text}")

            # 檢查回應是否在成功範圍內
            if 200 <= response.status_code < 300:
                # 嘗試將回應解析為 JSON 格式
                try:
                    result = response.json()
                    print("Parsed JSON result:", result)
                    return result  # 返回解析後的 JSON 回應
                except ValueError:
                    # 如果回應不是 JSON 格式，直接返回原始文本內容
                    print("Response is not in JSON format.")
                    return response.text
            else:
                return f"Request failed with status code {response.status_code}"

        except requests.RequestException as e:
            # 捕獲 requests 的例外情況並打印具體的錯誤訊息
            print(f"Request exception occurred: {str(e)}")
            return f"ai post error: {str(e)}"

        
        

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
