from sqlalchemy import create_engine, update, and_, insert, delete
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column
from sqlalchemy import Integer, String, DATETIME, TEXT, BLOB
from sqlalchemy.orm import sessionmaker
from UserPersonalInfo import User_Personal_Info
from sqlalchemy.exc import SQLAlchemyError
import datetime
import os
engine_url = os.environ.get("env")
Base = declarative_base()
# engine_url = "mysql+pymysql://root:ucdw6eak@localhost:3306/simplenote2db"
engine = create_engine(engine_url, echo=True)


class User_Note_Data(Base):
    __tablename__ = "User_Note_Data"
    id = Column(Integer, primary_key=True, autoincrement=True)
    note_name = Column(String(256))
    content = Column(TEXT)
    updated_time = Column(TEXT)
    user_id = Column(Integer)
    note_title_id = Column(Integer)

    def __init__(
        self,
        id=None,
        note_name=None,
        content=None,
        updated_time=None,
        user_id=None,
        note_title_id=None,
    ):
        self.id = id
        self.note_name = note_name
        self.content = content
        self.updated_time = updated_time
        self.user_id = user_id
        self.note_title_id = note_title_id


def create_session():
    Session = sessionmaker(bind=engine)
    session = Session()
    return session


session = create_session()


# 給usernames,note_title_id update content
def update_content(usernames, note_title_id, content):
    user_id_query = (
        session.query(User_Personal_Info.id)
        .filter(User_Personal_Info.usernames == usernames)
        .first()
    )
    stmt = (
        update(User_Note_Data)
        .where(
            and_(
                User_Note_Data.user_id == user_id_query[0],
                User_Note_Data.note_title_id == note_title_id,
            )
        )
        .values(content=content, updated_time=datetime.date.today())
    )
    try:
        session.execute(stmt)
        session.commit()
        return True
    except SQLAlchemyError as e:
        # 回朔防止資料庫損壞
        session.rollback()
        return str(e)


# 給usernames,note_title_id insert content
def insert_content(usernames, note_title_id, content):
    user_id_query = (
        session.query(User_Personal_Info.id)
        .filter(User_Personal_Info.usernames == usernames)
        .first()
    )
    try:
        existing_data = (
            session.query(User_Note_Data)
            .filter(
                User_Note_Data.user_id == user_id_query[0],
                User_Note_Data.note_title_id == note_title_id,
            )
            .first()
        )
        if existing_data:
            return False
        stmt = insert(User_Note_Data).values(
            user_id=user_id_query[0],
            note_title_id=note_title_id,
            content=content,
            note_name=usernames + "note",
            updated_time=datetime.date.today(),
        )
        session.execute(stmt)
        session.commit()
        return True
    except SQLAlchemyError as e:
        session.rollback()
        return str(e)


# check_content by usernames and note_title_id
def check_content(usernames, note_title_id):
    user_id_query = (
        session.query(User_Personal_Info.id)
        .filter((User_Personal_Info.usernames == usernames))
        .first()
    )
    try:
        contenet_query = (
            session.query(User_Note_Data.content)
            .filter(
                and_(
                    User_Note_Data.user_id == user_id_query[0],
                    User_Note_Data.note_title_id == note_title_id,
                )
            )
            .first()
        )
        return contenet_query
    except SQLAlchemyError as e:
        session.rollback()
        return str(e)


# insert user_id,note_name,note_title_id 到User_Note_Data裡
def insert_user_id_note_name(usernames, note_name, note_title_id):
    user_id_query = (
        session.query(User_Personal_Info.id)
        .filter((User_Personal_Info.usernames == usernames))
        .first()
    )
    try:
        existing_data = (
            session.query(User_Note_Data)
            .filter(
                User_Note_Data.user_id == user_id_query[0],
                User_Note_Data.note_name == note_name,
                User_Note_Data.note_title_id == note_title_id,
            )
            .first()
        )
        if existing_data:
            return False
        stmt = insert(User_Note_Data).values(
            user_id=user_id_query[0],
            note_title_id=note_title_id,
            content=0,
            note_name=note_name,
            updated_time=datetime.date.today(),
        )
        session.execute(stmt)
        session.commit()
        return True

    except SQLAlchemyError as e:
        session.rollback()
        return str(e)


# 給username和note_title_id來刪除整行
def delete_note_by_usernames_note_title_id(usernames, note_title_id):
    user_id_query = (
        session.query(User_Personal_Info.id)
        .filter((User_Personal_Info.usernames == usernames))
        .first()
    )
    try:
        stmt = delete(User_Note_Data).where(
            and_(
                User_Note_Data.user_id == user_id_query[0],
                User_Note_Data.note_title_id == note_title_id,
            )
        )
        session.execute(stmt)
        session.commit()
        return True
    except SQLAlchemyError as e:
        session.rollback()
        return str(e)

# 給username和note_name來刪除整行
def delete_note_by_usernames_note_name(usernames, note_name):
    user_id_query = (
        session.query(User_Personal_Info.id)
        .filter((User_Personal_Info.usernames == usernames))
        .first()
    )
    try:
        stmt = delete(User_Note_Data).where(
            and_(
                User_Note_Data.user_id == user_id_query[0],
                User_Note_Data.note_name == note_name,
            )
        )
        session.execute(stmt)
        session.commit()
        return True
    except SQLAlchemyError as e:
        session.rollback()
        return str(e)    


print(delete_note_by_usernames_note_name("user02", "BBB"))
