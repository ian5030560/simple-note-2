import datetime

from sqlalchemy import (
    BLOB,
    DATETIME,
    TEXT,
    Column,
    Integer,
    String,
    and_,
    create_engine,
    delete,
    insert,
    update,
)
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker

from .Common import engine
from .UserPersonalInfo import User_Personal_Info

# from dotenv import load_dotenv
# # 加載 .env 文件中的環境變數
# load_dotenv()

Base = declarative_base()
# engine_url = os.environ.get("env")
# # engine_url = "mysql+pymysql://root:root@0.tcp.jp.ngrok.io:11051/simplenote2db"
# engine_url = "mysql+pymysql://root:ucdw6eak@localhost:3306/simplenote2db"
# # engine_url = "mysql+pymysql://root:root@localhost:3306/simplenote2db"
# # engine_url = "mysql+pymysql://root:niko1024@localhost:3306/simplenote2db"
# engine = create_engine(engine_url, echo=True)


class User_Note_Data(Base):
    __tablename__ = "User_Note_Data"
    id = Column(Integer, primary_key=True, autoincrement=True)
    note_name = Column(String(256))
    content = Column(TEXT)
    updated_time = Column(TEXT)
    user_id = Column(Integer)
    note_title_id = Column(String(128))

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


# def create_session():
#     Session = sessionmaker(bind=engine)
#     session = Session()
# return session


def create_session():
    Session = scoped_session(sessionmaker(bind=engine))
    return Session


# 給usernames,note_title_id update content
def update_content(usernames, note_title_id, content):
    session = create_session()
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
        print(str(e))
        return False
    finally:
        session.close()


# 給usernames,note_title_id insert content
def insert_content(usernames, note_title_id, content):
    session = create_session()
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
    finally:
        session.close()


# check_content by usernames and note_title_id
def check_content(usernames, note_title_id):
    session = create_session()
    user_id_query = (
        session.query(User_Personal_Info.id)
        .filter((User_Personal_Info.usernames == usernames))
        .first()
    )
    try:
        content_query = (
            session.query(User_Note_Data.content)
            .filter(
                and_(
                    User_Note_Data.user_id == user_id_query,
                    User_Note_Data.note_title_id == note_title_id,
                )
            )
            .first()
        )
        return content_query
    except SQLAlchemyError as e:
        session.rollback()
        return False
    finally:
        session.close()


# Check id by usernames and note_title_id
def check_id(usernames, note_title_id):
    session = create_session()
    user_id_query = (
        session.query(User_Personal_Info.id)
        .filter((User_Personal_Info.usernames == usernames))
        .first()
    )
    try:
        content_query = (
            session.query(User_Note_Data.id)
            .filter(
                and_(
                    User_Note_Data.user_id == user_id_query[0],
                    User_Note_Data.note_title_id == note_title_id,
                )
            )
            .first()
        )
        return content_query[0]
    except SQLAlchemyError as e:
        session.rollback()
        return False
    finally:
        session.close()


# check note_name by note_id
def check_note_name_by_note_id(note_id_input):
    session = create_session()
    try:
        result = (
            session.query(User_Note_Data.note_name)
            .filter(User_Note_Data.id == note_id_input)
            .first()
        )
        return result[0]

    except SQLAlchemyError as e:
        session.rollback()
        return False
    finally:
        session.close()


# check note_name by note_id
def check_note_name_by_note_id(note_id_input):
    session = create_session()
    try:
        result = (
            session.query(User_Note_Data.note_name)
            .filter(User_Note_Data.id == note_id_input)
            .first()
        )
        return result[0]

    except SQLAlchemyError as e:
        session.rollback()
        return False
    finally:
        session.close()


# check note_title_id by note_id
def check_note_title_id_by_note_id(note_id_input):
    session = create_session()
    try:
        result = (
            session.query(User_Note_Data.note_title_id)
            .filter(User_Note_Data.id == note_id_input)
            .first()
        )
        return result[0]

    except SQLAlchemyError as e:
        session.rollback()
        return False
    finally:
        session.close()


# check all user's notes
# return like [('note1', '1'), ('note2', '2'), ('note4', '4')]
def check_user_all_notes(usernames_input):
    session = create_session()
    user_id_query = (
        session.query(User_Personal_Info.id)
        .filter((User_Personal_Info.usernames == usernames_input))
        .first()
    )

    try:
        result = (
            session.query(User_Note_Data.note_name, User_Note_Data.note_title_id)
            .filter(User_Note_Data.user_id == user_id_query[0])
            .all()
        )
        return result

    except SQLAlchemyError as e:
        session.rollback()
        return False
    except:
        session.rollback()
        return False
    finally:
        session.close()


# insert user_id,note_name,note_title_id 到User_Note_Data裡
def insert_user_id_note_name(usernames, note_name, note_title_id):
    session = create_session()
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
            content=None,
            note_name=note_name,
            updated_time=datetime.date.today(),
        )
        session.execute(stmt)
        session.commit()
        return True

    except SQLAlchemyError as e:
        session.rollback()
        return str(e)
    finally:
        session.close()


# 給username和note_title_id來刪除整行
def delete_note_by_usernames_note_title_id(usernames, note_title_id):
    session = create_session()
    user_id_query = (
        session.query(User_Personal_Info.id)
        .filter((User_Personal_Info.usernames == usernames))
        .first()
    )
    try:
        # # Delete subNote that has same parent_id
        # stmt1 = delete(User_SubNote_Data).where(User_SubNote_Data.parent_id == note_title_id)
        # session.execute(stmt1)
        # session.commit()

        stmt2 = delete(User_Note_Data).where(
            and_(
                User_Note_Data.user_id == user_id_query[0],
                User_Note_Data.note_title_id == note_title_id,
            )
        )
        session.execute(stmt2)
        session.commit()
        return True
    except SQLAlchemyError as e:
        session.rollback()
        print(e)
        return False
    finally:
        session.close()


# 給username和note_name來刪除整行
def delete_note_by_usernames_note_name(usernames, note_name):
    session = create_session()
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
    finally:
        session.close()
