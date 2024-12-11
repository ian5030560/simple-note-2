import json
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from unittest.mock import patch

class DeleteCollaborateViewTestCase(APITestCase):
    def setUp(self):
        self.url = ('http://localhost:8000/collaborate/delete/')  # Replace with your actual URL name
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
        print("response",response)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        mock_delete_all_data.assert_called_once_with(
            self.valid_payload['masterName'],
            self.valid_payload['noteId']
        )

    def test_invalid_payload(self):
        """Test handling of invalid payload."""
        response = self.client.post(self.url, data=json.dumps(self.invalid_payload), content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_serializer_validation(self):
        """Test serializer validation logic."""
        with patch('deleteCollaborate.serializers.DeleteCollaborateSerializer.is_valid', return_value=True) as mock_is_valid, patch('deleteCollaborate.serializers.DeleteCollaborateSerializer.save') as mock_save:

            response = self.client.post(self.url, data=json.dumps(self.valid_payload), content_type="application/json")

            self.assertEqual(response.status_code, status.HTTP_200_OK)
            mock_is_valid.assert_called_once()
            mock_save.assert_called_once()

    def test_serializer_invalid_data(self):
        """Test serializer handling of invalid data."""
        with patch('deleteCollaborate.serializers.DeleteCollaborateSerializer.is_valid', return_value=False) as mock_is_valid:
            response = self.client.post(self.url, data=json.dumps(self.valid_payload), content_type="application/json")

            self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
            mock_is_valid.assert_called_once()
