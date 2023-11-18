import pymysql as sql
import typing
from pymysql import cursors


class DB:

    """
    Property:\n
    \ttableName (str): your table name
    Example:\n
    \t(1)\n 
    \tDB.tableName = your table name\n
    \tDB.delete("col1 = 1")\n
    \tDB.insert([("abc123", 100000)])\n
    \tDB.update("salary = 100000", "col1 = 2")\n
    \tDB.query("SELECT * FROM your_table")\n
    \t############################################\n
    \t(2)\n
    \tclass MyTable(DB):\n
    \t\ttableName = your table name\n
    \tMyTable.delete("col1 = 1")\n
    \tMyTable.insert([("abc123", 100000)])\n
    \tMyTable.update("salary = 100000", "col1 = 2")\n
    \tMyTable.query("SELECT * FROM your_table")\n
    """

    tableName = ""

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
    def delete(cls, condition: str = "TRUE") -> bool:
        """
        delete data from table with sql condition\n
        Args:\n
            condition (str, optional): sql condition, Defaults to "TRUE".

        Returns:
            bool: True if successful else False
        """
        def innerDelete(cursor: cursors.Cursor):
            cursor.execute("DELETE FROM `{}` WHERE {};".format(cls.tableName, condition))
            cls.__conn.commit()

        return cls.__execute(innerDelete)

    @classmethod
    def query(cls, command: str) -> "tuple | None":
        """
        access to table with sql sentence\n
        Args:\n
            command (str): sql sentence

        Returns:
            tuple | None
        """
        data: tuple = None

        def innerQuery(cursor: cursors.Cursor):
            nonlocal data

            cursor.execute(command)
            data = cursor.fetchall()

        if not cls.__execute(innerQuery):
            return None

        return data

    @classmethod
    def insert(cls, data: list[tuple]) -> bool:
        """
        insert a list of data into the table\n
        Args:
            data (list[tuple]): a list of data

        Returns:
            bool: True if successful else False
        """
        def innerInsert(cursor: cursors.Cursor):
            cursor.execute("INSERT INTO `{}` VALUES {}".format(cls.tableName, *data))
            cls.__conn.commit()

        return cls.__execute(innerInsert)

    @classmethod
    def update(cls, setting: str, condition: str = "TRUE") -> bool:
        """
        update data in the table with the given condition and settings
        Args:
            setting (str): sql sentence\n
            condition (str, optional): sql condition, Defaults to "TRUE".

        Returns:
            bool: True if successful else False
        """
        def innerUpdate(cursor: cursors.Cursor):
            cursor.execute(
                "UPDATE `{}` SET {} WHERE {}".format(cls.tableName, setting, condition)
            )
            cls.__conn.commit()

        return cls.__execute(innerUpdate)

    @classmethod
    def close(cls) -> bool:
        """
        close the connection with database\n
        if not connected yet, it returns True by default\n
        Returns:
            bool: True if successful else False
        """
        if not cls.__conn:
            return True

        try:
            cls.__conn.close()
            return True

        except Exception as e:
            return False


class UserTable(DB):
    """
    Table: `user`\n
    Columns:\n
    \tuser_acct(str, primary): user account, length <= 320\n
    \tuser_pwd(str): user password, length <= 30\n
    """
    tableName = "user"
    
    @staticmethod
    def accountExist(account: str) -> bool:
        """
        check if account exists\n
        Args:
            account (str): account name

        Raises:
            Exception: error from database

        Returns:
            bool: whether account exists
        """
        data = UserTable.query("SELECT `user_acct` FROM `user` WHERE `user_acct` = `{}`".format(account))
        
        if(not data): raise Exception("There is an error from database")
        
        return len(data) != 0