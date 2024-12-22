import json
from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch

class DeleteCollaborateViewTestCase(APITestCase):
    def setUp(self):
        """在每個測試之前設置初始條件，例如 URL 和測試的有效與無效數據"""
        self.url = ('http://localhost:8000/collaborate/delete/')  # 刪除協作筆記 API 的 URL
        self.valid_payload = {  # 有效的請求參數
            "masterName": "testuser",
            "noteId": "1"
        }
        self.invalid_payload = {  # 無效的請求參數
            "invalidKey": "invalid_value"
        }

    @patch('db_modules.UserCollaborateNote.delete_all_data')  # 模擬 `delete_all_data` 方法
    def test_delete_collaborate_success(self, mock_delete_all_data):
        """測試成功刪除協作筆記的情況"""
        mock_delete_all_data.return_value = True  # 模擬方法返回 True，表示刪除成功

        # 發送 POST 請求，測試成功情況
        response = self.client.post(self.url, data=json.dumps(self.valid_payload), content_type="application/json")

        # 檢查返回的 HTTP 狀態碼是否為 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # 檢查 `delete_all_data` 是否被正確調用一次，且參數正確
        mock_delete_all_data.assert_called_once_with(
            self.valid_payload['masterName'],
            self.valid_payload['noteId']
        )

    @patch('db_modules.UserCollaborateNote.delete_all_data')  # 模擬 `delete_all_data` 方法
    def test_delete_collaborate_failure(self, mock_delete_all_data):
        """測試刪除協作筆記失敗的情況"""
        mock_delete_all_data.return_value = False  # 模擬方法返回 False，表示刪除失敗

        # 發送 POST 請求，測試失敗情況
        response = self.client.post(self.url, data=json.dumps(self.valid_payload), content_type="application/json")

        # 檢查返回的 HTTP 狀態碼是否為 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # 檢查 `delete_all_data` 是否被正確調用一次，且參數正確
        mock_delete_all_data.assert_called_once_with(
            self.valid_payload['masterName'],
            self.valid_payload['noteId']
        )
