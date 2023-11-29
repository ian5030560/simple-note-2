import sqlite3
from os import mkdir


class DB:
    def __init__(self):
        try:
            self.conn = sqlite3.connect("db_modules/pydb.db")
        except sqlite3.OperationalError:
            mkdir("db_modules")
        finally:
            self.conn = sqlite3.connect("db_modules/pydb.db")
        self.cursor = self.conn.cursor()

    # @staticmethod
    def check_signin(self, username, user_password):
        # 使用 SQL 查詢檢查是否有相同的使用者名稱和密碼
        self.cursor.execute(
            "SELECT * FROM User_Register_Data WHERE username = ? AND user_password = ?;",
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
            "SELECT * FROM User_Register_Data WHERE username = ?;", (username,)
        )
        # 檢索結果
        row = self.cursor.fetchone()
        # 如果有相同的資料，回傳 True；否則回傳 False
        return bool(row)

    def check_register_user_email(self, user_email):
        # 使用 SQL 查詢檢查是否有相同的使用者電子郵件

        self.cursor.execute(
            "SELECT * FROM User_Register_Data WHERE user_email = ?;", (user_email,)
        )
        # 檢索結果
        row = self.cursor.fetchone()
        # 如果有相同的資料，回傳 True；否則回傳 False
        return bool(row)

    def insert_into_User_Register_Data(self, username, user_password, user_email):
        try:
            # 新增資料到 User_Register_Data 表格
            user_data = (username, user_email, user_password)
            self.cursor.execute(
                "INSERT INTO User_Register_Data (username, user_email, user_password) VALUES (?, ?, ?);",
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
