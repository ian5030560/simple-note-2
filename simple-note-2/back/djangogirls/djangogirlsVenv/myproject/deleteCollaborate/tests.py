import json
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from unittest.mock import patch

class DeleteCollaborateViewTestCase(APITestCase):
    def setUp(self):
        self.url = ('http://localhost:8000/collaborate/delete/')  # URL name
        self.valid_payload = {
            "masterName": "testuser",
            "noteId": "1"
        }
        self.invalid_payload = {
            "invalidKey": "invalid_value"
        }

    @patch('db_modules.UserCollaborateNote.delete_all_data')
    def test_delete_collaborate_success(self, mock_delete_all_data):
        """Test successful deletion of collaboration."""
        mock_delete_all_data.return_value = True

        response = self.client.post(self.url, data=json.dumps(self.valid_payload), content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_delete_all_data.assert_called_once_with(
            self.valid_payload['masterName'],
            self.valid_payload['noteId']
        )

    @patch('db_modules.UserCollaborateNote.delete_all_data')
    def test_delete_collaborate_failure(self, mock_delete_all_data):
        """Test failure in deletion of collaboration."""
        mock_delete_all_data.return_value = False

        response = self.client.post(self.url, data=json.dumps(self.valid_payload), content_type="application/json")
        # print("response",response)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        mock_delete_all_data.assert_called_once_with(
            self.valid_payload['masterName'],
            self.valid_payload['noteId']
        )
