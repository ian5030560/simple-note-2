import pymysql as sql
import typing
from pymysql import cursors


class DB:

    """
    Property:\n
    \tsettings (dict): {
    \t    "host": your host,
    \t    "port": your port,
    \t    "user": your username,
    \t    "password": your password,
    \t    "db": your database
    \t}\n
    \ttableName (str): your table name
    """

    tableName = "user"

    settings = {
        "host": "sql12.freesqldatabase.com",
        "port": 3306,
        "user": "sql12662871",
        "password": "ATaMjgMM4k",
        "db": "sql12662871",
    }

    __conn: sql.Connection = None

    @classmethod
    def __connectDB(cls) -> bool:
        try:
            cls.__conn = sql.connect(**cls.settings)
            return True
        except Exception as e:
            return False

    @classmethod
    def __execute(cls, func: typing.Callable[[cursors.Cursor], any]) -> bool:
        if not cls.__connectDB():
            return False

        try:
            with cls.__conn.cursor() as cursor:
                func(cursor)
                return True
        except Exception as e:
            return False

    @classmethod
    def delete(cls, condition: str = "TRUE", table=None) -> bool:
        if not table:
            table = cls.tableName

        def innerDelete(cursor: cursors.Cursor):
            cursor.execute("DELETE FROM `{}` WHERE {};".format(table, condition))
            cls.__conn.commit()

        return cls.__execute(innerDelete)

    @classmethod
    def query(cls, command: str) -> "tuple | None":
        data: tuple = None

        def innerQuery(cursor: cursors.Cursor):
            nonlocal data

            cursor.execute(command)
            data = cursor.fetchall()

        if not cls.__execute(innerQuery):
            return None

        return data

    @classmethod
    def insert(cls, data: list, table: str = None) -> bool:
        if not table:
            table = cls.tableName

        def innerInsert(cursor: cursors.Cursor):
            cursor.execute("INSERT INTO `{}` VALUES {}".format(table, *data))
            cls.__conn.commit()

        return cls.__execute(innerInsert)

    @classmethod
    def update(cls, setting: str, condition: str = "TRUE", table=None) -> bool:
        if not table:
            table = cls.tableName

        def innerUpdate(cursor: cursors.Cursor):
            cursor.execute(
                "UPDATE `{}` SET {} WHERE {}".format(table, setting, condition)
            )
            cls.__conn.commit()

        return cls.__execute(innerUpdate)

    @classmethod
    def close(cls) -> bool:
        if not cls.__conn:
            return True

        try:
            cls.__conn.cursor
            cls.__conn.close()
            return True

        except Exception as e:
            return False


# class UserDB(DB):
#     tableName = "user"

# print(UserDB.delete())
# UserDB.close()
