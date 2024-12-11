import json
from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch

class DeleteThemeViewTestCase(APITestCase):
    def setUp(self):
        self.url = ('http://localhost:8000/theme/delete/')  # Replace with your actual URL name for DeleteThemeView
        self.valid_payload = {
            "themeId": "1"
        }
        self.invalid_payload = {
            "invalid_key": "invalid_value"
        }

    @patch('db_modules.UserPersonalThemeData.delete_one_theme_data')
    def test_delete_theme_success(self, mock_delete_one_theme_data):
        """Test successful deletion of a theme."""
        mock_delete_one_theme_data.return_value = True

        response = self.client.post(self.url, data=json.dumps(self.valid_payload), content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_delete_one_theme_data.assert_called_once_with(self.valid_payload['themeId'])

    @patch('db_modules.UserPersonalThemeData.delete_one_theme_data')
    def test_delete_theme_failure(self, mock_delete_one_theme_data):
        """Test failure in deleting a theme."""
        mock_delete_one_theme_data.return_value = {"error": "Deletion failed"}

        response = self.client.post(self.url, data=json.dumps(self.valid_payload), content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), {"error": "Deletion failed"})
        mock_delete_one_theme_data.assert_called_once_with(self.valid_payload['themeId'])

    def test_invalid_payload(self):
        """Test handling of invalid payload."""
        response = self.client.post(self.url, data=json.dumps(self.invalid_payload), content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), {"error": "Invalid input"})

    def test_missing_theme_id(self):
        """Test handling of missing themeId in payload."""
        incomplete_payload = {}

        response = self.client.post(self.url, data=json.dumps(incomplete_payload), content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), {"error": "Invalid input"})
