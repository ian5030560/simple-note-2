from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch
import json

class RegisterAndLoginViewTest(APITestCase):
    def setUp(self):
        self.url = "http://localhost:8000/login/"  
        self.valid_login_payload = {
            "id": "sign-in",
            "email": "testuser@gmail.com",
            "password": "testuser",
            "username": "testuser"
        }
        self.valid_register_payload = {
            "id": "register",
            "email": "testuser3@gmail.com",
            "password": "testuser3",
            "username": "testuser3"
        }

    @patch("db_modules.UserPersonalInfo.check_username_password")
    @patch("db_modules.UserPersonalInfo.update_user_login_status_by_usernames")
    def test_login_success(self, mock_update_status, mock_check_credentials):
        """Test successful login."""
        mock_check_credentials.return_value = True
        mock_update_status.return_value = True

        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_login_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch("db_modules.UserPersonalInfo.check_username_password")
    def test_login_invalid_credentials(self, mock_check_credentials):
        """Test login with invalid credentials."""
        mock_check_credentials.return_value = False

        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_login_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch("db_modules.UserPersonalInfo.check_username")
    @patch("db_modules.UserPersonalInfo.check_email")
    @patch("db_modules.UserPersonalInfo.insert_username_password_email")
    def test_register_success(self, mock_insert_user, mock_check_email, mock_check_username):
        """Test successful registration."""
        mock_check_username.return_value = False  # Username not taken
        mock_check_email.return_value = False  # Email not taken
        mock_insert_user.return_value = True

        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_register_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    @patch("db_modules.UserPersonalInfo.check_username")
    def test_register_username_taken(self, mock_check_username):
        """Test registration with an already taken username."""
        mock_check_username.return_value = True

        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_register_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch("db_modules.UserPersonalInfo.check_username")
    @patch("db_modules.UserPersonalInfo.check_email")
    def test_register_email_taken(self, mock_check_email, mock_check_username):
        """Test registration with an already taken email."""
        mock_check_username.return_value = False  # Username not taken
        mock_check_email.return_value = True  # Email taken

        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_register_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_402_PAYMENT_REQUIRED)

    def test_register_missing_fields(self):
        """Test registration with missing required fields."""
        invalid_payload = {
            "id": "register",
            "email": "newuser@example.com"
            # Missing "password" and "username"
        }

        response = self.client.post(
            self.url,
            data=json.dumps(invalid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_empty_payload(self):
        """Test POST request with an empty payload."""
        response = self.client.post(
            self.url,
            data=json.dumps({}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    @patch("db_modules.UserPersonalInfo.check_username_password")
    @patch("db_modules.UserPersonalInfo.update_user_login_status_by_usernames")
    def test_login_update_status_failure(self, mock_update_status, mock_check_credentials):
        """Test login where status update fails."""
        mock_check_credentials.return_value = True
        mock_update_status.return_value = False

        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_login_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
