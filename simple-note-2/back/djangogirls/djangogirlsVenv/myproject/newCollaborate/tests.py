from unittest.mock import patch
from rest_framework.test import APITestCase
from rest_framework import status
import json

class NewCollaborateViewTest(APITestCase):
    def setUp(self):
        self.url = "http://localhost:8000/collaborate/new/"  # Update with the actual endpoint URL.
        self.valid_payload = {
            "username": "testuser",
            "noteId": "1",
            "url": "testurl",
        }
        self.invalid_payload_missing_fields = {
            "username": "testuser",
            "noteId": "1"
        }

    @patch("db_modules.UserCollaborateNote.insert_newData")
    def test_post_successful_collaboration(self, mock_insert_newData):
        """Test POST request for successfully creating a new collaboration."""
        # Mocking a successful insertion
        mock_insert_newData.return_value = True

        response = self.client.post(self.url, json.dumps(self.valid_payload), content_type="application/json")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_insert_newData.assert_called_once_with(
            self.valid_payload["username"], 
            self.valid_payload["noteId"], 
            self.valid_payload["username"], 
            self.valid_payload["url"]
        )

    @patch("db_modules.UserCollaborateNote.insert_newData")
    def test_post_unsuccessful_collaboration(self, mock_insert_newData):
        """Test POST request for unsuccessful creation of a new collaboration."""
        # Mocking a failed insertion
        mock_insert_newData.return_value = False

        response = self.client.post(self.url, json.dumps(self.valid_payload), content_type="application/json")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        mock_insert_newData.assert_called_once_with(
            self.valid_payload["username"], 
            self.valid_payload["noteId"], 
            self.valid_payload["username"], 
            self.valid_payload["url"]
        )