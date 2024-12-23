import json
from unittest.mock import patch

from rest_framework import status
from rest_framework.test import APITestCase


class UpdateInfoViewTest(APITestCase):
    def setUp(self):
        """設置測試環境"""
        self.url = "http://localhost:8000/info/get/"  # 用來測試的API端點
        self.username = "testuser"  # 測試用的用戶名
        # 測試用的有效資料，包含用戶名、圖像、密碼和主題
        self.valid_payload = {
            "username": self.username,  # 用戶名
            "data": {
                "image": "http://localhost:8000/media/testuser/1/GbtVktabMAA-FYo.jpg/",  # 圖像URL
                "password": "testuser",  # 密碼
                "theme": {"id": "1", "name": "light"},  # 主題資料
            },
        }
        # 測試用的空圖像資料，圖像為None
        self.empty_image_payload = {
            "username": self.username,  # 用戶名
            "data": {
                "image": None,  # 圖像為空
                "password": "testuser",  # 密碼
                "theme": {"id": "1", "name": "light"},  # 主題資料
            },
        }
        # 測試用的無效主題資料，主題ID為None，名稱為不存在的主題
        self.invalid_theme_payload = {
            "username": self.username,  # 用戶名
            "data": {
                "image": "http://localhost:8000/media/testuser/1/GbtVktabMAA-FYo.jpg/",  # 圖像URL
                "password": "testuser",  # 密碼
                "theme": {"id": None, "name": "Nonexistent Theme"},  # 無效的主題
            },
        }

    @patch("db_modules.UserPersonalInfo.check_username")
    @patch("db_modules.UserPersonalInfo.check_profile_photo_by_username")
    @patch("db_modules.UserPersonalInfo.insert_profile_photo_by_username")
    @patch("db_modules.UserPersonalInfo.update_user_password_by_usernames")
    @patch("db_modules.UserPersonalThemeData.check_theme_name")
    @patch("db_modules.UserPersonalInfo.update_user_theme_id_by_usernames")
    def test_update_info_success(
        self,
        mock_update_theme,
        mock_check_theme,
        mock_update_password,
        mock_insert_image,
        mock_check_image,
        mock_check_username,
    ):
        """測試成功更新所有欄位"""
        mock_check_username.return_value = True  # 模擬用戶名檢查通過
        mock_check_image.return_value = False  # 模擬圖像檢查結果為無圖像
        mock_insert_image.return_value = True  # 模擬圖像更新成功
        mock_update_password.return_value = True  # 模擬密碼更新成功
        mock_check_theme.return_value = True  # 模擬主題名稱檢查通過
        mock_update_theme.return_value = True  # 模擬主題更新成功

        # 發送POST請求，更新所有資料
        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),  # 使用有效資料
            content_type="application/json",  # 設置內容類型為JSON
        )
        self.assertEqual(
            response.status_code, status.HTTP_200_OK
        )  # 檢查回應狀態碼是否為200

    @patch("db_modules.UserPersonalInfo.check_username")
    @patch("db_modules.UserPersonalInfo.insert_profile_photo_by_username")
    def test_update_image_only(self, mock_insert_image, mock_check_username):
        """測試只更新圖像"""
        mock_check_username.return_value = True  # 模擬用戶名檢查通過
        mock_insert_image.return_value = True  # 模擬圖像更新成功

        # 發送POST請求，僅更新圖像
        payload = {
            "username": self.username,  # 用戶名
            "data": {
                "image": "http://localhost:8000/media/testuser/1/GbtVktabMAA-FYo.jpg/",  # 更新圖像URL
                "password": None,  # 密碼為空
                "theme": None,  # 主題為空
            },
        }
        response = self.client.post(
            self.url,
            data=json.dumps(payload),  # 使用圖像更新資料
            content_type="application/json",  # 設置內容類型為JSON
        )
        self.assertEqual(
            response.status_code, status.HTTP_200_OK
        )  # 檢查回應狀態碼是否為200

    @patch("db_modules.UserPersonalInfo.check_username")
    @patch("db_modules.UserPersonalInfo.check_profile_photo_by_username")
    def test_update_existing_image(self, mock_check_image, mock_check_username):
        """測試更新已存在的圖像"""
        mock_check_username.return_value = True  # 模擬用戶名檢查通過
        mock_check_image.return_value = True  # 模擬檢查到已存在的圖像

        # 發送POST請求，更新已存在的圖像
        payload = {
            "username": self.username,  # 用戶名
            "data": {
                "image": "http://localhost:8000/media/testuser/1/GbtVktabMAA-FYo.jpg/",  # 更新圖像URL
                "password": None,  # 密碼為空
                "theme": None,  # 主題為空
            },
        }
        response = self.client.post(
            self.url,
            data=json.dumps(payload),  # 使用圖像更新資料
            content_type="application/json",  # 設置內容類型為JSON
        )
        self.assertEqual(
            response.status_code, status.HTTP_200_OK
        )  # 檢查回應狀態碼是否為200
