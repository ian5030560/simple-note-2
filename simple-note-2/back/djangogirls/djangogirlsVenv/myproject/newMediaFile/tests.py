from unittest.mock import patch
from rest_framework.test import APITestCase
from rest_framework import status
import io

class NewMediaFileViewTest(APITestCase):
    def setUp(self):
        self.url = "http://localhost:8000/media/new/"  # Update with the actual endpoint URL.
        self.valid_payload = {
            "username": "testuser",
            "filename": "testfile.txt",
            "noteId": "1",
        }
        self.valid_file_content = io.BytesIO(b"Test file content")

    @patch("db_modules.UserFileData.check_file_name")
    @patch("db_modules.UserFileData.insert_file_name")
    @patch("db_modules.SaveFile.SaveFile.saveNewFile")
    def test_post_successful_file_upload(self, mock_save_new_file, mock_insert_file_name, mock_check_file_name):
        """Test POST request for successfully uploading a media file."""
        mock_check_file_name.return_value = False  # File does not already exist
        mock_insert_file_name.return_value = True  # Database save successful
        mock_save_new_file.return_value = True  # File save successful

        response = self.client.post(
            self.url,
            {
                **self.valid_payload,
                "content": self.valid_file_content,
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn("http://localhost:8000/media/", response.content.decode())
        mock_check_file_name.assert_called_once_with(
            self.valid_payload["username"], 
            self.valid_payload["noteId"], 
            self.valid_payload["filename"]
        )
        mock_insert_file_name.assert_called_once_with(
            self.valid_payload["username"], 
            self.valid_payload["noteId"], 
            self.valid_payload["filename"]
        )
        mock_save_new_file.assert_called_once()

    @patch("db_modules.UserFileData.check_file_name")
    @patch("db_modules.SaveFile.SaveFile.renameAganistDumplication")
    def test_post_duplicate_file_name(self, mock_rename_against_duplication, mock_check_file_name):
        """Test POST request with a duplicate file name."""
        mock_check_file_name.return_value = True  # File exists
        mock_rename_against_duplication.return_value = "testfile_1.txt"  # Renamed file

        with patch("db_modules.UserFileData.insert_file_name") as mock_insert_file_name, \
             patch("db_modules.SaveFile.SaveFile.saveNewFile") as mock_save_new_file:
            
            mock_insert_file_name.return_value = True
            mock_save_new_file.return_value = True
            
            response = self.client.post(
                self.url,
                {
                    **self.valid_payload,
                    "content": self.valid_file_content,
                },
                format="multipart",
            )

            self.assertEqual(response.status_code, 200)
            self.assertIn("http://localhost:8000/media/", response.content.decode())
            mock_check_file_name.assert_called_once()
            mock_rename_against_duplication.assert_called_once_with(self.valid_payload["filename"])

    def test_post_invalid_payload(self):
        """Test POST request with an invalid payload."""
        response = self.client.post(
            self.url,
            {
                "username": "testuser",  # Missing filename and content
            },
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)