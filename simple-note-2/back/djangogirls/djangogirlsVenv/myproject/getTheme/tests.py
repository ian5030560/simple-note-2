# test_views.py
from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch
import json

class GetThemeViewTests(APITestCase):
    
    def setUp(self):
        self.url = ("http://localhost:8000/theme/get/") 
        self.valid_username = "testuser"
        self.invalid_username = "invaliduser"

    @patch("db_modules.UserPersonalInfo.check_username")
    @patch("db_modules.UserPersonalThemeData.check_all_theme_data")
    def test_post_valid_request(self, mock_check_all_theme_data, mock_check_username):
        """Test POST request with a valid username."""
        
        # Mock the check_username function to return True
        mock_check_username.return_value = True
        
        # Mock the check_all_theme_data function to return theme data
        mock_check_all_theme_data.return_value = [
            (1, "light", "5", "5", "5", "5"),
            (2, "green", "2", "3", "4", "5"),
            (3, "blue", "1", "2", "3", "4"),
        ]
        
        data = {"username": self.valid_username}
        response = self.client.post(self.url, json.dumps(data), content_type="application/json")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), [
            {
                "id": 1,
                "name": "light",
                "data": {
                    "colorLightPrimary": "5",
                    "colorLightNeutral": "5",
                    "colorDarkPrimary": "5",
                    "colorDarkNeutral": "5",
                }
            },
            {
                "id": 2,
                "name": "green",
                "data": {
                    "colorLightPrimary": "2",
                    "colorLightNeutral": "3",
                    "colorDarkPrimary": "4",
                    "colorDarkNeutral": "5",
                }
            },
            {
                "id": 3,
                "name": "blue",
                "data": {
                    "colorLightPrimary": "1",
                    "colorLightNeutral": "2",
                    "colorDarkPrimary": "3",
                    "colorDarkNeutral": "4",
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
