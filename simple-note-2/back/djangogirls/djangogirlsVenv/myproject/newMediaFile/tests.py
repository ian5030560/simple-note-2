import io
from unittest.mock import patch

from rest_framework import status
from rest_framework.test import APITestCase


class NewMediaFileViewTest(APITestCase):
    def setUp(self):
        """設置測試環境"""
        self.url = "http://localhost:8000/media/new/"  # 文件上傳API的URL
        self.valid_payload = {
            "username": "testuser",  # 用戶名
            "filename": "testfile.txt",  # 文件名稱
            "noteId": "1",  # 筆記ID
        }
        self.valid_file_content = io.BytesIO(
            b"Test file content"
        )  # 模擬的文件內容（以二進位形式）

    @patch("db_modules.UserFileData.check_file_name")  # 模擬檢查文件名稱是否存在的方法
    @patch("db_modules.UserFileData.insert_file_name")  # 模擬插入文件名稱到資料庫的方法
    @patch("db_modules.SaveFile.SaveFile.saveNewFile")  # 模擬文件保存方法
    def test_post_successful_file_upload(
        self, mock_save_new_file, mock_insert_file_name, mock_check_file_name
    ):
        """測試POST請求成功上傳媒體文件"""

        # 模擬檔案不存在，能夠成功插入和保存
        mock_check_file_name.return_value = False  # 檔案不存在
        mock_insert_file_name.return_value = True  # 資料庫插入成功
        mock_save_new_file.return_value = True  # 檔案保存成功

        # 發送POST請求，包含有效的測試資料和檔案內容
        response = self.client.post(
            self.url,
            {
                **self.valid_payload,
                "content": self.valid_file_content,  # 上傳的文件內容
            },
            format="multipart",  # 指定上傳格式為multipart
        )

        # 檢查回應狀態碼是否為200
        self.assertEqual(response.status_code, 200)

        # 檢查回應內容中是否包含文件URL
        self.assertIn("http://testserver/media/", response.content.decode())

        # 確認mock的方法被正確調用
        mock_check_file_name.assert_called_once_with(
            self.valid_payload["username"],
            self.valid_payload["noteId"],
            self.valid_payload["filename"],
        )
        mock_insert_file_name.assert_called_once_with(
            self.valid_payload["username"],
            self.valid_payload["noteId"],
            self.valid_payload["filename"],
        )
        mock_save_new_file.assert_called_once()  # 確認保存文件的方法被調用一次

    @patch("db_modules.UserFileData.check_file_name")  # 模擬檢查文件名稱是否存在的方法
    @patch(
        "db_modules.SaveFile.SaveFile.renameAganistDumplication"
    )  # 模擬文件名稱重命名方法
    def test_post_duplicate_file_name(
        self, mock_rename_against_duplication, mock_check_file_name
    ):
        """測試POST請求檔案名稱重複的情況"""

        # 模擬檔案名稱已經存在，將重命名
        mock_check_file_name.return_value = True  # 檔案已存在
        mock_rename_against_duplication.return_value = (
            "testfile(1).txt"  # 重命名後的檔案名稱
        )

        with patch(
            "db_modules.UserFileData.insert_file_name"
        ) as mock_insert_file_name, patch(
            "db_modules.SaveFile.SaveFile.saveNewFile"
        ) as mock_save_new_file:

            mock_insert_file_name.return_value = True  # 模擬插入文件名稱成功
            mock_save_new_file.return_value = True  # 模擬檔案保存成功

            # 發送POST請求，包含有效的測試資料和檔案內容
            response = self.client.post(
                self.url,
                {
                    **self.valid_payload,
                    "content": self.valid_file_content,  # 上傳的文件內容
                },
                format="multipart",  # 指定上傳格式為multipart
            )

            # 檢查回應狀態碼是否為200
            self.assertEqual(response.status_code, 200)

            # 檢查回應內容中是否包含文件URL
            self.assertIn("http://testserver/media/", response.content.decode())

            # 確認mock的方法被正確調用
            mock_check_file_name.assert_called_once()  # 確認檢查文件名稱方法被調用一次
            mock_rename_against_duplication.assert_called_once_with(
                self.valid_payload["filename"]
            )  # 確認檔案名稱重命名方法被調用一次

    def test_post_invalid_payload(self):
        """測試POST請求無效的payload（缺少必要欄位）"""

        # 發送缺少filename和content的POST請求
        response = self.client.post(
            self.url,
            {
                "username": "testuser",  # 只有用戶名，缺少檔案名稱和內容
            },
            format="multipart",  # 指定上傳格式為multipart
        )

        # 檢查回應狀態碼是否為401
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
