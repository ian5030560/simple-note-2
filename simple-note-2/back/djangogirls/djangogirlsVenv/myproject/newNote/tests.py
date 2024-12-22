from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch
import json

class NewNoteViewTest(APITestCase):
    def setUp(self):
        """設置測試環境"""
        self.url = "http://localhost:8000/note/new/"  # 新筆記API的URL
        # 測試用的有效請求資料
        self.valid_payload = {
            "username": "testuser",  # 用戶名
            "noteId": "123",  # 筆記ID
            "notename": "note123",  # 筆記名稱
            "parentId": "456",  # 父筆記ID
            "silblingId": "789",  # 同級筆記ID
        }

    @patch("db_modules.UserNoteData.insert_user_id_note_name")  # 模擬插入筆記名稱的資料庫操作
    @patch("db_modules.UserSubNoteData.insert_data")  # 模擬插入子筆記的資料庫操作
    def test_post_valid_data(self, mock_insert_subnote, mock_insert_note):
        """測試POST請求使用有效資料"""
        mock_insert_note.return_value = True  # 模擬筆記插入成功
        mock_insert_subnote.return_value = True  # 模擬子筆記插入成功

        # 發送POST請求
        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),  # 使用有效資料
            content_type="application/json",  # 設置內容類型為JSON
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)  # 檢查回應狀態碼是否為200

    @patch("db_modules.UserNoteData.insert_user_id_note_name")  # 模擬插入筆記名稱的資料庫操作
    @patch("db_modules.UserSubNoteData.insert_data")  # 模擬插入子筆記的資料庫操作
    def test_post_invalid_note_data(self, mock_insert_subnote, mock_insert_note):
        """測試POST模擬筆記插入失敗"""
        mock_insert_note.return_value = False  # 模擬筆記插入失敗
        mock_insert_subnote.return_value = True  # 模擬子筆記插入成功

        # 發送POST請求
        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),  # 使用有效資料
            content_type="application/json",  # 設置內容類型為JSON
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)  # 檢查回應狀態碼是否為400

    @patch("db_modules.UserNoteData.insert_user_id_note_name")  # 模擬插入筆記名稱的資料庫操作
    @patch("db_modules.UserSubNoteData.insert_data")  # 模擬插入子筆記的資料庫操作
    def test_post_invalid_subnote_data(self, mock_insert_subnote, mock_insert_note):
        """測試POST模擬子筆記插入失敗"""
        mock_insert_note.return_value = True  # 模擬筆記插入成功
        mock_insert_subnote.return_value = False  # 模擬子筆記插入失敗

        # 發送POST請求
        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),  # 使用有效資料
            content_type="application/json",  # 設置內容類型為JSON
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)  # 檢查回應狀態碼是否為400

    @patch("db_modules.UserNoteData.insert_user_id_note_name")  # 模擬插入筆記名稱的資料庫操作
    @patch("db_modules.UserSubNoteData.insert_data")  # 模擬插入子筆記的資料庫操作
    def test_post_invalid_data(self, mock_insert_subnote, mock_insert_note):
        """測試POST模擬筆記、子筆記插入失敗"""
        mock_insert_note.return_value = False  # 模擬筆記插入失敗
        mock_insert_subnote.return_value = False  # 模擬子筆記插入失敗

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
            "username": "testuser",  # 缺少notename和noteId欄位
        }

        # 發送POST請求
        response = self.client.post(
            self.url,
            data=json.dumps(invalid_payload),  # 發送缺少欄位的資料
            content_type="application/json",  # 設置內容類型為JSON
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)  # 檢查回應狀態碼是否為401
