from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch
import json

class JoinCollaborateViewTests(APITestCase):

    def setUp(self):
        """設置測試環境"""
        self.url = "http://localhost:8000/collaborate/join/"  # API的URL
        self.valid_payload = {
            "username": "testuser2",  # 測試用戶名
            "mastername": "testuser",  # 測試主用戶名
            "noteId": "1",            # 測試筆記ID
            "url": "testurl",         # 測試URL
        }
        self.invalid_payload = {
            "username": "invalid_user2",  # 無效的測試用戶名
            "mastername": "testuser",     # 測試主用戶名
            "noteId": "1",                # 測試筆記ID
            "url": "testurl",             # 測試URL
        }

    @patch("db_modules.UserCollaborateNote.check_all_guest")  # 模擬check_all_guest方法
    def test_post_duplicate_user(self, mock_check_all_guest):
        """測試POST請求，當用戶已經是協作成員時"""
        
        # 模擬check_all_guest方法，返回現有的guest，用戶已經是協作成員
        mock_check_all_guest.return_value = [("guest_user",)]
        
        # 發送POST請求
        response = self.client.post(self.url, json.dumps(self.valid_payload), content_type="application/json")
        
        # 檢查回應狀態碼是否為201
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    @patch("db_modules.UserCollaborateNote.check_all_guest")  # 模擬check_all_guest方法
    def test_post_no_guests_found(self, mock_check_all_guest):
        """測試POST請求，當沒有找到協作成員時"""
        
        # 模擬check_all_guest方法，返回None表示沒有找到guest
        mock_check_all_guest.return_value = None
        
        # 發送POST請求
        response = self.client.post(self.url, json.dumps(self.valid_payload), content_type="application/json")
        
        # 檢查回應狀態碼是否為400
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("db_modules.UserCollaborateNote.check_all_guest")  # 模擬check_all_guest方法
    @patch("db_modules.UserCollaborateNote.insert_newData")  # 模擬insert_newData方法
    def test_post_insert_failure(self, mock_insert_newData, mock_check_all_guest):
        """測試POST請求，當插入新數據失敗時"""
        
        # 模擬check_all_guest方法，返回空列表表示沒有現有用戶
        mock_check_all_guest.return_value = []
        
        # 模擬insert_newData方法，返回False表示插入失敗
        mock_insert_newData.return_value = False
        
        # 發送POST請求
        response = self.client.post(self.url, json.dumps(self.valid_payload), content_type="application/json")
        
        # 檢查回應狀態碼是否為400
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_invalid_request_body(self):
        """測試POST請求，當請求資料無效時"""
        
        # 發送包含無效資料的POST請求
        response = self.client.post(self.url, json.dumps(self.invalid_payload), content_type="application/json")
        
        # 檢查回應狀態碼是否為201
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)