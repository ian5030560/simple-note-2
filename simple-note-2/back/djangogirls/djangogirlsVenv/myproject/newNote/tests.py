from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch
import json

class NewNoteViewTest(APITestCase):
    def setUp(self):
        self.url = "http://localhost:8000/note/new/"  # Replace with your actual endpoint
        self.valid_payload = {
            "username": "testuser",
            "noteId": "123",
            "notename": "note123",
            "parentId": "456",
            "silblingId": "789",
        }
    
    @patch("db_modules.UserNoteData.insert_user_id_note_name")
    @patch("db_modules.UserSubNoteData.insert_data")
    def test_post_valid_data(self, mock_insert_subnote, mock_insert_note):
        """Test POST request with valid data."""
        mock_insert_note.return_value = True
        mock_insert_subnote.return_value = True

        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch("db_modules.UserNoteData.insert_user_id_note_name")
    @patch("db_modules.UserSubNoteData.insert_data")
    def test_post_invalid_note_data(self, mock_insert_subnote, mock_insert_note):
        """Test POST request with invalid note data."""
        mock_insert_note.return_value = False
        mock_insert_subnote.return_value = True

        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("db_modules.UserNoteData.insert_user_id_note_name")
    @patch("db_modules.UserSubNoteData.insert_data")
    def test_post_invalid_subnote_data(self, mock_insert_subnote, mock_insert_note):
        """Test POST request with invalid subnote data."""
        mock_insert_note.return_value = True
        mock_insert_subnote.return_value = False

        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("db_modules.UserNoteData.insert_user_id_note_name")
    @patch("db_modules.UserSubNoteData.insert_data")
    def test_post_invalid_data(self, mock_insert_subnote, mock_insert_note):
        """Test POST request with invalid data for both note and subnote."""
        mock_insert_note.return_value = False
        mock_insert_subnote.return_value = False

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
            "notename": "Test Note",
        }

        response = self.client.post(
            self.url,
            data=json.dumps(invalid_payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
