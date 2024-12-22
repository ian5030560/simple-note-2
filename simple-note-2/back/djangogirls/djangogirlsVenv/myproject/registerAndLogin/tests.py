from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch
import json

class RegisterAndLoginViewTest(APITestCase):
    def setUp(self):
        """設置測試環境"""
        self.url = "http://localhost:8000/login/"  # 登入端點
        # 測試用的有效登入資料
        self.valid_login_payload = {
            "id": "sign-in",  # 請求ID
            "email": "testuser@gmail.com",  # 用戶電子郵件
            "password": "testuser",  # 用戶密碼
            "username": "testuser"  # 用戶名
        }
        # 測試用的有效註冊資料
        self.valid_register_payload = {
            "id": "register",  # 請求ID
            "email": "testuser3@gmail.com",  # 用戶電子郵件
            "password": "testuser3",  # 用戶密碼
            "username": "testuser3"  # 用戶名
        }

    @patch("db_modules.UserPersonalInfo.check_username_password")
    @patch("db_modules.UserPersonalInfo.update_user_login_status_by_usernames")
    def test_login_success(self, mock_update_status, mock_check_credentials):
        """測試成功登入"""
        mock_check_credentials.return_value = True  # 模擬用戶認證成功
        mock_update_status.return_value = True  # 模擬更新登入狀態成功

        # 發送POST請求
        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_login_payload),  # 使用有效登入資料
            content_type="application/json",  # 設置內容類型為JSON
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)  # 檢查回應狀態碼是否為200

    @patch("db_modules.UserPersonalInfo.check_username_password")
    def test_login_invalid_credentials(self, mock_check_credentials):
        """測試使用無效的登入資料"""
        mock_check_credentials.return_value = False  # 模擬用戶認證失敗

        # 發送POST請求
        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_login_payload),  # 使用有效資料，但認證失敗
            content_type="application/json",  # 設置內容類型為JSON
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)  # 檢查回應狀態碼是否為401

    @patch("db_modules.UserPersonalInfo.check_username")
    @patch("db_modules.UserPersonalInfo.check_email")
    @patch("db_modules.UserPersonalInfo.insert_username_password_email")
    def test_register_success(self, mock_insert_user, mock_check_email, mock_check_username):
        """測試成功註冊"""
        mock_check_username.return_value = False  # 用戶名未被佔用
        mock_check_email.return_value = False  # 電子郵件未被佔用
        mock_insert_user.return_value = True  # 模擬註冊成功

        # 發送POST請求
        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_register_payload),  # 使用有效註冊資料
            content_type="application/json",  # 設置內容類型為JSON
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)  # 檢查回應狀態碼是否為201

    @patch("db_modules.UserPersonalInfo.check_username")
    def test_register_username_taken(self, mock_check_username):
        """測試使用已被佔用的用戶名註冊"""
        mock_check_username.return_value = True  # 用戶名已被佔用

        # 發送POST請求
        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_register_payload),  # 使用有效資料，但用戶名已被佔用
            content_type="application/json",  # 設置內容類型為JSON
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)  # 檢查回應狀態碼是否為401

    @patch("db_modules.UserPersonalInfo.check_username")
    @patch("db_modules.UserPersonalInfo.check_email")
    def test_register_email_taken(self, mock_check_email, mock_check_username):
        """測試使用已被佔用的電子郵件註冊"""
        mock_check_username.return_value = False  # 用戶名未被佔用
        mock_check_email.return_value = True  # 電子郵件已被佔用

        # 發送POST請求
        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_register_payload),  # 使用有效資料，但電子郵件已被佔用
            content_type="application/json",  # 設置內容類型為JSON
        )
        self.assertEqual(response.status_code, status.HTTP_402_PAYMENT_REQUIRED)  # 檢查回應狀態碼是否為402

    def test_register_missing_fields(self):
        """測試註冊資料缺少必要欄位"""
        invalid_payload = {
            "id": "register",
            "email": "newuser@example.com"
            # 密碼和用戶名缺失
        }

        # 發送POST請求
        response = self.client.post(
            self.url,
            data=json.dumps(invalid_payload),  # 發送缺少欄位的資料
            content_type="application/json",  # 設置內容類型為JSON
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)  # 檢查回應狀態碼是否為403

    def test_empty_payload(self):
        """測試POST請求使用空的請求資料"""
        # 發送POST請求，使用空的資料
        response = self.client.post(
            self.url,
            data=json.dumps({}),  # 空的請求資料
            content_type="application/json",  # 設置內容類型為JSON
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)  # 檢查回應狀態碼是否為403

    @patch("db_modules.UserPersonalInfo.check_username_password")
    @patch("db_modules.UserPersonalInfo.update_user_login_status_by_usernames")
    def test_login_update_status_failure(self, mock_update_status, mock_check_credentials):
        """測試登入時更新登入狀態失敗"""
        mock_check_credentials.return_value = True  # 模擬用戶認證成功
        mock_update_status.return_value = False  # 模擬更新登入狀態失敗

        # 發送POST請求
        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_login_payload),  # 使用有效登入資料
            content_type="application/json",  # 設置內容類型為JSON
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)  # 檢查回應狀態碼是否為400
