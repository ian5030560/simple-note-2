from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch
import json

class NewThemeViewTest(APITestCase):
    def setUp(self):
        """設置測試環境"""
        self.url = "http://localhost:8000/theme/new/"  # 這是新增主題的API端點
        # 測試用的有效請求資料
        self.valid_payload = {
            "username": "testuser",  # 用戶名
            "theme": {  # 主題資料
                "name": "Dark",  # 主題名稱
                "data": {  # 主題數據
                    "colorLightPrimary": "#FFFFFF",  # 輕色主色
                    "colorLightNeutral": "#F5F5F5",  # 輕色中性色
                    "colorDarkPrimary": "#000000",  # 深色主色
                    "colorDarkNeutral": "#1A1A1A"  # 深色中性色
                }
            }
        }

    @patch("db_modules.UserPersonalThemeData.insert_themeData_by_usernames")  # 模擬插入主題資料的資料庫操作
    def test_post_valid_data(self, mock_insert_theme):
        """測試POST請求使用有效的資料"""
        mock_insert_theme.return_value = True  # 模擬插入主題資料成功

        # 發送POST請求
        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),  # 使用有效資料
            content_type="application/json",  # 設置內容類型為JSON
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)  # 檢查回應狀態碼是否為200

    @patch("db_modules.UserPersonalThemeData.insert_themeData_by_usernames")  # 模擬插入主題資料的資料庫操作
    def test_post_invalid_theme_data(self, mock_insert_theme):
        """測試POST請求使用無效的主題資料"""
        mock_insert_theme.return_value = False  # 模擬插入主題資料失敗

        # 發送POST請求
        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),  # 使用有效資料
            content_type="application/json",  # 設置內容類型為JSON
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)  # 檢查回應狀態碼是否為400

    def test_post_missing_fields(self):
        """測試POST請求缺少必要欄位"""
        invalid_payload = {
            "username": "testuser",  # 缺少theme中的數據
            "theme": {
                "name": "Dark"  # 缺少主題的數據部分
            }
        }

        # 發送POST請求
        response = self.client.post(
            self.url,
            data=json.dumps(invalid_payload),  # 發送缺少欄位的資料
            content_type="application/json",  # 設置內容類型為JSON
        )
        self.assertEqual(response.status_code, status.HTTP_402_PAYMENT_REQUIRED)  # 檢查回應狀態碼是否為402

    def test_post_empty_payload(self):
        """測試POST請求使用空的請求資料"""
        # 發送POST請求，使用空的資料
        response = self.client.post(
            self.url,
            data=json.dumps({}),  # 空的請求資料
            content_type="application/json",  # 設置內容類型為JSON
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)  # 檢查回應狀態碼是否為401
