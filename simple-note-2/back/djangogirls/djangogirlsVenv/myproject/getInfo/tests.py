import json
from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch

class GetInfoViewTestCase(APITestCase):
    def setUp(self):
        self.url = ('http://localhost:8000/info/get/')  # Replace with your actual URL name for GetInfoView
        self.valid_payload = {
            "username": "testuser"
        }
        self.invalid_payload = {
            "invalid_key": "invalid_value"
        }

    @patch('db_modules.UserPersonalInfo.check_user_personal_info')
    def test_get_info_success(self, mock_check_user_personal_info):
        """Test successful retrieval of user information."""
        mock_check_user_personal_info.return_value = {
            "name": "John Doe",
            "email": "johndoe@example.com",
            "age": 30
        }

        response = self.client.post(self.url, data=json.dumps(self.valid_payload), content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {
            "name": "John Doe",
            "email": "johndoe@example.com",
            "age": 30
        })
        mock_check_user_personal_info.assert_called_once_with(self.valid_payload['username'])

    @patch('db_modules.UserPersonalInfo.check_user_personal_info')
    def test_get_info_failure(self, mock_check_user_personal_info):
        """Test failure in retrieving user information."""
        mock_check_user_personal_info.return_value = None

        response = self.client.post(self.url, data=json.dumps(self.valid_payload), content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), {"error": "User not found"})
        mock_check_user_personal_info.assert_called_once_with(self.valid_payload['username'])

    def test_invalid_payload(self):
        """Test handling of invalid payload."""
        response = self.client.post(self.url, data=json.dumps(self.invalid_payload), content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), {"error": "Invalid input"})

    def test_missing_username(self):
        """Test handling of missing username in payload."""
        incomplete_payload = {}

        response = self.client.post(self.url, data=json.dumps(incomplete_payload), content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), {"error": "Invalid input"})
