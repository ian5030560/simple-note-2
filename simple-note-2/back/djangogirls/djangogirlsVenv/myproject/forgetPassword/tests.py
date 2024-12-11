import json
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from unittest.mock import patch

class ForgetPasswordViewTestCase(APITestCase):
    def setUp(self):
        self.url = ('http://localhost:8000/forget-password/')  # Replace with your actual URL name for ForgetPasswordView
        self.valid_payload = {
            "email": "testuser@gmail.com",
            "username": "testuser"
        }
        self.invalid_payload = {
            "email": "invalid@example.com",
            "username": "testuser"
        }
        self.missing_username_payload = {
            "email": "testuser@gmail.com"
        }

    @patch('db_modules.UserPersonalInfo.search_password')
    @patch('django.core.mail.EmailMessage.send')
    def test_email_send_success(self, mock_email_send, mock_search_password):
        """Test successful email sending."""
        mock_search_password.return_value = "user_password"
        mock_email_send.return_value = 1  # Simulate successful email sending

        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_search_password.assert_called_once_with(self.valid_payload['email'])
        mock_email_send.assert_called_once()

    @patch('db_modules.UserPersonalInfo.search_password')
    def test_invalid_email(self, mock_search_password):
        """Test failure due to invalid email."""
        mock_search_password.return_value = False  # Simulate password lookup failure

        response = self.client.post(
            self.url,
            data=json.dumps(self.invalid_payload),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        mock_search_password.assert_called_once_with(self.invalid_payload['email'])

    def test_missing_username(self):
        """Test failure due to missing username."""
        response = self.client.post(
            self.url,
            data=json.dumps(self.missing_username_payload),
            content_type="application/json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)