import json
from unittest.mock import patch

from rest_framework import status
from rest_framework.test import APITestCase


class DeleteNoteViewTestCase(APITestCase):
    def setUp(self):
        # 初始化測試用的URL和測試數據
        self.url = "http://localhost:8000/note/delete/"  # 刪除筆記API的URL
        self.valid_payload = {
            "username": "test_user",
            "noteId": "test_note_id",  # 有效的請求數據
        }
        self.invalid_payload_data = {
            "username": "123",
            "noteId": "",  # 無效的請求數據：缺少noteId
        }
        self.invalid_payload_note = {
            "username": "321",
            "noteId": "321",  # 模擬刪除主筆記失敗的數據
        }
        self.invalid_payload = {"invalid_key": "invalid_value"}  # 完全無效的請求數據

    @patch("db_modules.UserSubNoteData.delete_data")
    @patch("db_modules.UserNoteData.delete_note_by_usernames_note_title_id")
    def test_delete_note_success(self, mock_delete_note, mock_delete_data):
        """測試筆記刪除成功的情況。"""
        # 模擬`delete_data`和`delete_note`成功
        mock_delete_data.return_value = True
        mock_delete_note.return_value = True

        # 發送POST請求，傳入有效的數據
        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )

        # 驗證API返回的HTTP狀態碼是否為200
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # 驗證`delete_data`和`delete_note`函數是否被正確呼叫
        mock_delete_data.assert_called_once_with(self.valid_payload["noteId"])
        mock_delete_note.assert_called_once_with(
            self.valid_payload["username"], self.valid_payload["noteId"]
        )

    @patch("db_modules.UserSubNoteData.delete_data")
    @patch("db_modules.UserNoteData.delete_note_by_usernames_note_title_id")
    def test_delete_data_failure(self, mock_delete_note, mock_delete_data):
        """測試刪除子筆記數據失敗的情況。"""
        # 模擬子筆記刪除失敗
        mock_delete_data.return_value = {"error": "Sub-note deletion failed"}

        # 發送POST請求，傳入有效的數據
        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )

        # 驗證API返回的HTTP狀態碼是否為400
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # 驗證API返回的JSON是否包含正確的錯誤訊息
        self.assertEqual(response.json(), {"error": "Sub-note deletion failed"})

        # 確保`delete_data`被呼叫，而`delete_note`未被呼叫
        mock_delete_data.assert_called_once_with(self.valid_payload["noteId"])
        mock_delete_note.assert_not_called()

    @patch("db_modules.UserSubNoteData.delete_data")
    @patch("db_modules.UserNoteData.delete_note_by_usernames_note_title_id")
    def test_delete_note_failure(self, mock_delete_note, mock_delete_data):
        """測試刪除主筆記失敗的情況。"""
        # 模擬子筆記刪除成功，但主筆記刪除失敗
        mock_delete_data.return_value = True
        mock_delete_note.return_value = {"error": "Main note deletion failed"}

        # 發送POST請求，傳入模擬失敗的數據
        response = self.client.post(
            self.url,
            data=json.dumps(self.invalid_payload_note),
            content_type="application/json",
        )

        # 驗證API返回的HTTP狀態碼是否為401
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        # 驗證API返回的JSON是否包含正確的錯誤訊息
        self.assertEqual(response.json(), {"error": "Main note deletion failed"})

        # 驗證`delete_data`和`delete_note`函數是否被正確呼叫
        mock_delete_data.assert_called_once_with(self.invalid_payload_note["noteId"])
        mock_delete_note.assert_called_once_with(
            self.invalid_payload_note["username"], self.invalid_payload_note["noteId"]
        )

    def test_invalid_payload(self):
        """測試處理完全無效的請求數據。"""
        # 發送POST請求，傳入完全無效的數據
        response = self.client.post(
            self.url,
            data=json.dumps(self.invalid_payload),
            content_type="application/json",
        )

        # 驗證API返回的HTTP狀態碼是否為402
        self.assertEqual(response.status_code, status.HTTP_402_PAYMENT_REQUIRED)
        # 驗證API返回的JSON是否包含正確的錯誤訊息
        self.assertEqual(response.json(), {"error": "Missing required fields"})

    @patch("db_modules.UserSubNoteData.delete_data")
    @patch("db_modules.UserNoteData.delete_note_by_usernames_note_title_id")
    def test_missing_fields(self, mock_delete_note, mock_delete_data):
        """測試處理缺少必要字段的請求數據。"""
        incomplete_payload = {"username": "test_user"}  # 缺少`noteId`字段

        # 發送POST請求，傳入不完整的數據
        response = self.client.post(
            self.url,
            data=json.dumps(incomplete_payload),
            content_type="application/json",
        )

        # 驗證API返回的HTTP狀態碼是否為402
        self.assertEqual(response.status_code, status.HTTP_402_PAYMENT_REQUIRED)
        # 驗證API返回的JSON是否包含正確的錯誤訊息
        self.assertEqual(response.json(), {"error": "Missing required fields"})

        # 確保`delete_data`和`delete_note`函數均未被呼叫
        mock_delete_data.assert_not_called()
        mock_delete_note.assert_not_called()
