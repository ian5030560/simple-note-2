import sqlite3
from os import mkdir

try:
    conn = sqlite3.connect("db_modules/pydb.db")
except sqlite3.OperationalError:
    mkdir("db_modules")
finally:
    conn = sqlite3.connect("db_modules/pydb.db")


class DB:
    # check_signin
    def check_signin(self, username, user_password):
        # 使用 SQL 查詢檢查是否有相同的使用者名稱和密碼
        cursor = conn.cursor()
        cursor.execute(
            "SELECT * FROM users WHERE username = ? AND user_password = ?;",
            (username, user_password),
        )
        # 檢索結果
        row = cursor.fetchone()
        cursor.close()
        # 如果有相同的資料，回傳 True；否則回傳 False
        return bool(row)

    # check_register
    def check_register_username(self, username):
        # 使用 SQL 查詢檢查是否有相同的使用者名稱
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ?;", (username,))
        # 檢索結果
        row = cursor.fetchone()
        cursor.close()
        # 如果有相同的資料，回傳 True；否則回傳 False
        return bool(row)

    def check_register_user_email(self, user_email):
        # 使用 SQL 查詢檢查是否有相同的使用者電子郵件
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE user_email = ?;", (user_email,))
        # 檢索結果
        row = cursor.fetchone()
        cursor.close()
        # 如果有相同的資料，回傳 True；否則回傳 False
        return bool(row)
    
    def insert_into_User_Register_Data(self,username, user_password, user_email):
        cursor = conn.cursor()
        try:
            # 新增資料到 User_Register_Data 表格
            user_data = (username, user_email, user_password)
            cursor.execute("INSERT INTO User_Register_Data (username, user_email, user_password) VALUES (?, ?, ?);", user_data)
            conn.commit()
            return("資料插入成功！")

        except sqlite3.Error as e:
            return("插入資料失敗:", e)
        
        finally:
        # 關閉游標和資料庫連接
            cursor.close()
        
            
            
    cursor = conn.cursor()
    rows = cursor.execute("SELECT * FROM User_Register_Data;")
    for row in rows:
        for field in row:
            print("{}\t".format(field), end="")
        print()
        cursor.close()
    
conn.close()
