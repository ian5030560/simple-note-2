from unittest.mock import patch
from rest_framework.test import APITestCase
from rest_framework import status
import json

class LogoutViewTest(APITestCase):
    def setUp(self):
        self.url = "/logout/"  # Update with the actual URL for the logout endpoint.
        self.valid_payload = {
            "username": "testuser"
        }
        self.invalid_payload = {
            "username": "nonexistentuser"
        }

    @patch("db_modules.UserPersonalInfo.update_user_login_status_by_usernames")
    def test_post_successful_logout(self, mock_update_user_login_status):
        """Test POST request for successful logout."""
        # Mocking a successful logout
        mock_update_user_login_status.return_value = True

        response = self.client.post(self.url, json.dumps(self.valid_payload), content_type="application/json")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_update_user_login_status.assert_called_once_with(self.valid_payload["username"])

    @patch("db_modules.UserPersonalInfo.update_user_login_status_by_usernames")
    def test_post_unsuccessful_logout(self, mock_update_user_login_status):
        """Test POST request for unsuccessful logout."""
        # Mocking a failed logout with error message
        mock_update_user_login_status.return_value = "User not found."

        response = self.client.post(self.url, json.dumps(self.invalid_payload), content_type="application/json")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), "User not found.")
        mock_update_user_login_status.assert_called_once_with(self.invalid_payload["username"])
