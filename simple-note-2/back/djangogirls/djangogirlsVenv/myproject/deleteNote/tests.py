import json
from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch

class DeleteNoteViewTestCase(APITestCase):
    def setUp(self):
        self.url = ('http://localhost:8000/note/delete/')  # Replace with your actual URL name
        self.valid_payload = {
            "username": "test_user",
            "noteId": "test_note_id"
        }
        self.invalid_payload_data = {
            "username": "123",
            "noteId": ""
        }
        self.invalid_payload_note = {
            "username": "321",
            "noteId": "321"
        }
        self.invalid_payload = {
            "invalid_key": "invalid_value"
        }

    @patch('db_modules.UserSubNoteData.delete_data')
    @patch('db_modules.UserNoteData.delete_note_by_usernames_note_title_id')
    def test_delete_note_success(self, mock_delete_note, mock_delete_data):
        """Test successful deletion of a note."""
        mock_delete_data.return_value = True
        mock_delete_note.return_value = True

        response = self.client.post(self.url, data=json.dumps(self.valid_payload), content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_delete_data.assert_called_once_with(self.valid_payload['noteId'])
        mock_delete_note.assert_called_once_with(
            self.valid_payload['username'],
            self.valid_payload['noteId']
        )

    @patch('db_modules.UserSubNoteData.delete_data')
    @patch('db_modules.UserNoteData.delete_note_by_usernames_note_title_id')
    def test_delete_data_failure(self, mock_delete_note, mock_delete_data):
        """Test failure in deleting sub-note data."""
        # Simulate a failure in sub-note deletion
        mock_delete_data.return_value = {"error": "Sub-note deletion failed"}

        response = self.client.post(self.url, data=json.dumps(self.valid_payload), content_type="application/json")

        # Assert response status and content
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), {"error": "Sub-note deletion failed"})

        # Assert that delete_data was called and delete_note was NOT called
        mock_delete_data.assert_called_once_with(self.valid_payload['noteId'])
        mock_delete_note.assert_not_called()


    @patch('db_modules.UserSubNoteData.delete_data')
    @patch('db_modules.UserNoteData.delete_note_by_usernames_note_title_id')
    def test_delete_note_failure(self, mock_delete_note, mock_delete_data):
        """Test failure in deleting the main note."""
        mock_delete_data.return_value = True
        mock_delete_note.return_value = {"error": "Main note deletion failed"}

        response = self.client.post(self.url, data=json.dumps(self.invalid_payload_note), content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.json(), {"error": "Main note deletion failed"})
        mock_delete_data.assert_called_once_with(self.invalid_payload_note['noteId'])
        mock_delete_note.assert_called_once_with(
            self.invalid_payload_note['username'],
            self.invalid_payload_note['noteId']
        )

    def test_invalid_payload(self):
        """Test handling of invalid payload."""
        response = self.client.post(self.url, data=json.dumps(self.invalid_payload), content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_402_PAYMENT_REQUIRED)
        self.assertEqual(response.json(), {"error": "Missing required fields"})

    @patch('db_modules.UserSubNoteData.delete_data')
    @patch('db_modules.UserNoteData.delete_note_by_usernames_note_title_id')
    def test_missing_fields(self, mock_delete_note, mock_delete_data):
        """Test handling of missing fields in payload."""
        incomplete_payload = {
            "username": "test_user"
        }

        response = self.client.post(self.url, data=json.dumps(incomplete_payload), content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_402_PAYMENT_REQUIRED)
        self.assertEqual(response.json(), {"error": "Missing required fields"})
        mock_delete_data.assert_not_called()
        mock_delete_note.assert_not_called()
