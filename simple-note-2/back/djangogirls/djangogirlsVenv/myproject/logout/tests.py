from unittest.mock import patch
from rest_framework.test import APITestCase
from rest_framework import status
import json

class LogoutViewTest(APITestCase):
    def setUp(self):
        """設置測試環境"""
        self.url = "http://localhost:8000/logout/"  # 更新為實際的登出端點URL
        self.valid_payload = {
            "username": "testuser"  # 有效的測試資料（正確的用戶名）
        }
        self.invalid_payload = {
            "username": "nonexistentuser"  # 無效的測試資料（不存在的用戶名）
        }

    @patch("db_modules.UserPersonalInfo.update_user_login_status_by_usernames")  # 模擬update_user_login_status_by_usernames方法
    def test_post_successful_logout(self, mock_update_user_login_status):
        """測試POST請求成功登出"""
        
        # 模擬登出成功，更新用戶登錄狀態為True
        mock_update_user_login_status.return_value = True

        # 發送POST請求，使用有效的測試資料
        response = self.client.post(self.url, json.dumps(self.valid_payload), content_type="application/json")
        
        # 檢查回應狀態碼是否為200
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # 確認mock的update_user_login_status_by_usernames方法被調用
        mock_update_user_login_status.assert_called_once_with(self.valid_payload["username"])

    @patch("db_modules.UserPersonalInfo.update_user_login_status_by_usernames")  # 模擬update_user_login_status_by_usernames方法
    def test_post_unsuccessful_logout(self, mock_update_user_login_status):
        """測試POST請求登出失敗"""
        
        # 模擬登出失敗，返回"User not found."錯誤訊息
        mock_update_user_login_status.return_value = "User not found."

        # 發送POST請求，使用無效的測試資料
        response = self.client.post(self.url, json.dumps(self.invalid_payload), content_type="application/json")
        
        # 檢查回應狀態碼是否為400
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # 檢查回應內容是否為預期的錯誤訊息
        self.assertEqual(response.json(), "User not found.")
        
        # 確認mock的update_user_login_status_by_usernames方法被調用
        mock_update_user_login_status.assert_called_once_with(self.invalid_payload["username"])
