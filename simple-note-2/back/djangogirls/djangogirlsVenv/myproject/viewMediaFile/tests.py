'''
import os
from django.test import TestCase
from unittest.mock import patch
from django.conf import settings
from rest_framework.test import APIClient
from rest_framework import status

class ViewMediaFileViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.username = "testuser"
        self.noteId = "1"
        self.filename = "GbtVktabMAA-FYo.jpg"
        self.file_path = os.path.join(settings.BASE_DIR, 'db_modules', 'fileTemp', self.filename)
        self.url = f"http://localhost:8000/media/{self.username}/{self.noteId}/{self.filename}/"

        # Create a test file
        os.makedirs(os.path.dirname(self.file_path), exist_ok=True)
        with open(self.file_path, "wb") as f:
            f.write(b"Test file content")

    def tearDown(self):
        # Clean up the test file
        if os.path.exists(self.file_path):
            os.remove(self.file_path)
    @patch("db_modules.UserFileData.check_file_name")
    def test_file_retrieval_success(self, mock_check_file_name):
        mock_check_file_name.return_value = True

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.get("Content-Type"), "image/jpg")
        self.assertEqual(response.content, b"Test file content")

    @patch("db_modules.UserFileData.check_file_name")
    def test_file_not_found_filesystem(self, mock_check_file_name):
        mock_check_file_name.return_value = True

        # Remove test file to simulate file not found
        if os.path.exists(self.file_path):
            os.remove(self.file_path)

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("error", response.json())

    @patch("db_modules.UserFileData.check_file_name")
    def test_file_not_found_database(self, mock_check_file_name):
        mock_check_file_name.return_value = False

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.json())

    @patch("db_modules.UserFileData.check_file_name")
    def test_file_unknown_mime_type(self, mock_check_file_name):
        mock_check_file_name.return_value = True

        # Create a test file with an unknown extension
        unknown_file = os.path.join(settings.BASE_DIR, 'db_modules', 'fileTemp', "unknownfile.unknown")
        with open(unknown_file, "wb") as f:
            f.write(b"Test content for unknown type")
        
        url = f"/api/media/{self.username}/{self.noteId}/unknownfile.unknown/"
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.get("Content-Type"), "application/octet-stream")
        self.assertEqual(response.content, b"Test content for unknown type")

        # Cleanup
        if os.path.exists(unknown_file):
            os.remove(unknown_file)

    @patch("db_modules.UserFileData.check_file_name")
    def test_internal_server_error(self, mock_check_file_name):
        mock_check_file_name.return_value = True

        # Simulate error by removing read permissions
        os.chmod(self.file_path, 0o000)

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertIn("error", response.json())

        # Restore permissions for cleanup
        os.chmod(self.file_path, 0o644)
'''