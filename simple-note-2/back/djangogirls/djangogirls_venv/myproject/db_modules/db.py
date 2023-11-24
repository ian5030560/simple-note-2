import sqlite3

dbfile = (
    "simple-note-2\\back\\djangogirls\\djangogirls_venv\\myproject\\db_modules\\pydb.db"
)

conn = sqlite3.connect(dbfile)


class DB:
    def check_signin(self, username, user_password):
        cursor = conn.cursor()
        # 使用 SQL 查詢檢查是否有相同的username and password
        cursor.execute(
            "SELECT * FROM users WHERE username = ? AND user_password = ?;",
            (username, user_password),
        )
        # 檢索結果
        row = cursor.fetchone()
        conn.close()
        # 如果有相同的資料，回傳 True；否則回傳 False
        return bool(row)

    def check_register(self, username):
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ?;", (username))
        row = cursor.fetchone()
        conn.close()
        return bool(row)

    def check_register(self, user_password):
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE user_password = ?;", (user_password))
        row = cursor.fetchone()
        conn.close()
        return bool(row)

    rows = conn.execute("select * from User_Register_Data;")
    for row in rows:
        for field in row:
            print("{}\t".format(field), end="")
        print()


conn.close()
