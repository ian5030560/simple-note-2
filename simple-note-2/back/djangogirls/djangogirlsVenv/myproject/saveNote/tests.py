from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch
import json

class SaveNoteViewTest(APITestCase):
    def setUp(self):
        self.url = "http://localhost:8000/note/save/"  # Replace with the actual endpoint
        self.valid_payload = {
            "username": "testuser",
            "noteId": "1",
            "content": "This is a test note."
        }
        self.invalid_payload_missing_fields = {
            "username": "testuser",
            "noteId": "1"
            # Missing "content"
        }

    @patch("db_modules.UserNoteData.update_content")
    def test_save_note_success(self, mock_update_content):
        """Test successful saving of a note."""
        mock_update_content.return_value = True  # Simulate successful update

        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_save_note_missing_fields(self):
        """Test saving a note with missing required fields."""
        response = self.client.post(
            self.url,
            data=json.dumps(self.invalid_payload_missing_fields),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_save_note_empty_payload(self):
        """Test saving a note with an empty payload."""
        response = self.client.post(
            self.url,
            data=json.dumps({}),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
