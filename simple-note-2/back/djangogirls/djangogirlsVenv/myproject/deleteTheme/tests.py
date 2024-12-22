import json
from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch

class DeleteThemeViewTestCase(APITestCase):
    def setUp(self):
        # 設置測試所需的 URL 和有效/無效的測試數據
        self.url = ('http://localhost:8000/theme/delete/')  # Delete Theme URL
        self.valid_payload = {
            "themeId": "1"
        }
        self.invalid_payload = {
            "invalid_key": "invalid_value"
        }

    @patch('db_modules.UserPersonalThemeData.delete_one_theme_data')
    def test_delete_theme_success(self, mock_delete_one_theme_data):
        """測試主題刪除成功的情況。"""
        # 模擬刪除主題成功的返回值
        mock_delete_one_theme_data.return_value = True

        # 發送 POST 請求，並檢查回應
        response = self.client.post(self.url, data=json.dumps(self.valid_payload), content_type="application/json")

        # 驗證回應狀態碼與行為
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_delete_one_theme_data.assert_called_once_with(self.valid_payload['themeId'])

    @patch('db_modules.UserPersonalThemeData.delete_one_theme_data')
    def test_delete_theme_failure(self, mock_delete_one_theme_data):
        """測試主題刪除失敗的情況。"""
        # 模擬刪除主題失敗的返回值
        mock_delete_one_theme_data.return_value = {"error": "Deletion failed"}

        # 發送 POST 請求，並檢查回應
        response = self.client.post(self.url, data=json.dumps(self.valid_payload), content_type="application/json")

        # 驗證回應狀態碼與行為
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), {"error": "Deletion failed"})
        mock_delete_one_theme_data.assert_called_once_with(self.valid_payload['themeId'])

    def test_invalid_payload(self):
        """測試無效的輸入數據處理。"""
        # 發送包含無效數據的請求
        response = self.client.post(self.url, data=json.dumps(self.invalid_payload), content_type="application/json")

        # 驗證回應狀態碼與行為
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), {"error": "Invalid input"})

    def test_missing_theme_id(self):
        """測試輸入數據中缺少 themeId 的情況。"""
        # 發送不完整的請求數據
        incomplete_payload = {}

        response = self.client.post(self.url, data=json.dumps(incomplete_payload), content_type="application/json")

        # 驗證回應狀態碼與行為
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), {"error": "Invalid input"})