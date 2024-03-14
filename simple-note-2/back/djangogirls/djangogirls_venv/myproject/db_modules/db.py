import sqlite3
from os import mkdir

TEST_DB = (
    "simple-note-2\\back\\djangogirls\\djangogirls_venv\\myproject\\db_modules\\pydb.db"
)
BACK_DB = "db_modules/pydb.db"


class DB:
    def __init__(self):
        self.conn = sqlite3.connect(BACK_DB)
        self.cursor = self.conn.cursor()

    def check_signin(self, username, user_password):
        # 使用 SQL 查詢檢查是否有相同的使用者名稱和密碼
        self.cursor.execute(
            "SELECT * FROM User_Personal_Note_Data WHERE username = ? AND user_password = ?;",
            (username, user_password),
        )
        # 檢索結果
        row = self.cursor.fetchone()
        # 如果有相同的資料，回傳 True；否則回傳 False
        return bool(row)

    # check_register
    def check_register_username(self, username):
        # 使用 SQL 查詢檢查是否有相同的使用者名稱
        self.cursor.execute(
            "SELECT * FROM User_Personal_Note_Data WHERE username = ?;", (username,)
        )
        # 檢索結果
        row = self.cursor.fetchone()
        # 如果有相同的資料，回傳 True；否則回傳 False
        return bool(row)

    def check_register_user_email(self, user_email):
        # 使用 SQL 查詢檢查是否有相同的使用者電子郵件

        self.cursor.execute(
            "SELECT * FROM User_Personal_Note_Data WHERE user_email = ?;", (user_email,)
        )
        # 檢索結果
        row = self.cursor.fetchone()
        # 如果有相同的資料，回傳 True；否則回傳 False
        return bool(row)

    def insert_into_User_Register_Data(self, username, user_email, user_password):
        try:
            # 新增資料到 User_Personal_Note_Data 表格
            user_data = (username, user_email, user_password, 0)
            self.cursor.execute(
                "INSERT INTO User_Personal_Note_Data (username, user_email, user_password, login_status) VALUES (?, ?, ?, ?);",
                user_data,
            )
            self.conn.commit()
            return True

        except sqlite3.Error as e:
            return False

    def check_signin_status(self, username):
        self.cursor.execute(
            "SELECT login_status FROM User_Personal_Note_Data WHERE username = ?;",
            (username,),
        )
        # 獲取查詢結果的第一行
        row = self.cursor.fetchone()
        # 如果有結果，取出 login_status 的值
        if row:
            login_status = row[0]
            return login_status

        else:
            # 如果沒有結果，返回一個None
            return None

    def useremail_to_userpassword(self, user_email):
        self.cursor.execute(
            "SELECT user_password FROM User_Personal_Note_Data WHERE user_email = ?;",
            (user_email,),
        )
        # 獲取查詢結果的第一行
        row = self.cursor.fetchone()
        # 如果有結果，取出 user_password 的值
        if row:
            user_password = row[0]
            return user_password

        else:
            # 如果沒有結果，返回一個None
            return None

    def change_login_status(self, username):
        self.cursor.execute(
            "SELECT login_status FROM User_Personal_Note_Data WHERE username = ?;",
            (username,),
        )
        # 獲取查詢結果的第一行
        row = self.cursor.fetchone()
        if row:
            current_status = row[0]

            # row 0 改為 1，1 改為 0
            new_status = 1 if current_status == 0 else 0

            # UPDATE更新 login_status
            self.cursor.execute(
                "UPDATE User_Personal_Note_Data SET login_status = ? WHERE username = ?;",
                (new_status, username),
            )
            # 提交修改
            self.conn.commit()
            return True
        else:
            return f"No result found for {username}"

    # 透過username和file_id插入內容
    def filename_insert_content(self, username, file_title_id, content):
        try:
            self.cursor.execute(
                "SELECT content FROM User_Personal_Note_Data WHERE username = ? AND file_title_id = ?;",
                (
                    username,
                    file_title_id,
                ),
            )
            # 獲取查詢結果的第一行
            row = self.cursor.fetchone()

            if row is None:
                # 如果資料不存在，則使用 INSERT 插入新資料
                self.cursor.execute(
                    "INSERT INTO User_Personal_Note_Data (username, file_title_id, content) VALUES (?, ?, ?);",
                    (username, file_title_id, content),
                )
            else:
                # 如果資料存在，則使用 UPDATE 更新資料
                self.cursor.execute(
                    "UPDATE User_Personal_Note_Data SET content = ? WHERE username = ? AND file_title_id = ?;",
                    (content, username, file_title_id),
                )
            self.conn.commit()
            return True
        except sqlite3.Error as e:
            return False

    # 透過username和file_id回傳內容
    def filename_load_content(self, username, file_title_id):
        try:
            self.cursor.execute(
                "SELECT content FROM User_Personal_Note_Data WHERE username = ? AND file_title_id = ?;",
                (
                    username,
                    file_title_id,
                ),
            )
            # 獲取查詢結果的第一行
            row = self.cursor.fetchone()
            return row

        except sqlite3.Error as e:
            return "Error"

    # 傳username和file_name到User_Personal_Note_Data裡
    def insert_into_User_Personal_Note_Data_username_file_name(
        self, username, file_name
    ):
        try:
            user_data = (username, file_name, 1)
            self.cursor.execute(
                "INSERT INTO User_Personal_Note_Data (username, file_name, login_status) VALUES (?, ?, ?);",
                user_data,
            )
            self.conn.commit()
            return True

        except sqlite3.Error as e:
            return False

    # 給username和file_name來插入或更新content_blob
    def insert_into_User_Personal_Note_Data_content_blob(
        self, username, file_name, content_blob
    ):
        try:
            self.cursor.execute(
                "SELECT content_blob FROM User_Personal_Note_Data WHERE username = ? AND file_name = ?;",
                (
                    username,
                    file_name,
                ),
            )
            # 獲取查詢結果的第一行
            row = self.cursor.fetchone()

            if row is None:
                # 如果資料不存在，則使用 INSERT 插入新資料
                self.cursor.execute(
                    "INSERT INTO User_Personal_Note_Data (username, file_name, content_blob,login_status) VALUES (?, ?, ?,?);",
                    (username, file_name, content_blob, 1),
                )
            else:
                # 如果資料存在，則使用 UPDATE 更新資料
                self.cursor.execute(
                    "UPDATE User_Personal_Note_Data SET content_blob = ? WHERE username = ? AND file_name = ?;",
                    (content_blob, username, file_name),
                )
            self.conn.commit()
            return True
        except sqlite3.Error as e:
            return False

        # 給username和file_name來插入或更新content_mimetype

    def insert_into_User_Personal_Note_Data_content_mimetype(
        self, username, file_name, content_mimetype
    ):
        try:
            self.cursor.execute(
                "SELECT content_mimetype FROM User_Personal_Note_Data WHERE username = ? AND file_name = ?;",
                (
                    username,
                    file_name,
                ),
            )
            # 獲取查詢結果的第一行
            row = self.cursor.fetchone()

            if row is None:
                # 如果資料不存在，則使用 INSERT 插入新資料
                self.cursor.execute(
                    "INSERT INTO User_Personal_Note_Data (username, file_name, content_mimetype,login_status) VALUES (?, ?, ?,?);",
                    (username, file_name, content_mimetype, 1),
                )
            else:
                # 如果資料存在，則使用 UPDATE 更新資料
                self.cursor.execute(
                    "UPDATE User_Personal_Note_Data SET content_mimetype = ? WHERE username = ? AND file_name = ?;",
                    (content_mimetype, username, file_name),
                )
            self.conn.commit()
            return True
        except sqlite3.Error as e:
            return False

    # 給username和file_name來刪除整行
    def delete_User_Personal_Note_Data_username_to_file_name(self, username, file_name):
        try:
            user_data = (username, file_name)
            self.cursor.execute(
                "DELETE FROM User_Personal_Note_Data WHERE username = ? AND file_name = ?;",
                user_data,
            )
            self.conn.commit()
            return True

        except sqlite3.Error as e:
            return False

    def close_connection(self):
        # 關閉游標和資料庫連接
        self.cursor.close()
        self.conn.close()

    def get_User_Personal_Info_by_username(
        self,
        username,
    ):
        try:
            self.cursor.execute(
                "SELECT profile_photo FROM User_Personal_Info A , User_Personal_Note_Data B WHERE A.id=B.id AND username = ?;",
                (username,),
            )
            # 獲取查詢結果的第一行
            row = self.cursor.fetchone()
            self.conn.commit()
            return row

        except sqlite3.Error as e:
            return False


#my_db = DB()
#print(my_db.get_User_Personal_Info_by_username("user04"))
