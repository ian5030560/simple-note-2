from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch
import json

class UpdateInfoViewTest(APITestCase):
    def setUp(self):
        self.url = "http://localhost:8000/info/get/"  # Replace with the actual endpoint
        self.username = "testuser"
        self.valid_payload = {
            "username": self.username,
            "data": {
                "image": "http://localhost:8000/media/testuser/1/GbtVktabMAA-FYo.jpg/",
                "password": "testuser",
                "theme": {"id": "1", "name": "light"}
            }
        }
        self.empty_image_payload = {
            "username": self.username,
            "data": {
                "image": None,
                "password": "testuser",
                "theme": {"id": "1", "name": "light"}
            }
        }
        self.invalid_theme_payload = {
            "username": self.username,
            "data": {
                "image": "http://localhost:8000/media/testuser/1/GbtVktabMAA-FYo.jpg/",
                "password": "testuser",
                "theme": {"id": None, "name": "Nonexistent Theme"}
            }
        }

    @patch("db_modules.UserPersonalInfo.check_username")
    @patch("db_modules.UserPersonalInfo.check_profile_photo_by_username")
    @patch("db_modules.UserPersonalInfo.insert_profile_photo_by_username")
    @patch("db_modules.UserPersonalInfo.update_user_password_by_usernames")
    @patch("db_modules.UserPersonalThemeData.check_theme_name")
    @patch("db_modules.UserPersonalInfo.update_user_theme_id_by_usernames")
    def test_update_info_success(
        self,
        mock_update_theme,
        mock_check_theme,
        mock_update_password,
        mock_insert_image,
        mock_check_image,
        mock_check_username,
    ):
        """Test successful update of all fields."""
        mock_check_username.return_value = True
        mock_check_image.return_value = False
        mock_insert_image.return_value = True
        mock_update_password.return_value = True
        mock_check_theme.return_value = True
        mock_update_theme.return_value = True

        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch("db_modules.UserPersonalInfo.check_username")
    @patch("db_modules.UserPersonalInfo.insert_profile_photo_by_username")
    def test_update_image_only(self, mock_insert_image, mock_check_username):
        """Test updating only the image."""
        mock_check_username.return_value = True
        mock_insert_image.return_value = True

        payload = {
            "username": self.username,
            "data": {
                "image": "http://localhost:8000/media/testuser/1/GbtVktabMAA-FYo.jpg/",
                "password": None,
                "theme": None
            }
        }
        response = self.client.post(
            self.url,
            data=json.dumps(payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch("db_modules.UserPersonalInfo.check_username")
    @patch("db_modules.UserPersonalInfo.check_profile_photo_by_username")
    def test_update_existing_image(self, mock_check_image, mock_check_username):
        """Test updating an existing image."""
        mock_check_username.return_value = True
        mock_check_image.return_value = True

        payload = {
            "username": self.username,
            "data": {
                "image": "http://localhost:8000/media/testuser/1/GbtVktabMAA-FYo.jpg/",
                "password": None,
                "theme": None
            }
        }
        response = self.client.post(
            self.url,
            data=json.dumps(payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

