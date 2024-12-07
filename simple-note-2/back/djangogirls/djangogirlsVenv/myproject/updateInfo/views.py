# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import UpdateInfo
from db_modules import UserPersonalInfo
from db_modules import UserPersonalThemeData
from rest_framework import status
from django.http import JsonResponse, HttpRequest
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token
import typing

class ThemeDict(typing.TypedDict):
    id: str
    name: str

class UpdateInfoData(typing.TypedDict):
    image: str | None
    password: str | None
    theme: ThemeDict | None
    
class UpdateInfoBody(typing.TypedDict):
    username: str
    data: UpdateInfoData
    
class UpdateInfoView(APIView):
    """
    更新個人資訊:update_info\n

    前端傳:\n
        帳號名(username, type: str),\n
        更新的資料(name: data, type: Info, 若Info中的項目為null, ignore it).\n
        type: Info {
            頭像(name: image): 文件網址(string),
            主題(name: theme): Theme,
            密碼(name: password): string
            }\n

    後端回傳:\n
        if image != "":\n
            Response 200 if success.\n
            Response 400 if failure.\n
        if theme != "":\n
            Response 201 if success.\n
            Response 401 if failure.\n
        if password !=:\n
            Response 202 if success.\n
            Response 402 if failure.\n

    其他例外:\n
        Serializer的raise_exception=False: 404,\n
        JSONDecodeError: 405.\n
    """

    serializer_class = UpdateInfoSerializer

    def get(self, request, format=None):
        output = [
            {"updateInfo": output.updateInfo} for output in UpdateInfo.objects.all()
        ]
        return Response("get")

    def post(self, request: HttpRequest, format=None):
        data: UpdateInfoBody = json.loads(request.body)

        username = data["username"]
        if(not username or not UserPersonalInfo.check_username(username)): return Response(status=status.HTTP_403_FORBIDDEN)
        innerData = data["data"]
        
        if(innerData["image"]):
            image = innerData["image"]
            checkImageExist = UserPersonalInfo.check_profile_photo_by_username(username)
            insertImageValue: bool
            if(checkImageExist == False):
                insertImageValue = UserPersonalInfo.insert_profile_photo_by_username(username, image)
            else:
                insertImageValue = UserPersonalInfo.update_profile_photo_by_username(username, image)
            if(not insertImageValue): return Response(status=status.HTTP_417_EXPECTATION_FAILED)
            
        if(innerData["password"]):
            password = innerData["password"]
            info = UserPersonalInfo.check_user_personal_info(username)
            if(info == False): return Response(status=status.HTTP_400_BAD_REQUEST)
            
            import hashlib
            addr = hashlib.sha256()
            b_password = bytes(password, encoding='utf-8')
            addr.update(b_password)
            hash_hexdigest = addr.hexdigest()
            
            UserPersonalInfo.update_user_password_by_usernames(username, hash_hexdigest)
            
        if(innerData["theme"]):
            theme = innerData["theme"]
            isDefaultTheme = not theme["id"] and not theme["name"]
            if(isDefaultTheme):
                UserPersonalInfo.update_user_theme_id_by_usernames(username, theme["id"])
            else:
                checkThemeExist = UserPersonalThemeData.check_theme_name(username, theme["name"])
                if(not checkThemeExist): return Response(status=status.HTTP_400_BAD_REQUEST)
                sccuess = UserPersonalInfo.update_user_theme_id_by_usernames(username, theme["id"])
                if(not sccuess): return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        return Response(status=status.HTTP_200_OK)

def csrf(self, request):
    return JsonResponse({"csrfToken": get_token(request)})


def ping(self, request):
    return JsonResponse({"result": "OK"})
