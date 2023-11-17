# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import YourModel
import json


@csrf_exempt  # 仅用于示例，实际项目中可能需要更严格的CSRF保护
def receive_data(request):
    if request.method == "POST":
        data = json.loads(request.body.decode("utf-8"))
        your_data = data.get("your_field", "")

        # 在这里可以保存到数据库或进行其他处理
        YourModel.objects.create(your_field=your_data)

        return JsonResponse({"message": "Data received successfully!"})

    return JsonResponse({"error": "Invalid request method"})
