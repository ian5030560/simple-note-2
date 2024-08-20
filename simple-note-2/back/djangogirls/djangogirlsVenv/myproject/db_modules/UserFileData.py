from sqlalchemy import and_, create_engine, delete, insert, update
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column
from sqlalchemy import Integer, String, DATETIME, TEXT, BLOB
from sqlalchemy.orm import sessionmaker, scoped_session
from .UserNoteData import User_Note_Data
from .UserPersonalInfo import User_Personal_Info
from sqlalchemy.exc import SQLAlchemyError
from .Common import engine

Base = declarative_base()

class User_File_Data(Base):
    __tablename__ = "User_File_Data"
    id = Column(Integer, primary_key=True, autoincrement=True)
    note_id = Column(Integer)
    file_name = Column(TEXT)


Session = sessionmaker(bind=engine)
session = Session()


# def create_session():
#     Session = sessionmaker(bind=engine)
#     session = Session()
    # return session
    
def create_session():
    Session = scoped_session(sessionmaker(bind=engine))
    return Session




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

# Give username note_title_id file_name delete file_name
def delete_file_name(usernames_input, note_title_id_input, file_name_input):
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
                User_Note_Data.note_title_id == note_title_id_input,
            )
        )
        .first()
    )
    stmt = (
            delete(User_File_Data)
            .where(
                and_(
                    User_File_Data.note_id == note_id_query[0],
                    User_File_Data.file_name == file_name_input
                )
            )
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




# print(delete_file_name("user01", 1, "file2"))
