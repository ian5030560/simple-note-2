import json
from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch

class GetNoteViewTestCase(APITestCase):
    def setUp(self):
        self.url = ('http://localhost:8000/note/get/')  # Replace with your actual URL name for GetNoteView
        self.valid_payload = {
            "username": "testuser",
            "noteId": "1"
        }
        self.invalid_payload = {
            "username": "testuser",
            "noteId": "invalid"
        }

    @patch('db_modules.UserNoteData.check_content')
    def test_get_note_success(self, mock_check_content):
        """Test successful retrieval of note content."""
        mock_check_content.return_value = ["This is the note content."]

        response = self.client.post(self.url, data=json.dumps(self.valid_payload), content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.content.decode('utf-8'), "This is the note content.")
        mock_check_content.assert_called_once_with(
            self.valid_payload['username'], self.valid_payload['noteId']
        )

    # @patch('db_modules.UserNoteData.check_content')
    # def test_get_note_not_found(self, mock_check_content):
    #     response = self.client.post(self.url, data=json.dumps(self.valid_payload), content_type="application/json")
    #     self.assertEqual(response.status_code, 204)  # Check if the status code is 404 Not Found
    #     self.assertIn("error", response.data)  # Check if the response contains an error message


    # @patch('db_modules.UserNoteData.check_content')
    # def test_get_note_failure(self, mock_check_content):
    #     response = self.client.post(self.url, data=json.dumps(self.valid_payload), content_type="application/json")
    #     self.assertEqual(response.status_code, 204)  # Check if the status code is 404 Not Found
    #     self.assertIn("error", response.data)  # Check if the response contains an error message


    def test_invalid_payload(self):
        response = self.client.post(self.url, data=json.dumps(self.invalid_payload), content_type="application/json")
        self.assertEqual(response.status_code, 204)  # Check if the status code is 400 Bad Request

    def test_missing_fields(self):
        incomplete_payload = {"username": "testuser", "noteId": ""}  # Missing 'noteId'
        response = self.client.post(
            self.url,
            data=json.dumps(incomplete_payload),
            content_type="text/plain"
        )

        self.assertEqual(response.status_code, 204)
