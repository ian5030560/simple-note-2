import sqlite3

dbfile = "simple-note-2\\back\\djangogirls\\djangogirls_venv\\myproject\\db_modules\\pydb.db"

conn = sqlite3.connect(dbfile)


class DB:
    
    def check_signin(self, username, user_password):
        # 使用 SQL 查詢檢查是否有相同的使用者名稱和密碼
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ? AND user_password = ?;", (username, user_password))
        # 檢索結果
        row = cursor.fetchone()
        # 如果有相同的資料，回傳 True；否則回傳 False
        return bool(row)

    def check_register(self, username):
        # 使用 SQL 查詢檢查是否有相同的使用者名稱
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ?;", (username,))
        # 檢索結果
        row = cursor.fetchone()
        # 如果有相同的資料，回傳 True；否則回傳 False
        return bool(row)

    def check_register_email(self, user_email):
        # 使用 SQL 查詢檢查是否有相同的使用者電子郵件
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE user_email = ?;", (user_email,))
        # 檢索結果
        row = cursor.fetchone()
        # 如果有相同的資料，回傳 True；否則回傳 False
        return bool(row)                
        
    def fetch_user_register_data(self):
        # 查詢並列印 User_Register_Data 表格的資料
        cursor = conn.cursor()
        rows = cursor.execute("SELECT * FROM User_Register_Data;")
        for row in rows:
            for field in row:
                print("{}\t".format(field), end="")
            print()

    
conn.close()

