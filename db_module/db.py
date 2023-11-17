import pymysql as sql
import typing


class DB:
    
    __settings = {
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
            cls.__conn = sql.Connection(**cls.__settings)
            return True
        except Exception as e:
            return False
    
    @classmethod
    def __execute(cls, func: typing.Callable[[any], any]) -> bool:
        
        if(not cls.__connectDB()): return False

        try:
            with cls.__conn.cursor() as cursor:
                func(cursor)
                return True
        except Exception as e:
            print(e)
            return False
        
    @classmethod
    def delete(cls, table: str, condition: str = "TRUE") -> bool:
        
        def innerDelete(cursor):
            cursor.execute("DELETE FROM `{}` WHERE {};".format(table, condition))
            cls.__conn.commit()
            
        return cls.__execute(innerDelete)
    
    @classmethod
    def query(cls, command: str) -> "tuple | None":
        
        data: tuple = None
        def innerQuery(cursor):
            nonlocal data
            
            cursor.execute(command)
            data = cursor.fetchall()
        
        if (not cls.__execute(innerQuery)): return None
        
        return data
    
    @classmethod
    def insert(cls, table: str, data: list[tuple]) -> bool:
        
        def innerInsert(cursor):
            cursor.execute("INSERT INTO `{}` VALUES {}".format(table, *data))
            cls.__conn.commit()
            
        return cls.__execute(innerInsert)
    
    @classmethod
    def update(cls, table: str, setting: str, condition: str = "TRUE") -> bool:
        
        def innerUpdate(cursor):
            cursor.execute("UPDATE `{}` SET {} WHERE {}".format(table, setting, condition))
            cls.__conn.commit()
            
        return cls.__execute(innerUpdate)
    
    @classmethod
    def close(cls) -> bool:
        if(not cls.__conn): return True
        
        try:
            cls.__conn.cursor
            cls.__conn.close()
            return True
        
        except Exception as e:
            return False