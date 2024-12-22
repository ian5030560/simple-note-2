import json
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from unittest.mock import patch

class ForgetPasswordViewTestCase(APITestCase):
    def setUp(self):
        # 設置測試所需的 URL 和有效/無效的測試數據
        self.url = ('http://localhost:8000/forget-password/')  # 設定忘記密碼API的URL
        self.valid_payload = {  # 定義有效的測試數據（包含email和username）
            "email": "testuser@gmail.com",
            "username": "testuser"
        }
        self.invalid_payload = {  # 定義無效的測試數據（email不存在）
            "email": "invalid@example.com",
            "username": "testuser"
        }
        self.missing_username_payload = {  # 定義缺少username的測試數據
            "email": "testuser@gmail.com"
        }

    @patch('db_modules.UserPersonalInfo.search_password')  # 模擬UserPersonalInfo.search_password函數
    @patch('django.core.mail.EmailMessage.send')  # 模擬發送電子郵件的功能
    def test_email_send_success(self, mock_email_send, mock_search_password):
        """測試成功發送電子郵件的情況。"""
        # 模擬成功檢索到密碼並發送郵件
        mock_search_password.return_value = "user_password"
        mock_email_send.return_value = 1  # 模擬郵件成功發送

        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),
            content_type="application/json"
        )

        # 驗證回應狀態碼與行為
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_search_password.assert_called_once_with(self.valid_payload['email'])
        mock_email_send.assert_called_once()

    @patch('db_modules.UserPersonalInfo.search_password')  # 模擬UserPersonalInfo.search_password函數
    def test_invalid_email(self, mock_search_password):
        """測試由於無效電子郵件而失敗的情況。"""
        # 模擬未找到密碼
        mock_search_password.return_value = False

        response = self.client.post(
            self.url,
            data=json.dumps(self.invalid_payload),
            content_type="application/json"
        )

        # 驗證回應狀態碼與行為
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        mock_search_password.assert_called_once_with(self.invalid_payload['email'])

    def test_missing_username(self):
        """測試由於缺少用戶名而失敗的情況。"""
        response = self.client.post(
            self.url,
            data=json.dumps(self.missing_username_payload),
            content_type="application/json"
        )

        # 驗證回應狀態碼與行為
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
