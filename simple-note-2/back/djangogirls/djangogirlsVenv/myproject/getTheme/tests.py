# test_views.py
from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch
import json

class GetThemeViewTests(APITestCase):
    
    def setUp(self):
        self.url = ("http://localhost:8000/note/get/") 
        self.valid_username = "test_user"
        self.invalid_username = "invalid_user"

    @patch("db_modules.UserPersonalInfo.check_username")
    @patch("db_modules.UserPersonalThemeData.check_all_theme_data")
    def test_post_valid_request(self, mock_check_all_theme_data, mock_check_username):
        """Test POST request with a valid username."""
        
        # Mock the check_username function to return True
        mock_check_username.return_value = True
        
        # Mock the check_all_theme_data function to return theme data
        mock_check_all_theme_data.return_value = [
            (1, "Theme One", "#FFFFFF", "#AAAAAA", "#000000", "#333333"),
            (2, "Theme Two", "#FF0000", "#00FF00", "#0000FF", "#FFFF00"),
        ]
        
        data = {"username": self.valid_username}
        response = self.client.post(self.url, json.dumps(data), content_type="application/json")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), [
            {
                "id": 1,
                "name": "Theme One",
                "data": {
                    "colorLightPrimary": "#FFFFFF",
                    "colorLightNeutral": "#AAAAAA",
                    "colorDarkPrimary": "#000000",
                    "colorDarkNeutral": "#333333",
                }
            },
            {
                "id": 2,
                "name": "Theme Two",
                "data": {
                    "colorLightPrimary": "#FF0000",
                    "colorLightNeutral": "#00FF00",
                    "colorDarkPrimary": "#0000FF",
                    "colorDarkNeutral": "#FFFF00",
                }
            },
        ])

    @patch("db_modules.UserPersonalInfo.check_username")
    def test_post_invalid_username(self, mock_check_username):
        """Test POST request with an invalid username."""
        
        # Mock the check_username function to return False
        mock_check_username.return_value = False
        
        data = {"username": self.invalid_username}
        response = self.client.post(self.url, json.dumps(data), content_type="application/json")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_missing_username(self):
        """Test POST request with missing username in the payload."""
        
        data = {}
        response = self.client.post(self.url, json.dumps(data), content_type="application/json")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
