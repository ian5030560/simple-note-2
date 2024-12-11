import json
from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch

class DeleteFileViewTestCase(APITestCase):
    def setUp(self):
        self.url = ('http://localhost:8000/media/delete/')  # Replace with your actual URL name
        self.valid_payload = {
            "username": "test_user",
            "note_title_id": "test_note_id",
            "url": "test_file"
        }
        self.invalid_payload = {
            "username": "",
            "note_title_id": "",
            "url": ""
        }

    @patch('db_modules.UserFileData.delete_file_name')
    def test_delete_file_success(self, mock_delete_file_name):
        """Test successful deletion of a file."""
        mock_delete_file_name.return_value = True

        response = self.client.post(self.url, data=json.dumps(self.valid_payload), content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_delete_file_name.assert_called_once_with(
            self.valid_payload['username'],
            self.valid_payload['note_title_id'],
            "test_file"  # Ensuring URL processing logic works
        )

    @patch('db_modules.UserFileData.delete_file_name')
    def test_delete_file_failure(self, mock_delete_file_name):
        """Test failure in file deletion."""
        mock_delete_file_name.return_value = {"error": "Deletion failed"}

        response = self.client.post(self.url, data=json.dumps(self.valid_payload), content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), {"error": "Deletion failed"})
        mock_delete_file_name.assert_called_once_with(
            self.valid_payload['username'],
            self.valid_payload['note_title_id'],
            "test_file"
        )

    def test_invalid_payload(self):
        """Test handling of invalid payload."""
        response = self.client.post(self.url, data=json.dumps(self.invalid_payload), content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), {"error": "Missing required fields"})

    @patch('db_modules.UserFileData.delete_file_name')
    def test_missing_fields(self, mock_delete_file_name):
        """Test handling of missing fields in payload."""
        incomplete_payload = {
            "username": "testuser",
            "url": "test_file"
        }

        response = self.client.post(self.url, data=json.dumps(incomplete_payload), content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), {"error": "Missing required fields"})
        mock_delete_file_name.assert_not_called()

    @patch('db_modules.UserFileData.delete_file_name')
    def test_url_processing(self, mock_delete_file_name):
        """Test URL processing logic in the API."""
        mock_delete_file_name.return_value = True

        response = self.client.post(self.url, data=json.dumps(self.valid_payload), content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_delete_file_name.assert_called_once_with(
            self.valid_payload['username'],
            self.valid_payload['note_title_id'],
            "test_file"  # Verifies that the URL was properly processed
        )
