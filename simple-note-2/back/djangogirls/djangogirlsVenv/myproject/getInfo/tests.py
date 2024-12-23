import json
from unittest.mock import patch

from rest_framework import status
from rest_framework.test import APITestCase


class GetInfoViewTestCase(APITestCase):
    def setUp(self):
        """設置測試環境"""
        self.url = "http://localhost:8000/info/get/"  # API的URL
        self.valid_payload = {"username": "testuser"}  # 有效的測試用戶名
        self.invalid_payload = {"invalid_key": "invalid_value"}  # 無效的測試資料

    @patch(
        "db_modules.UserPersonalInfo.check_user_personal_info"
    )  # 模擬check_user_personal_info方法
    def test_get_info_success(self, mock_check_user_personal_info):
        """測試成功取得用戶資訊"""

        # 模擬check_user_personal_info方法返回用戶資訊
        mock_check_user_personal_info.return_value = {
            "name": "John Doe",
            "email": "johndoe@example.com",
            "age": 30,
        }

        # 發送POST請求
        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )

        # 檢查回應狀態碼是否為200
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 檢查回應資料是否與預期相符
        self.assertEqual(
            response.json(),
            {"name": "John Doe", "email": "johndoe@example.com", "age": 30},
        )

        # 確認模擬方法被正確調用
        mock_check_user_personal_info.assert_called_once_with(
            self.valid_payload["username"]
        )

    @patch(
        "db_modules.UserPersonalInfo.check_user_personal_info"
    )  # 模擬check_user_personal_info方法
    def test_get_info_failure(self, mock_check_user_personal_info):
        """測試取得用戶資訊失敗的情況"""

        # 模擬check_user_personal_info方法返回None，表示未找到用戶
        mock_check_user_personal_info.return_value = None

        # 發送POST請求
        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )

        # 檢查回應狀態碼是否為400
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # 檢查回應資料是否顯示錯誤信息
        self.assertEqual(response.json(), {"error": "User not found"})

        # 確認模擬方法被正確調用
        mock_check_user_personal_info.assert_called_once_with(
            self.valid_payload["username"]
        )

    def test_invalid_payload(self):
        """測試處理無效的請求資料"""

        # 發送包含無效資料的POST請求
        response = self.client.post(
            self.url,
            data=json.dumps(self.invalid_payload),
            content_type="application/json",
        )

        # 檢查回應狀態碼是否為400
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # 檢查回應資料是否顯示錯誤信息
        self.assertEqual(response.json(), {"error": "Invalid input"})

    def test_missing_username(self):
        """測試處理請求資料中缺少用戶名的情況"""

        incomplete_payload = {}  # 缺少用戶名的資料

        # 發送包含不完整資料的POST請求
        response = self.client.post(
            self.url,
            data=json.dumps(incomplete_payload),
            content_type="application/json",
        )

        # 檢查回應狀態碼是否為400
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # 檢查回應資料是否顯示錯誤信息
        self.assertEqual(response.json(), {"error": "Invalid input"})
