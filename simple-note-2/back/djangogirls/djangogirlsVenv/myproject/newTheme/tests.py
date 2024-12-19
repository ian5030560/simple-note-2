from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch
import json

class NewThemeViewTest(APITestCase):
    def setUp(self):
        self.url = "http://localhost:8000/theme/new/"  # Replace with the actual endpoint
        self.valid_payload = {
            "username": "testuser",
            "theme": {
                "name": "Dark",
                "data": {
                    "colorLightPrimary": "#FFFFFF",
                    "colorLightNeutral": "#F5F5F5",
                    "colorDarkPrimary": "#000000",
                    "colorDarkNeutral": "#1A1A1A"
                }
            }
        }

    @patch("db_modules.UserPersonalThemeData.insert_themeData_by_usernames")
    def test_post_valid_data(self, mock_insert_theme):
        """Test POST request with valid data."""
        mock_insert_theme.return_value = True

        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch("db_modules.UserPersonalThemeData.insert_themeData_by_usernames")
    def test_post_invalid_theme_data(self, mock_insert_theme):
        """Test POST request with invalid theme data."""
        mock_insert_theme.return_value = False

        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_missing_fields(self):
        """Test POST request with missing required fields."""
        invalid_payload = {
            "username": "testuser",
            "theme": {
                "name": "Dark"
            }
        }

        response = self.client.post(
            self.url,
            data=json.dumps(invalid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_402_PAYMENT_REQUIRED)

    def test_post_empty_payload(self):
        """Test POST request with an empty payload."""
        response = self.client.post(
            self.url,
            data=json.dumps({}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
