import sqlite3

BACK_DB = "db_modules/pydb.db"
TEST_DB = "D:\simple-note-2\simple-note-2\\back\djangogirls\djangogirls_venv\myproject\db_modules\pydb.db"


class DB:
    def __init__(self):
        self.conn = sqlite3.connect(TEST_DB)
        self.cursor = self.conn.cursor()

    # def check_signin(self, username, user_password):
    #     # 使用 SQL 查詢檢查是否有相同的使用者名稱和密碼
    #     self.cursor.execute(
    #         "SELECT * FROM User_Personal_Info WHERE username = ? AND user_password = ?;",
    #         (username, user_password),
    #     )
    #     # 檢索結果
    #     row = self.cursor.fetchone()
    #     # 如果有相同的資料，回傳 True；否則回傳 False
    #     return bool(row)

    # # check_register
    # def check_register_username(self, username):
    #     # 使用 SQL 查詢檢查是否有相同的使用者名稱
    #     self.cursor.execute(
    #         "SELECT * FROM User_Personal_Info WHERE username = ?;", (username,)
    #     )
    #     # 檢索結果
    #     row = self.cursor.fetchone()
    #     # 如果有相同的資料，回傳 True；否則回傳 False
    #     return bool(row)

    # def check_register_user_email(self, user_email):
    #     # 使用 SQL 查詢檢查是否有相同的使用者電子郵件
    #     self.cursor.execute(
    #         "SELECT * FROM User_Personal_Info WHERE user_email = ?;", (user_email,)
    #     )
    #     # 檢索結果
    #     row = self.cursor.fetchone()
    #     # 如果有相同的資料，回傳 True；否則回傳 False
    #     return bool(row)

    # def insert_into_User_Register_Data(self, username, user_email, user_password):
    #     try:
    #         # 新增資料到 User_Personal_Info 表格
    #         user_data = (username, user_email, user_password, 0)
    #         self.cursor.execute(
    #             "INSERT INTO User_Personal_Info (username, user_email, user_password, login_status) VALUES (?, ?, ?, ?);",
    #             user_data,
    #         )
    #         self.conn.commit()
    #         return True
    #     except sqlite3.Error as e:
    #         return e

    # def check_signin_status(self, username):
    #     self.cursor.execute(
    #         "SELECT login_status FROM User_Personal_Info WHERE username = ?;",
    #         (username,),
    #     )
    #     # 獲取查詢結果的第一行
    #     row = self.cursor.fetchone()
    #     # 如果有結果，取出 login_status 的值
    #     if row:
    #         login_status = row[0]
    #         return login_status
    #     else:
    #         # 如果沒有結果，返回一個None
    #         return None

    # # 給useremail查password
    # def useremail_to_userpassword(self, user_email):
    #     self.cursor.execute(
    #         "SELECT user_password FROM User_Personal_Info WHERE user_email = ?;",
    #         (user_email,),
    #     )
    #     # 獲取查詢結果的第一行
    #     row = self.cursor.fetchone()
    #     # 如果有結果，取出 user_password 的值
    #     if row:
    #         user_password = row[0]
    #         return user_password
    #     else:
    #         # 如果沒有結果，返回一個None
    #         return None

    # # 給username和note_name查content_blob
    # def username_note_name_return_content_blob(self, username, note_name):
    #     self.cursor.execute(
    #         "SELECT content_blob FROM User_File_Data WHERE note_id = (SELECT id FROM User_Note_Data WHERE user_id = (SELECT id FROM User_Personal_Info where username=?) AND note_name = ?);",
    #         (username, note_name),
    #     )
    #     # 獲取查詢結果的第一行
    #     row = self.cursor.fetchone()
    #     # 如果有結果，取出 content_blob 的值
    #     if row:
    #         content_blob = row[0]
    #         return content_blob
    #     else:
    #         # 如果沒有結果，返回一個 None
    #         return None

    # # 給username和note_name查content_mimetype
    # def username_note_name_return_content_mimetype(self, username, note_name):
    #     self.cursor.execute(
    #         "SELECT content_mimetype FROM User_File_Data WHERE note_id = (SELECT id FROM User_Note_Data WHERE user_id = (SELECT id FROM User_Personal_Info where username=?) AND note_name = ?);",
    #         (username, note_name),
    #     )
    #     # 獲取查詢結果的第一行
    #     row = self.cursor.fetchone()
    #     # 如果有結果，取出 content_mimetype 的值
    #     if row:
    #         content_mimetype = row[0]
    #         return content_mimetype
    #     else:
    #         # 如果沒有結果，返回一個 None
    #         return None

    # def change_login_status(self, username):
    #     self.cursor.execute(
    #         "SELECT login_status FROM User_Personal_Info WHERE username = ?;",
    #         (username,),
    #     )
    #     # 獲取查詢結果的第一行
    #     row = self.cursor.fetchone()
    #     if row:
    #         current_status = row[0]
    #         # row 0 改為 1，1 改為 0
    #         new_status = 1 if current_status == 0 else 0
    #         # UPDATE更新 login_status
    #         self.cursor.execute(
    #             "UPDATE User_Personal_Info SET login_status = ? WHERE username = ?;",
    #             (new_status, username),
    #         )
    #         # 提交修改
    #         self.conn.commit()
    #         return True
    #     else:
    #         return f"No result found for {username}"

    # # 透過username和file_title_id插入內容
    # def update_content_username_file_title_id(self, username, file_title_id, content):
    #     try:
    #         self.cursor.execute(
    #             "SELECT content FROM User_Note_Data WHERE user_id = (SELECT id FROM User_Personal_Info where username=?) AND file_title_id = ?;",
    #             (
    #                 username,
    #                 file_title_id,
    #             ),
    #         )
    #         # 獲取查詢結果的第一行
    #         row = self.cursor.fetchone()
    #         print(row)
    #         if row is None:
    #             # 如果資料不存在，則使用 INSERT 插入新資料
    #             self.cursor.execute(
    #                 "INSERT INTO User_Note_Data (user_id, file_title_id, content) VALUES ((SELECT id FROM User_Personal_Info WHERE username = ?), ?, ?);",
    #                 (username, file_title_id, content),
    #             )
    #         else:
    #             # 如果資料存在，則使用 UPDATE 更新資料
    #             self.cursor.execute(
    #                 "UPDATE User_Note_Data SET content = ?, file_title_id = ? WHERE user_id = (SELECT id FROM User_Personal_Info WHERE username = ?);",
    #                 (content, file_title_id, username),
    #             )
    #         self.conn.commit()
    #         return True
    #     except sqlite3.Error as e:
    #         return e

    # # 透過username和file_title_id回傳內容
    # def filename_load_content(self, username, file_title_id):
    #     try:
    #         self.cursor.execute(
    #             "SELECT content FROM User_Note_Data WHERE user_id = (SELECT id FROM User_Personal_Info WHERE username = ?) AND file_title_id = ?;",
    #             (
    #                 username,
    #                 file_title_id,
    #             ),
    #         )
    #         # 獲取查詢結果的第一行
    #         row = self.cursor.fetchone()
    #         return row
    #     except sqlite3.Error as e:
    #         return e

    # # insert user_id和note_name到User_Note_Data裡
    # def insert_user_id_note_name_User_Note_Data(
    #     self, username, note_name, file_title_id
    # ):
    #     try:
    #         user_data = (username, note_name, file_title_id)
    #         self.cursor.execute(
    #             "INSERT INTO User_Note_Data (user_id, note_name ,file_title_id) VALUES ((SELECT id FROM User_Personal_Info WHERE username = ?), ?,?);",
    #             user_data,
    #         )
    #         self.conn.commit()
    #         return True
    #     except sqlite3.Error as e:
    #         return e

    # 給username, note_name 插入 content_blob, content_mimetype
    # username or note_name 不存在會傳回錯誤。
    def insert_User_File_Data_content_blob_and_content_mimetype(
        self, username, note_name, content_blob, content_mimetype
    ):
        try:
            self.cursor.execute(
                "SELECT id FROM User_Personal_Info WHERE username=?;", (username,)
            )
            user_id = self.cursor.fetchone()
            if user_id is None:
                return "Error: Username does not exist"

            self.cursor.execute(
                "SELECT id FROM User_Note_Data WHERE user_id = ? AND note_name = ?;",
                (user_id[0], note_name),
            )
            note_id = self.cursor.fetchone()
            if note_id is None:
                return "Error: Note name does not exist"

            self.cursor.execute(
                "INSERT INTO User_File_Data (note_id, content_blob , content_mimetype) VALUES (?, ? ,?);",
                (note_id[0], content_blob, content_mimetype),
            )
            self.conn.commit()
            return "Insert successful !!!"

        except sqlite3.Error as e:
            return f"Error: {str(e)}"

    # 給username, note_name update content_blob and content_mimetype
    # username or note_name 不存在會傳回錯誤。
    def update_User_File_Data_content_blob_and_content_mimetype(
        self, username, note_name, content_blob, content_mimetype
    ):
        try:
            # check username exist
            self.cursor.execute(
                "SELECT id FROM User_Personal_Info WHERE username=?;", (username,)
            )
            user_id = self.cursor.fetchone()
            if user_id is None:
                return "Error: Username does not exist"

            # check note_name exist
            self.cursor.execute(
                "SELECT id FROM User_Note_Data WHERE user_id = ? AND note_name = ?;",
                (user_id[0], note_name),
            )
            note_id = self.cursor.fetchone()
            if note_id is None:
                return "Error: Note name does not exist"

            # update content_blob and content_mimetype
            self.cursor.execute(
                "UPDATE User_File_Data SET content_blob = ?, content_mimetype = ? WHERE note_id = ?;",
                (content_blob, content_mimetype, note_id[0]),
            )
            self.conn.commit()
            return "Update successful !!!"

        except sqlite3.Error as e:
            return f"Error: {str(e)}"

    # # 給username和file_title_id來刪除整行
    # def delete_User_Note_Data_username_file_title_id(self, username, file_title_id):
    #     try:
    #         user_data = (username, file_title_id)
    #         self.cursor.execute(
    #             "DELETE FROM User_Note_Data WHERE user_id = (SELECT id FROM User_Personal_Info WHERE username = ?) AND file_title_id = ?;",
    #             user_data,
    #         )
    #         self.conn.commit()
    #         return True
    #     except sqlite3.Error as e:
    #         return e

    # # 給username和note_name來刪除整行
    # def delete_User_Note_Data_username_to_note_name(self, username, note_name):
    #     try:
    #         user_data = (username, note_name)
    #         self.cursor.execute(
    #             "DELETE FROM User_Note_Data WHERE user_id = (SELECT id FROM User_Personal_Info WHERE username = ?) AND note_name = ?;",
    #             user_data,
    #         )
    #         self.conn.commit()
    #         return True
    #     except sqlite3.Error as e:
    #         return e

    # # 用username得到User_Personal_Info
    # def get_User_Personal_Info_by_username(
    #     self,
    #     username,
    # ):
    #     try:
    #         self.cursor.execute(
    #             "SELECT * FROM User_Personal_Info WHERE username = ?;",
    #             (username,),
    #         )
    #         # 獲取查詢結果的第一行
    #         row = self.cursor.fetchone()
    #         self.conn.commit()
    #         return row
    #     except sqlite3.Error as e:
    #         return e

    # # 插入User_Personal_Theme_Data的theme by username
    # def insert_User_theme_by_username(
    #     self,
    #     username,
    #     theme_name,
    # ):
    #     try:
    #         self.cursor.execute(
    #             "INSERT INTO User_Personal_Theme_Data (user_id, theme_name) VALUES ((SELECT id FROM User_Personal_Info WHERE username = ?), ?);",
    #             (
    #                 username,
    #                 theme_name,
    #             ),
    #         )
    #         return True
    #     except sqlite3.Error as e:
    #         return e

    # # 給username插入或更新profile_photo
    # def update_profile_photo_by_username(self, username, profile_photo):
    #     try:
    #         # 直接執行 UPDATE 語句
    #         self.cursor.execute(
    #             "UPDATE User_Personal_Info SET profile_photo = ? WHERE username = ?;",
    #             (profile_photo, username),
    #         )
    #         # 如果沒有影響任何行，表示沒有找到對應的使用者名稱，因此插入新資料
    #         if self.cursor.rowcount == 0:
    #             self.cursor.execute(
    #                 "INSERT INTO User_Personal_Info (username, profile_photo) VALUES (?, ?);",
    #                 (username, profile_photo),
    #             )
    #         self.conn.commit()
    #         return True
    #     except sqlite3.Error as e:
    #         return e

    # # 給username插入或更新theme
    # def update_theme_by_username(self, username, theme):
    #     try:
    #         # 直接執行 UPDATE 語句
    #         self.cursor.execute(
    #             "UPDATE User_Personal_Info SET theme = ? WHERE username = ?;",
    #             (theme, username),
    #         )
    #         # 如果沒有影響任何行，表示沒有找到對應的使用者名稱，因此插入新資料
    #         if self.cursor.rowcount == 0:
    #             self.cursor.execute(
    #                 "INSERT INTO User_Personal_Info (username, theme) VALUES (?, ?);",
    #                 (username, theme),
    #             )
    #         self.conn.commit()
    #         return True
    #     except sqlite3.Error as e:
    #         return e

    # def update_user_email_by_username(self, username, user_email):
    #     try:
    #         # 直接執行 UPDATE 語句
    #         self.cursor.execute(
    #             "UPDATE User_Personal_Info SET user_email = ? WHERE username = ?;",
    #             (user_email, username),
    #         )
    #         # 如果沒有影響任何行，表示沒有找到對應的使用者名稱，因此插入新資料
    #         if self.cursor.rowcount == 0:
    #             self.cursor.execute(
    #                 "INSERT INTO User_Personal_Info (username, user_email) VALUES (?, ?);",
    #                 (username, user_email),
    #             )
    #         self.conn.commit()
    #         return True
    #     except sqlite3.Error as e:
    #         return False

    # 給username插入或更新user_password
    def update_user_password_by_username(self, username, user_password):
        try:
            # 直接執行 UPDATE 語句
            self.cursor.execute(
                "UPDATE User_Personal_Info SET user_password = ? WHERE username = ?;",
                (user_password, username),
            )
            # 如果沒有影響任何行，表示沒有找到對應的使用者名稱，因此插入新資料
            if self.cursor.rowcount == 0:
                self.cursor.execute(
                    "INSERT INTO User_Personal_Info (username, user_password) VALUES (?, ?);",
                    (username, user_password),
                )
            self.conn.commit()
            return True
        except sqlite3.Error as e:
            return e

    # 給username插入或更新login_status
    def update_login_status_by_username(self, username, login_status):
        try:
            # 直接執行 UPDATE 語句
            self.cursor.execute(
                "UPDATE User_Personal_Info SET login_status = ? WHERE username = ?;",
                (login_status, username),
            )
            # 如果沒有影響任何行，表示沒有找到對應的使用者名稱，因此插入新資料
            if self.cursor.rowcount == 0:
                self.cursor.execute(
                    "INSERT INTO User_Personal_Info (username, login_status) VALUES (?, ?);",
                    (username, login_status),
                )
            self.conn.commit()
            return True
        except sqlite3.Error as e:
            return e

    # 給username插入themeData的資料
    def username_insert_themeData(
        self,
        username,
        theme_name,
        color_light_primary,
        color_light_base_bg,
        color_dark_primary,
        color_dark_base_bg,
    ):
        try:
            self.cursor.execute(
                "SELECT id FROM User_Personal_Info WHERE username = ?",
                (username,),
            )
            # 獲取查詢結果的第一行
            row = self.cursor.fetchone()
            if row is None:
                return "username not exist"
            else:
                user_id = row[0]
                # 檢查是否存在具有相同條件的資料
                self.cursor.execute(
                    "SELECT * FROM User_Personal_Theme_Data WHERE user_id = ? AND theme_name = ? AND color_light_primary = ? AND color_light_base_bg = ? AND color_dark_primary = ? AND color_dark_base_bg = ?",
                    (
                        user_id,
                        theme_name,
                        color_light_primary,
                        color_light_base_bg,
                        color_dark_primary,
                        color_dark_base_bg,
                    ),
                )
                existing_row = self.cursor.fetchone()
                if existing_row:
                    # 如果存在相同條件的資料，則不執行插入操作
                    return "Data already exists"
                else:
                    # 執行插入操作
                    self.cursor.execute(
                        "INSERT INTO User_Personal_Theme_Data (user_id, theme_name, color_light_primary, color_light_base_bg, color_dark_primary, color_dark_base_bg) VALUES (?, ?, ?, ?, ?, ?)",
                        (
                            user_id,
                            theme_name,
                            color_light_primary,
                            color_light_base_bg,
                            color_dark_primary,
                            color_dark_base_bg,
                        ),
                    )
                    self.conn.commit()
                    return True
        except sqlite3.Error as e:
            return e

    def close_connection(self):
        # 關閉游標和資料庫連接
        self.cursor.close()
        self.conn.close()


my_db = DB()
print(my_db. username_note_name_return_content_blob('user01','個人筆記',))

