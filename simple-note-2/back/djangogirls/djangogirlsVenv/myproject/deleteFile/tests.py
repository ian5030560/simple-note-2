import json
from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch

class DeleteFileViewTestCase(APITestCase):
    def setUp(self):
        # 初始化測試用的URL和測試資料
        self.url = ('http://localhost:8000/media/delete/')  # 測試API的端點
        self.valid_payload = {
            "username": "test_user",
            "note_title_id": "test_note_id",
            "url": "test_file"  # 有效的請求數據
        }
        self.invalid_payload = {
            "username": "",
            "note_title_id": "",
            "url": ""  # 無效的請求數據
        }

    @patch('db_modules.UserFileData.delete_file_name')
    def test_delete_file_success(self, mock_delete_file_name):
        """測試檔案刪除成功的情況。"""
        # 模擬`delete_file_name`返回成功結果
        mock_delete_file_name.return_value = True

        # 發送POST請求，傳入有效的數據
        response = self.client.post(self.url, data=json.dumps(self.valid_payload), content_type="application/json")

        # 驗證API返回的HTTP狀態碼是否為200（成功）
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # 驗證`delete_file_name`函數是否被呼叫一次，並傳入正確參數
        mock_delete_file_name.assert_called_once_with(
            self.valid_payload['username'],
            self.valid_payload['note_title_id'],
            "test_file"  # 確保URL參數處理邏輯正確
        )

    @patch('db_modules.UserFileData.delete_file_name')
    def test_delete_file_failure(self, mock_delete_file_name):
        """測試檔案刪除失敗的情況。"""
        # 模擬`delete_file_name`返回失敗結果
        mock_delete_file_name.return_value = {"error": "Deletion failed"}

        # 發送POST請求，傳入有效的數據
        response = self.client.post(self.url, data=json.dumps(self.valid_payload), content_type="application/json")

        # 驗證API返回的HTTP狀態碼是否為400（錯誤請求）
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # 驗證API返回的JSON是否包含正確的錯誤訊息
        self.assertEqual(response.json(), {"error": "Deletion failed"})
        # 驗證`delete_file_name`函數是否被呼叫一次，並傳入正確參數
        mock_delete_file_name.assert_called_once_with(
            self.valid_payload['username'],
            self.valid_payload['note_title_id'],
            "test_file"
        )

    def test_invalid_payload(self):
        """測試處理無效數據的情況。"""
        # 發送POST請求，傳入無效的數據
        response = self.client.post(self.url, data=json.dumps(self.invalid_payload), content_type="application/json")
        
        # 驗證API返回的HTTP狀態碼是否為400（錯誤請求）
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # 驗證API返回的JSON是否包含正確的錯誤訊息
        self.assertEqual(response.json(), {"error": "Missing required fields"})

    @patch('db_modules.UserFileData.delete_file_name')
    def test_missing_fields(self, mock_delete_file_name):
        """測試處理缺少必需字段的請求情況。"""
        incomplete_payload = {
            "username": "testuser",  # 缺少`note_title_id`字段
            "url": "test_file"
        }

        # 發送POST請求，傳入不完整的數據
        response = self.client.post(self.url, data=json.dumps(incomplete_payload), content_type="application/json")

        # 驗證API返回的HTTP狀態碼是否為400（錯誤請求）
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # 驗證API返回的JSON是否包含正確的錯誤訊息
        self.assertEqual(response.json(), {"error": "Missing required fields"})
        # 確保`delete_file_name`函數未被呼叫
        mock_delete_file_name.assert_not_called()

    @patch('db_modules.UserFileData.delete_file_name')
    def test_url_processing(self, mock_delete_file_name):
        """測試API中的URL處理邏輯是否正確。"""
        # 模擬`delete_file_name`返回成功結果
        mock_delete_file_name.return_value = True

        # 發送POST請求，傳入有效的數據
        response = self.client.post(self.url, data=json.dumps(self.valid_payload), content_type="application/json")

        # 驗證API返回的HTTP狀態碼是否為200（成功）
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # 驗證`delete_file_name`函數是否被呼叫一次，並傳入正確參數
        mock_delete_file_name.assert_called_once_with(
            self.valid_payload['username'],
            self.valid_payload['note_title_id'],
            "test_file"  # 確保URL參數處理邏輯正確
        )
