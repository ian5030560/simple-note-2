from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch
import json

class SaveNoteViewTest(APITestCase):
    def setUp(self):
        """設置測試環境"""
        self.url = "http://localhost:8000/note/save/"  # 記錄儲存的API端點
        # 測試用的有效資料，包含用戶名、筆記ID和筆記內容
        self.valid_payload = {
            "username": "testuser",  # 用戶名
            "noteId": "1",  # 筆記ID
            "content": "This is a test note."  # 筆記內容
        }
        # 測試用的無效資料，缺少筆記內容
        self.invalid_payload_missing_fields = {
            "username": "testuser",  # 用戶名
            "noteId": "1"  # 筆記ID
            # 缺少 "content"
        }

    @patch("db_modules.UserNoteData.update_content")
    def test_save_note_success(self, mock_update_content):
        """測試成功儲存筆記"""
        mock_update_content.return_value = True  # 模擬筆記更新成功

        # 發送POST請求
        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),  # 使用有效資料
            content_type="application/json",  # 設置內容類型為JSON
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)  # 檢查回應狀態碼是否為200

    def test_save_note_missing_fields(self):
        """測試儲存筆記時缺少必要欄位"""
        # 發送POST請求，資料缺少筆記內容
        response = self.client.post(
            self.url,
            data=json.dumps(self.invalid_payload_missing_fields),  # 發送缺少欄位的資料
            content_type="application/json",  # 設置內容類型為JSON
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)  # 檢查回應狀態碼是否為401

    def test_save_note_empty_payload(self):
        """測試儲存筆記時請求資料為空"""
        # 發送POST請求，使用空的資料
        response = self.client.post(
            self.url,
            data=json.dumps({}),  # 空的請求資料
            content_type="application/json",  # 設置內容類型為JSON
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)  # 檢查回應狀態碼是否為401
