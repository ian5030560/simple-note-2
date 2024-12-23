import typing

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
    exists,
    insert,
    update,
)
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker

from .Common import engine
from .UserNoteData import User_Note_Data, check_id

Base = declarative_base()


class User_Collaborate_Note(Base):
    __tablename__ = "User_Collaborate_Note"
    id = Column(Integer, primary_key=True, autoincrement=True)
    note_id = Column(Integer)
    note_master = Column(String(255))
    note_guest = Column(String(255))
    url = Column(String(1024))

    def __init__(
        self,
        id=None,
        note_id=None,
        note_master=None,
        note_guest=None,
        url=None,
    ):
        self.id = id
        self.note_id = note_id
        self.note_master = note_master
        self.note_guest = note_guest
        self.url = url


# def create_session():
#     Session = sessionmaker(bind=engine)
#     session = Session()
# return session


def create_session():
    Session = scoped_session(sessionmaker(bind=engine))
    return Session


# def errorBoudary(callback):
#     session = create_session()
#     try:
#         callback(session)
#     except SQLAlchemyError as e:
#         session.rollback()
#         return False
#     finally:
#         session.close()


# Insert new data by master_name, note_title_id, guest_name, url
def insert_newData(
    note_master_input: str,
    note_title_id_input: str,
    note_guest_input: str,
    url_input: str,
) -> bool:
    session = create_session()
    new_note_id = check_id(note_master_input, note_title_id_input)
    try:
        if new_note_id:
            stmt = insert(User_Collaborate_Note).values(
                note_id=new_note_id,
                note_master=note_master_input,
                note_guest=note_guest_input,
                url=url_input,
            )
            session.execute(stmt)
            session.commit()
            return True
        else:
            return False
    except SQLAlchemyError as e:
        session.rollback()
        print(e)
        return False
    finally:
        session.close()


# Check all guest by master_name, note_title_id
def check_all_guest(
    note_master_input: str, note_title_id_input: str
) -> list[tuple[str]] | None:
    session = create_session()
    note_id_query = check_id(note_master_input, note_title_id_input)
    try:
        if note_id_query:
            stmt = (
                session.query(User_Collaborate_Note.note_guest)
                .filter(
                    and_(
                        User_Collaborate_Note.note_id == note_id_query,
                        User_Collaborate_Note.note_master == note_master_input,
                    )
                )
                .all()
            )
            return stmt
        else:
            return None
    except SQLAlchemyError as e:
        session.rollback()
        print(e)
        return None
    finally:
        session.close()


# check all url by guest_name
def check_url(note_guest_input: str) -> typing.Union[list[str], False]:
    session = create_session()
    try:
        stmt = (
            session.query(User_Collaborate_Note.url)
            .filter((User_Collaborate_Note.note_guest == note_guest_input))
            .all()
        )
        return stmt

    except SQLAlchemyError as e:
        session.rollback()
        # print(e)
        return False
    finally:
        session.close()


# check all noteID by guest_name
def check_all_noteID_by_guest(note_guest_input):
    session = create_session()
    try:
        stmt = (
            session.query(User_Collaborate_Note.note_id)
            .filter((User_Collaborate_Note.note_guest == note_guest_input))
            .all()
        )
        return stmt

    except SQLAlchemyError as e:
        session.rollback()
        # print(e)
        return False
    finally:
        session.close()


def get_note_url(guest_name: str, note_title_id: str):
    session = create_session()

    try:
        note_id = (
            session.query(User_Note_Data)
            .filter_by(note_title_id=note_title_id)
            .one()
            .id
        )

        url = (
            session.query(User_Collaborate_Note)
            .filter_by(note_guest=guest_name, note_id=note_id)
            .one()
            .url
        )
        return url

    except SQLAlchemyError as e:
        session.rollback()
        # print(e)
        return False
    finally:
        session.close()


# Check if it is a collaborative note by note_master_input, note_title_id_input
def check_collaborativeNote_exist(note_master_input, note_title_id_input):
    session = create_session()
    note_id_query = check_id(note_master_input, note_title_id_input)
    try:
        if note_id_query:
            # 使用 exists() 構建子查詢
            stmt = session.query(
                session.query(User_Collaborate_Note.note_id)
                .filter(
                    and_(
                        User_Collaborate_Note.note_id == note_id_query,
                        User_Collaborate_Note.note_master == note_master_input,
                    )
                )
                .exists()
            ).scalar()
            return stmt  # stmt 會是 True 或 False
        else:
            return False
    except SQLAlchemyError as e:
        session.rollback()
        print(e)
        return False
    finally:
        session.close()


# Delete one row by note_master_input,note_title_id_input,note_guest_input
def delete_one_data(note_master_input, note_title_id_input, note_guest_input):
    session = create_session()
    note_id_query = check_id(note_master_input, note_title_id_input)
    try:
        if note_id_query:
            stmt = delete(User_Collaborate_Note).where(
                and_(
                    User_Collaborate_Note.note_id == note_id_query,
                    User_Collaborate_Note.note_guest == note_guest_input,
                )
            )
            session.execute(stmt)
            session.commit()
            return True
        else:
            return "note id not exist"
    except SQLAlchemyError as e:
        session.rollback()
        print(e)
        return str(e)
    finally:
        session.close()


# Delete all row by note_master_input,note_title_id_input
def delete_all_data(note_master_input, note_title_id_input):
    session = create_session()
    note_id_query = check_id(note_master_input, note_title_id_input)
    try:
        if note_id_query:
            stmt = delete(User_Collaborate_Note).where(
                User_Collaborate_Note.note_id == note_id_query,
            )
            session.execute(stmt)
            session.commit()
            return True
        else:
            return "note id not exist"
    except SQLAlchemyError as e:
        session.rollback()
        print(e)
        return str(e)
    finally:
        session.close()


# print(get_note_url("user18", 1))
