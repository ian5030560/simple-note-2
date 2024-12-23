import json
from unittest.mock import patch

from rest_framework import status
from rest_framework.test import APITestCase


class NewCollaborateViewTest(APITestCase):
    def setUp(self):
        """設置測試環境"""
        self.url = "http://localhost:8000/collaborate/new/"  # 創建合作筆記端點URL
        self.valid_payload = {
            "username": "testuser",  # 用戶名
            "noteId": "1",  # 筆記ID
            "url": "testurl",  # 合作URL
        }
        self.invalid_payload_missing_fields = {  # 缺少url
            "username": "testuser",
            "noteId": "1",
        }

    @patch("db_modules.UserCollaborateNote.insert_newData")  # 模擬insert_newData方法
    def test_post_successful_collaboration(self, mock_insert_newData):
        """測試POST請求成功創建合作"""

        # 模擬創建合作成功，返回True
        mock_insert_newData.return_value = True

        # 發送POST請求，使用有效的測試資料
        response = self.client.post(
            self.url, json.dumps(self.valid_payload), content_type="application/json"
        )

        # 檢查回應狀態碼是否為200
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # 確認mock的insert_newData方法被正確調用
        mock_insert_newData.assert_called_once_with(
            self.valid_payload["username"],  # 用戶名
            self.valid_payload["noteId"],  # 筆記ID
            self.valid_payload["username"],  # 合作方用戶名
            self.valid_payload["url"],  # 合作URL
        )

    @patch("db_modules.UserCollaborateNote.insert_newData")  # 模擬insert_newData方法
    def test_post_unsuccessful_collaboration(self, mock_insert_newData):
        """測試POST請求創建合作失敗"""

        # 模擬創建合作失敗，返回False
        mock_insert_newData.return_value = False

        # 發送POST請求，使用有效的測試資料
        response = self.client.post(
            self.url, json.dumps(self.valid_payload), content_type="application/json"
        )

        # 檢查回應狀態碼是否為400
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # 確認mock的insert_newData方法被正確調用
        mock_insert_newData.assert_called_once_with(
            self.valid_payload["username"],  # 用戶名
            self.valid_payload["noteId"],  # 筆記ID
            self.valid_payload["username"],  # 合作方用戶名
            self.valid_payload["url"],  # 合作URL
        )
