from sqlalchemy import and_, create_engine, insert, update
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column
from sqlalchemy import Integer, String, DATETIME, TEXT, BLOB
from sqlalchemy.orm import sessionmaker
from .UserNoteData import User_Note_Data
from .UserPersonalInfo import User_Personal_Info
from sqlalchemy.exc import SQLAlchemyError
import os
import base64

Base = declarative_base()
# engine_url = os.environ.get("env")
# engine_url = "mysql+pymysql://root:root@0.tcp.jp.ngrok.io:11051/simplenote2db"
engine_url = "mysql+pymysql://root:ucdw6eak@localhost:3306/simplenote2db"
# engine_url = "mysql+pymysql://root:root@localhost:3306/simplenote2db"
# engine_url = "mysql+pymysql://root:niko1024@localhost:3306/simplenote2db"
engine = create_engine(engine_url, echo=True)


class User_File_Data(Base):
    __tablename__ = "User_File_Data"
    id = Column(Integer, primary_key=True, autoincrement=True)
    note_id = Column(Integer)
    file_name = Column(TEXT)


Session = sessionmaker(bind=engine)
session = Session()


def create_session():
    Session = sessionmaker(bind=engine)
    session = Session()
    return session




# give file_name check file_name
def check_file_name(usernames_input, note_name_input, file_name_input):
    try:
        user_id_query = (
            session.query(User_Personal_Info.id)
            .filter(User_Personal_Info.usernames == usernames_input)
            .first()
        )
        note_id_query = (
            session.query(User_Note_Data.id)
            .filter(
                and_(
                    User_Note_Data.user_id == user_id_query[0],
                    User_Note_Data.note_name == note_name_input,
                )
            )
            .first()
        )

        stmt = (
            session.query(User_File_Data.file_name)
            .filter(and_(
                    User_File_Data.note_id == note_id_query[0],
                    User_File_Data.file_name == file_name_input,
                ))
            .first()
        )
        if not stmt:
                return False

        if stmt[0] == file_name_input:
            return True
        else:
            return False
    except SQLAlchemyError as e:
        # 回朔防止資料庫損壞
        session.rollback()
        print(e)
        return False
    finally:
        session.close()


# 給username, note_name 插入file_name
def insert_file_name(
    usernames_input,
    note_name_input,
    file_name_input,
):
    user_id_query = (
        session.query(User_Personal_Info.id)
        .filter(User_Personal_Info.usernames == usernames_input)
        .first()
    )
    
    note_id_query = (
        session.query(User_Note_Data.id)
        .filter(
            and_(
                User_Note_Data.user_id == user_id_query[0],
                User_Note_Data.note_name == note_name_input,
            )
        )
        .first()
    )
    if not note_id_query:
        print(f"Note {note_name_input} for user {usernames_input} not found.")
        return False
    stmt = insert(User_File_Data).values(
        note_id=note_id_query[0],
        file_name=file_name_input,
    )
    try:
        session.execute(stmt)
        session.commit()
        return True
    except SQLAlchemyError as e:
        # 回朔防止資料庫損壞
        session.rollback()
        print(e)
        return False
    finally:
        session.close()


# Give username note_name file_name update file_name
def update_file_name(usernames_input, note_name_input, file_name_input):
    user_id_query = (
        session.query(User_Personal_Info.id)
        .filter(User_Personal_Info.usernames == usernames_input)
        .first()
    )
    note_id_query = (
        session.query(User_Note_Data.id)
        .filter(
            and_(
                User_Note_Data.user_id == user_id_query[0],
                User_Note_Data.note_name == note_name_input,
            )
        )
        .first()
    )
    stmt = (
        update(User_File_Data)
        .where(User_File_Data.note_id == note_id_query[0])
        .values(file_name=file_name_input)
    )
    try:
        session.execute(stmt)
        session.commit()
        return True
    except SQLAlchemyError as e:
        # 回朔防止資料庫損壞
        session.rollback()
        return False
    finally:
        session.close()




print(check_file_name("user01", "note1", "file2"))
