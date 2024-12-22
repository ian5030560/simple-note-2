# test_views.py
from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch
import json

class LoadNoteTreeViewTests(APITestCase):

    def setUp(self):
        """設置測試環境"""
        self.url = "http://localhost:8000/note/tree/"  # API的URL
        self.valid_payload = {"username": "testuser"}  # 有效的測試資料
        self.invalid_payload = {"username": "invaliduser"}  # 無效的測試資料

    @patch("db_modules.UserNoteData.check_user_all_notes")  # 模擬check_user_all_notes方法
    @patch("db_modules.UserSubNoteData.check_parent_id")  # 模擬check_parent_id方法
    @patch("db_modules.UserSubNoteData.check_sibling_id")  # 模擬check_sibling_id方法
    def test_post_valid_single_notes(self, mock_check_sibling_id, mock_check_parent_id, mock_check_user_all_notes):
        """測試POST請求，處理有效的單一筆記資料"""
        
        # 模擬用戶的筆記資料
        mock_check_user_all_notes.return_value = [
            ("Note1", "ID1"),
            ("Note2", "ID2")
        ]
        
        # 模擬父級和兄弟筆記的資料
        mock_check_parent_id.side_effect = ["Parent1", "Parent2"]
        mock_check_sibling_id.side_effect = ["Sibling1", "Sibling2"]
        
        # 發送POST請求
        response = self.client.post(self.url, json.dumps(self.valid_payload), content_type="application/json")
        
        # 檢查回應狀態碼是否為200
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # 檢查回應資料是否與預期相符
        self.assertEqual(response.json(), {
            "one": [
                {"noteId": "ID1", "noteName": "Note1", "parentId": "Parent1", "silblingId": "Sibling1"},
                {"noteId": "ID2", "noteName": "Note2", "parentId": "Parent2", "silblingId": "Sibling2"}
            ],
            "multiple": []
        })

    @patch("db_modules.UserNoteData.check_user_all_notes")  # 模擬check_user_all_notes方法
    @patch("db_modules.UserCollaborateNote.check_url")  # 模擬check_url方法
    @patch("db_modules.UserCollaborateNote.check_all_noteID_by_guest")  # 模擬check_all_noteID_by_guest方法
    @patch("db_modules.UserNoteData.check_note_title_id_by_note_id")  # 模擬check_note_title_id_by_note_id方法
    @patch("db_modules.UserNoteData.check_note_name_by_note_id")  # 模擬check_note_name_by_note_id方法
    def test_post_valid_collaboration_notes(
        self, mock_check_note_name, mock_check_note_title_id,
        mock_check_all_noteID_by_guest, mock_check_url, mock_check_user_all_notes
    ):
        """測試POST請求，處理有效的協作筆記資料"""
        
        # 模擬用戶的筆記資料（對於單一筆記是空的）
        mock_check_user_all_notes.return_value = []
        
        # 模擬協作的URL和筆記ID
        mock_check_url.return_value = [("testurl",)]
        mock_check_all_noteID_by_guest.return_value = [("1",)]
        
        # 模擬協作筆記的標題ID和名稱
        mock_check_note_title_id.return_value = "1"
        mock_check_note_name.return_value = "note1"
        
        # 發送POST請求
        response = self.client.post(self.url, json.dumps(self.valid_payload), content_type="application/json")
        
        # print(response.json())
        
        # 檢查回應狀態碼是否為200
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # 檢查回應資料是否與預期相符
        self.assertEqual(response.json(), {
            "one": [],
            "multiple": []
        })

    @patch("db_modules.UserNoteData.check_user_all_notes")  # 模擬check_user_all_notes方法
    def test_post_sql_error(self, mock_check_user_all_notes):
        """測試POST請求時發生SQL錯誤的情況"""
        
        # 模擬SQL錯誤場景
        mock_check_user_all_notes.return_value = False
        
        # 發送POST請求
        response = self.client.post(self.url, json.dumps(self.valid_payload), content_type="application/json")
        
        # 檢查回應狀態碼是否為400
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # 檢查回應資料是否顯示錯誤信息
        self.assertEqual(response.json(), "SQL error.")

    def test_post_invalid_request_body(self):
        """測試POST請求處理無效的請求資料"""
        
        # 發送無效的POST請求
        response = self.client.post(self.url, json.dumps(self.invalid_payload), content_type="application/json")
        
        # 檢查回應狀態碼是否為400
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
