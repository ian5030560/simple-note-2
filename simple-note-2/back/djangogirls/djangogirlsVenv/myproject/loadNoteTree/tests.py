# test_views.py
from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch
import json

class LoadNoteTreeViewTests(APITestCase):

    def setUp(self):
        self.url = "http://localhost:8000/note/tree/"
        self.valid_payload = {"username": "testuser"}
        self.invalid_payload = {"username": "invaliduser"}

    @patch("db_modules.UserNoteData.check_user_all_notes")
    @patch("db_modules.UserSubNoteData.check_parent_id")
    @patch("db_modules.UserSubNoteData.check_sibling_id")
    def test_post_valid_single_notes(self, mock_check_sibling_id, mock_check_parent_id, mock_check_user_all_notes):
        """Test POST request with valid single notes data."""
        
        # Mock user notes data
        mock_check_user_all_notes.return_value = [
            ("Note1", "ID1"),
            ("Note2", "ID2")
        ]
        
        # Mock parent and sibling data
        mock_check_parent_id.side_effect = ["Parent1", "Parent2"]
        mock_check_sibling_id.side_effect = ["Sibling1", "Sibling2"]
        
        response = self.client.post(self.url, json.dumps(self.valid_payload), content_type="application/json")
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {
            "one": [
                {"noteId": "ID1", "noteName": "Note1", "parentId": "Parent1", "silblingId": "Sibling1"},
                {"noteId": "ID2", "noteName": "Note2", "parentId": "Parent2", "silblingId": "Sibling2"}
            ],
            "multiple": []
        })

    @patch("db_modules.UserNoteData.check_user_all_notes")
    @patch("db_modules.UserCollaborateNote.check_url")
    @patch("db_modules.UserCollaborateNote.check_all_noteID_by_guest")
    @patch("db_modules.UserNoteData.check_note_title_id_by_note_id")
    @patch("db_modules.UserNoteData.check_note_name_by_note_id")
    def test_post_valid_collaboration_notes(
        self, mock_check_note_name, mock_check_note_title_id,
        mock_check_all_noteID_by_guest, mock_check_url, mock_check_user_all_notes
    ):
        """Test POST request with valid collaboration notes data."""
        
        # Mock user notes data (empty for single notes)
        mock_check_user_all_notes.return_value = []
        
        # Mock collaboration URLs and note IDs
        mock_check_url.return_value = [("testurl",)]
        mock_check_all_noteID_by_guest.return_value = [("1",)]
        
        # Mock title ID and note name for collaboration notes
        mock_check_note_title_id.return_value = "1"
        mock_check_note_name.return_value = "note1"
        
        response = self.client.post(self.url, json.dumps(self.valid_payload), content_type="application/json")
        
        # print(response.json())  # Debugging
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {
            "one": [],
            "multiple": []
        })


    @patch("db_modules.UserNoteData.check_user_all_notes")
    def test_post_sql_error(self, mock_check_user_all_notes):
        """Test POST request when a SQL error occurs."""
        
        # Mock SQL error scenario
        mock_check_user_all_notes.return_value = False
        
        response = self.client.post(self.url, json.dumps(self.valid_payload), content_type="application/json")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), "SQL error.")

    def test_post_invalid_request_body(self):
        """Test POST request with an invalid payload."""
        
        response = self.client.post(self.url, json.dumps(self.invalid_payload), content_type="application/json")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

