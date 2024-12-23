'''from django.test import TestCase
from django.conf import settings
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
import os
import shutil

class TestViewMediaFileView(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.username = "testuser"
        self.note_id = "1"
        self.filename = "testfile.txt"

        # Setup mock file path
        self.file_temp_dir = os.path.join(settings.BASE_DIR, 'db_modules', 'fileTemp')
        os.makedirs(self.file_temp_dir, exist_ok=True)
        
        self.file_path = os.path.join(self.file_temp_dir, self.filename)
        
        # Create a mock file
        with open(self.file_path, 'rb') as f:
            f.close()  # Close the file before deleting
            os.remove(self.file_path)


        # Mock `UserFileData.check_file_name` method
        from unittest.mock import patch
        self.check_file_name_patch = patch('db_modules.UserFileData.check_file_name', return_value=True)
        self.mock_check_file_name = self.check_file_name_patch.start()

    def tearDown(self):
        # Cleanup the mock file and directory
        if os.path.exists(self.file_temp_dir):
            shutil.rmtree(self.file_temp_dir)

        # Stop the mock
        self.check_file_name_patch.stop()

    def test_file_found_and_returned(self):
        """Test that the file is found and returned with correct MIME type."""
        url = reverse('media_view_file', kwargs={
            'username': self.username,
            'noteId': self.note_id,
            'filename': self.filename
        })

        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response["Content-Type"], "text/plain")
        self.assertEqual(response.content.decode(), "This is a test file.")

    def test_file_not_found(self):
        """Test that a 404 error is returned if the file does not exist."""
        url = reverse('media_view_file', kwargs={
            'username': self.username,
            'noteId': self.note_id,
            'filename': "nonexistentfile.txt"
        })

        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["error"], "File not found")

    def test_invalid_check_file_name(self):
        """Test that a 400 error is returned if check_file_name fails."""
        self.mock_check_file_name.return_value = False

        url = reverse('media_view_file', kwargs={
            'username': self.username,
            'noteId': self.note_id,
            'filename': self.filename
        })

        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["error"], "File not found")

    def test_server_error(self):
        """Test that a 500 error is returned if an exception occurs while opening the file."""
        with open(self.file_path, 'rb') as f:
            os.remove(self.file_path)  # Simulate a file deletion before response

            url = reverse('media_view_file', kwargs={
                'username': self.username,
                'noteId': self.note_id,
                'filename': self.filename
            })

            response = self.client.get(url)

            self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
            self.assertIn("error", response.data)
'''