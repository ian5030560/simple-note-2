import json
from unittest.mock import patch

from rest_framework import status
from rest_framework.test import APITestCase


class GetNoteViewTestCase(APITestCase):
    def setUp(self):
        """設置測試環境"""
        self.url = "http://localhost:8000/note/get/"  # API的URL
        self.valid_payload = {
            "username": "testuser",  # 測試用戶名
            "noteId": "1",  # 測試筆記ID
        }
        self.invalid_payload = {
            "username": "testuser",  # 測試用戶名
            "noteId": "invalid",  # 無效的筆記ID
        }

    @patch("db_modules.UserNoteData.check_content")  # 模擬check_content方法
    def test_get_note_success(self, mock_check_content):
        """測試成功取得筆記內容"""
        mock_check_content.return_value = [
            "This is the note content."
        ]  # 模擬返回筆記內容

        # 發送有效的POST請求
        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )

        # 檢查回應狀態碼是否為200（OK）
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # 檢查回應內容是否為預期的筆記內容
        self.assertEqual(response.content.decode("utf-8"), "This is the note content.")
        # 檢查check_content方法是否被正確調用
        mock_check_content.assert_called_once_with(
            self.valid_payload["username"], self.valid_payload["noteId"]
        )

    def test_invalid_payload(self):
        """測試無效的請求資料"""
        # 發送無效的POST請求
        response = self.client.post(
            self.url,
            data=json.dumps(self.invalid_payload),
            content_type="application/json",
        )
        # 檢查回應狀態碼是否為204
        self.assertEqual(response.status_code, 204)

    def test_missing_fields(self):
        """測試缺少必需欄位的情況"""
        incomplete_payload = {
            "username": "testuser",
            "noteId": "",
        }  # 缺少有效的'noteId'
        # 發送包含缺失欄位的POST請求
        response = self.client.post(
            self.url,
            data=json.dumps(incomplete_payload),
            content_type="text/plain",  # 使用錯誤的內容類型
        )

        # 檢查回應狀態碼是否為204
        self.assertEqual(response.status_code, 204)
