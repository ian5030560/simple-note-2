# test_views.py
import json
from unittest.mock import patch

from rest_framework import status
from rest_framework.test import APITestCase


class GetThemeViewTests(APITestCase):

    def setUp(self):
        """設置測試環境"""
        self.url = "http://localhost:8000/theme/get/"  # API的URL
        self.valid_username = "testuser"  # 有效的測試用戶名
        self.invalid_username = "invaliduser"  # 無效的測試用戶名

    @patch("db_modules.UserPersonalInfo.check_username")  # 模擬check_username方法
    @patch(
        "db_modules.UserPersonalThemeData.check_all_theme_data"
    )  # 模擬check_all_theme_data方法
    def test_post_valid_request(self, mock_check_all_theme_data, mock_check_username):
        """測試POST請求，使用有效的用戶名"""

        # 模擬check_username方法，返回True表示用戶名有效
        mock_check_username.return_value = True

        # 模擬check_all_theme_data方法，返回主題資料
        mock_check_all_theme_data.return_value = [
            (1, "light", "5", "5", "5", "5"),
            (2, "green", "2", "3", "4", "5"),
            (3, "blue", "1", "2", "3", "4"),
        ]

        data = {"username": self.valid_username}  # 設定有效的用戶名資料
        response = self.client.post(
            self.url, json.dumps(data), content_type="application/json"
        )  # 發送POST請求

        # 檢查回應狀態碼是否為200（OK）
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # 檢查回應內容是否為預期的主題資料
        self.assertEqual(
            response.json(),
            [
                {
                    "id": 1,
                    "name": "light",
                    "data": {
                        "colorLightPrimary": "5",
                        "colorLightNeutral": "5",
                        "colorDarkPrimary": "5",
                        "colorDarkNeutral": "5",
                    },
                },
                {
                    "id": 2,
                    "name": "green",
                    "data": {
                        "colorLightPrimary": "2",
                        "colorLightNeutral": "3",
                        "colorDarkPrimary": "4",
                        "colorDarkNeutral": "5",
                    },
                },
                {
                    "id": 3,
                    "name": "blue",
                    "data": {
                        "colorLightPrimary": "1",
                        "colorLightNeutral": "2",
                        "colorDarkPrimary": "3",
                        "colorDarkNeutral": "4",
                    },
                },
            ],
        )

    @patch("db_modules.UserPersonalInfo.check_username")  # 模擬check_username方法
    def test_post_invalid_username(self, mock_check_username):
        """測試POST請求，使用無效的用戶名"""

        # 模擬check_username方法，返回False表示用戶名無效
        mock_check_username.return_value = False

        data = {"username": self.invalid_username}  # 設定無效的用戶名資料
        response = self.client.post(
            self.url, json.dumps(data), content_type="application/json"
        )  # 發送POST請求

        # 檢查回應狀態碼是否為400
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_missing_username(self):
        """測試POST請求，資料中缺少用戶名欄位"""

        data = {}  # 用戶名欄位缺失
        response = self.client.post(
            self.url, json.dumps(data), content_type="application/json"
        )  # 發送POST請求

        # 檢查回應狀態碼是否為400
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
