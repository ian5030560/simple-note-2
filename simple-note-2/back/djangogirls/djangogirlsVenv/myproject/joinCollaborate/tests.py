'''from django.test import TestCase

# Create your tests here.
a = [('user18',), ('user18',)]
b = 'user18'

# Convert string b to a tuple
b_tuple = (b,)

if b_tuple in a:
    print("in")
'''
# test_views.py
from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch
import json

class JoinCollaborateViewTests(APITestCase):

    def setUp(self):
        self.url = "http://localhost:8000/collaborate/join/"
        self.valid_payload = {
            "username": "testuser2",
            "mastername": "testuser",
            "noteId": "1",
            "url": "testurl",
        }
        self.invalid_payload = {
            "username": "invalid_user2",
            "mastername": "testuser",
            "noteId": "1",
            "url": "testurl",
        }

    @patch("db_modules.UserCollaborateNote.check_all_guest")
    def test_post_duplicate_user(self, mock_check_all_guest):
        """Test POST request when the user is already part of the collaboration."""
        
        # Mock the check_all_guest function to return the existing guest
        mock_check_all_guest.return_value = [("guest_user",)]
        
        response = self.client.post(self.url, json.dumps(self.valid_payload), content_type="application/json")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    @patch("db_modules.UserCollaborateNote.check_all_guest")
    def test_post_no_guests_found(self, mock_check_all_guest):
        """Test POST request when no guests are found for the collaboration."""
        
        # Mock the check_all_guest function to return None (no guests found)
        mock_check_all_guest.return_value = None
        
        response = self.client.post(self.url, json.dumps(self.valid_payload), content_type="application/json")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("db_modules.UserCollaborateNote.check_all_guest")
    @patch("db_modules.UserCollaborateNote.insert_newData")
    def test_post_insert_failure(self, mock_insert_newData, mock_check_all_guest):
        """Test POST request when inserting new data fails."""
        
        # Mock the check_all_guest function to return no existing users
        mock_check_all_guest.return_value = []
        
        # Mock the insert_newData function to return False (failure)
        mock_insert_newData.return_value = False
        
        response = self.client.post(self.url, json.dumps(self.valid_payload), content_type="application/json")
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_invalid_request_body(self):
        """Test POST request with invalid data."""
        
        response = self.client.post(self.url, json.dumps(self.invalid_payload), content_type="application/json")
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
