# views.py
import sys
import json

sys.path.append("..db_modules")

from .serializers import *
from .models import UpdateInfo  # 新建檔案改這個
from db_modules import UserFileData  # 資料庫來的檔案
from db_modules import UserNoteData  # 資料庫來的檔案
from db_modules import UserPersonalInfo  # 資料庫來的檔案
from db_modules import UserPersonalThemeData  # 資料庫來的檔案
from rest_framework import status
from django.http import JsonResponse, HttpRequest
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware.csrf import get_token
import typing

"""@csrf_exempt"""
"""@csrf_protect"""

class ThemeDict(typing.TypedDict):
    id: str
    name: str

class UpdateInfoData(typing.TypedDict):
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
            }
    後端回傳:\n
        if image != "":
            Response HTTP_200_OK if success.\n
            Response HTTP_400_BAD_REQUEST if failure.\n
        if theme != "":
            Response HTTP_201_CREATED if success.\n
            Response HTTP_401_UNAUTHORIZED if failure.\n
        if password !=:
            Response HTTP_202_ACCEPTED if success.\n
            Response HTTP_402_PAYMENT_REQUIRED if failure.\n
    其他例外:\n
        Serializer的raise_exception=False: Response HTTP_404_NOT_FOUND,\n
        JSONDecodeError: Response HTTP_405_METHOD_NOT_ALLOWED.\n
    """

    serializer_class = UpdateInfoSerializer

    def get(self, request, format=None):
        output = [
            {"updateInfo": output.updateInfo} for output in UpdateInfo.objects.all()
        ]
        return Response("get")

    def post(self, request: HttpRequest, format=None):
        data: UpdateInfoBody = json.loads(request.body)
        print(data)
        print("---------------------------------------")
        username = data["username"]
        if(not username or not UserPersonalInfo.check_username(username)): return Response(status=status.HTTP_403_FORBIDDEN)
        innerData = data["data"]
        if("password" in innerData.keys()):
            password = innerData["password"]
            info = UserPersonalInfo.check_user_personal_info(username)
            if(info == False): return Response(status=status.HTTP_400_BAD_REQUEST)
            UserPersonalInfo.update_user_password_by_usernames(username, password)
                
        if("theme" in innerData.keys()):
            theme = innerData["theme"]
            isDefaultTheme = not theme["id"] and not theme["name"]
            if(isDefaultTheme):
                UserPersonalInfo.update_user_theme_id_by_usernames(username, theme["id"])
            else:
                checkThemeExist = UserPersonalThemeData.check_theme_name(username, theme["name"])
                if(not checkThemeExist): return Response(status=status.HTTP_400_BAD_REQUEST)
                sccuess = UserPersonalInfo.update_user_theme_id_by_usernames(username, theme["id"])
                print(sccuess)
                if(not sccuess): return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        return Response(status=status.HTTP_200_OK)
        # try:
        #     data = json.loads(request.body)
        #     username = data.get("username")  # 帳號名稱
        #     image = ""  # 預設頭像 = null
        #     theme = ""  # 預設name = null
        #     themeOldName = ""
        #     themeNewName = ""
        #     themeData = "" # 預設data = null
        #     password = ""  # 預設密碼 = null
        #     image = data.get("image")  # 更新的頭像
            
        #     theme = data.get('theme["data"]')  # 更新的主題
        #     if theme:         
        #         themeOldName = theme["oldName"]
        #         themeNewName = theme["newName"]
        #         themeData = theme["data"]
        #         if themeData:
        #             colorLightPrimary = themeData["colorLightPrimary"]
        #             colorLightNeutral = themeData["colorLightNeutral"]
        #             colorDarkPrimary = themeData["colorDarkPrimary"]
        #             colorDarkNeutral = themeData["colorDarkNeutral"]
        #     password = data.get("password")  # 更新的密碼

        #     # theme: {
        #     #    name: ,
        #     #    data 
        #     # }
            
        #     # 2024/5/7 缺check isNull
        #     if image != "":
        #         checkImageExist = UserPersonalInfo.check_profile_photo_by_username(username)
        #         if checkImageExist != False:
        #             print(1)
        #             insertImageValue = UserPersonalInfo.update_profile_photo_by_username(username, image)
        #         else:
        #             print(2)
        #             insertImageValue = UserPersonalInfo.insert_profile_photo_by_username(
        #                 username, image
        #             )
        #         if insertImageValue == True:
        #             return Response(status=status.HTTP_200_OK)
        #         else:
        #             return Response(
        #                 insertImageValue, status=status.HTTP_400_BAD_REQUEST
        #             )

        #     # 2024/5/14 缺check theme method
        #     # 2024/5/16 缺update theme name and data
        #     if theme != "":
        #         # 2024/5/21 不管
        #         # checkThemeExist = UserPersonalThemeData.check_theme_name(username, themeName)
        #         # if checkThemeExist == True: # theme exist
        #         #     insertThemeNameValue = UserPersonalThemeData.insert_theme_name_by_username(username, themeName)
        #         #     insertThemeDataValue = UserPersonalThemeData.insert_themeData_by_usernames(username, themeData)
        #         # else:s
        #         insertThemeValue = UserPersonalThemeData.insert_themeData_by_usernames(
        #             colorLightPrimary, colorLightNeutral, colorDarkPrimary, colorDarkNeutral
        #         )
        #         if insertThemeValue == 1:
        #             return Response(status=status.HTTP_201_CREATED)
        #         else:
        #             return Response(
        #                 insertThemeValue, status=status.HTTP_401_UNAUTHORIZED
        #             )

        #     if password != "":
        #         checkPasswordeExist = UserPersonalInfo.check_username_password(
        #             username, password
        #         )
        #         if checkPasswordeExist == 1:
        #             updatePassword = UserPersonalInfo.update_user_password_by_usernames(
        #             username, password
        #         )
        #             if updatePassword == True:
        #                 return Response(status=status.HTTP_202_ACCEPTED)
        #             else:
        #                 return Response(
        #                      status=status.HTTP_402_PAYMENT_REQUIRED
        #                 )
                    
        #     # serializer
        #     serializer = UpdateInfoSerializer(data=data)

        #     if serializer.is_valid(raise_exception=True):
        #         serializer.save()
        #         print("serializer is valid")
        #         return Response(serializer.data)

        #     elif serializer.is_valid(raise_exception=False):
        #         print("serializer is not valid", end="")
        #         print(serializer.errors)
        #         return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

        # # Handle JSON decoding error
        # except json.JSONDecodeError:
        #     username = None
        #     return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


def csrf(self, request):
    return JsonResponse({"csrfToken": get_token(request)})


def ping(self, request):
    return JsonResponse({"result": "OK"})
