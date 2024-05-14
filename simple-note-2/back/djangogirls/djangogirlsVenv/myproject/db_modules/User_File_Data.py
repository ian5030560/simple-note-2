from sqlalchemy import and_, create_engine, insert, update
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column
from sqlalchemy import Integer, String, DATETIME, TEXT, BLOB
from sqlalchemy.orm import sessionmaker
from User_Note_Data import User_Note_Data
from User_Personal_Info import User_Personal_Info
from sqlalchemy.exc import SQLAlchemyError
import os

Base = declarative_base()
# engine_url = os.environ.get("env")
engine_url = "mysql+pymysql://root:ucdw6eak@localhost:3307/simplenote2db"
engine = create_engine(engine_url, echo=True)


class User_File_Data(Base):
    __tablename__ = "User_File_Data"
    id = Column(Integer, primary_key=True, autoincrement=True)
    note_id = Column(Integer)
    content_blob = Column(BLOB)
    content_mimetype = Column(TEXT)


Session = sessionmaker(bind=engine)
session = Session()


def create_session():
    Session = sessionmaker(bind=engine)
    session = Session()
    return session


# 給username,note_name return對應的content_blob and mimetype
def check_content_blob_mimetype(username, note_name):
    user_id_query = (
        session.query(User_Personal_Info.id)
        .filter(User_Personal_Info.usernames == username)
        .first()
    )
    note_id_query = (
        session.query(User_Note_Data.id)
        .filter(
            and_(
                User_Note_Data.user_id == user_id_query[0],
                User_Note_Data.note_name == note_name,
            )
        )
        .first()
    )
    result = (
        session.query(User_File_Data.content_blob, User_File_Data.content_mimetype)
        .filter(User_File_Data.note_id == note_id_query[0])
        .all()
    )
    return result


# 給username, note_name 插入 content_blob, content_mimetype,note_id
def insert_content_blob_mimetype_by_usernames_note_name(
    usernames_input, note_name_input, content_blob_input, content_mimetype_input
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
    stmt = insert(User_File_Data).values(
        note_id=note_id_query[0],
        content_blob=content_blob_input,
        content_mimetype=content_mimetype_input,
    )
    try:
        session.execute(stmt)
        session.commit()
        return True
    except SQLAlchemyError as e:
        # 回朔防止資料庫損壞
        session.rollback()
        return str(e)


# 給username, note_name update content_blob, content_mimetype
def update_content_blob_mimetype_by_usernames_note_name(
    usernames_input, note_name_input, content_blob_input, content_mimetype_input
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
    stmt = (
        update(User_File_Data)
        .where(User_File_Data.note_id == note_id_query[0])
        .values(
            note_id=note_id_query[0],
            content_blob=content_blob_input,
            content_mimetype=content_mimetype_input,
        )
    )
    try:
        session.execute(stmt)
        session.commit()
        return True
    except SQLAlchemyError as e:
        # 回朔防止資料庫損壞
        session.rollback()
        return str(e)
 

print(check_content_blob_mimetype("user01", "note1")[0][1])
