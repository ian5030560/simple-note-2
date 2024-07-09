from sqlalchemy import and_, create_engine, delete, insert, update
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column
from sqlalchemy import Integer, String, DATETIME, TEXT, BLOB
from sqlalchemy.orm import sessionmaker

# from .UserNoteData import User_Note_Data
# from .UserPersonalInfo import User_Personal_Info
from sqlalchemy.exc import SQLAlchemyError
import os
import base64

Base = declarative_base()
engine_url = os.environ.get("env")
# engine_url = "mysql+pymysql://root:root@0.tcp.jp.ngrok.io:11051/simplenote2db"
# engine_url = "mysql+pymysql://root:ucdw6eak@localhost:3306/simplenote2db"
# engine_url = "mysql+pymysql://root:root@localhost:3306/simplenote2db"
engine_url = "mysql+pymysql://root:niko1024@localhost:3306/simplenote2db"
engine = create_engine(engine_url, echo=True)


class User_SubNote_Data(Base):
    __tablename__ = "User_SubNote_Data"
    id = Column(String(128), primary_key=True, nullable=False)
    parent_id = Column(String(128))
    sibling_id = Column(String(128))


Session = sessionmaker(bind=engine)
session = Session()


def create_session():
    Session = sessionmaker(bind=engine)
    session = Session()
    return session


def insert_data(id_input, parent_id_input, sibling_id_input):
    try:
        existing_data = (
            session.query(User_SubNote_Data)
            .filter(
                User_SubNote_Data.id == id_input,
                User_SubNote_Data.parent_id == parent_id_input,
                User_SubNote_Data.sibling_id == sibling_id_input,
            )
            .first()
        )
        if existing_data:
            return False
        stmt = insert(User_SubNote_Data).values(
            id=id_input,
            parent_id=parent_id_input,
            sibling_id=sibling_id_input,
        )
        session.execute(stmt)
        session.commit()
        return True

    except SQLAlchemyError as e:
        session.rollback()
        return str(e)
    finally:
        session.close()


# Update parent id by own id
def update_parent_id(id_input, parent_id_input):
    try:
        existing_data = (
            session.query(User_SubNote_Data)
            .filter(User_SubNote_Data.id == id_input)
            .first()
        )
        if existing_data:
            stmt = (
                update(User_SubNote_Data)
                .where(User_SubNote_Data.id == id_input)
                .values(parent_id=parent_id_input)
            )
            session.execute(stmt)
            session.commit()
            return True
        else:
            return False

    except SQLAlchemyError as e:
        session.rollback()
        return str(e)
    finally:
        session.close()


# Update sibling id by own id
def update_sibling_id(id_input, sibling_id_input):
    try:
        existing_data = (
            session.query(User_SubNote_Data)
            .filter(User_SubNote_Data.id == id_input)
            .first()
        )
        if existing_data:
            stmt = (
                update(User_SubNote_Data)
                .where(User_SubNote_Data.id == id_input)
                .values(sibling_id=sibling_id_input)
            )
            session.execute(stmt)
            session.commit()
            return True
        else:
            return False

    except SQLAlchemyError as e:
        session.rollback()
        return str(e)
    finally:
        session.close()


# Check sibling id by own id
def check_sibling_id(id_input):
    try:
        existing_data = (
            session.query(User_SubNote_Data.sibling_id)
            .filter(User_SubNote_Data.id == id_input)
            .first()
        )
        if existing_data:
            return existing_data[0]
        else:
            return False

    except SQLAlchemyError as e:
        session.rollback()
        return str(e)
    finally:
        session.close()


# Check parent id by own id
def check_parent_id(id_input):
    try:
        existing_data = (
            session.query(User_SubNote_Data.parent_id)
            .filter(User_SubNote_Data.id == id_input)
            .first()
        )
        if existing_data:
            return existing_data[0]
        else:
            return False

    except SQLAlchemyError as e:
        session.rollback()
        return str(e)
    finally:
        session.close()
# Check id by own sibling id
def check_id_by_sibling_id(sibling_id_input):
    try:
        existing_data = (
            session.query(User_SubNote_Data.id)
            .filter(User_SubNote_Data.sibling_id == sibling_id_input)
            .first()
        )
        if existing_data:
            return existing_data[0]
        else:
            return False

    except SQLAlchemyError as e:
        session.rollback()
        return str(e)
    finally:
        session.close()        


# Delete data by own id
def delete_data(id_input):
    try:
        data = (
            session.query(User_SubNote_Data)
            .filter(User_SubNote_Data.id == id_input)
            .first()
        )
        if data:
            #Change the sibling to new sibling_id
            data_sibling_id = check_sibling_id(id_input)
            sibling_data_id = check_id_by_sibling_id(id_input)
            update_sibling_id(sibling_data_id, data_sibling_id)
            
            
            stmt = delete(User_SubNote_Data).where(User_SubNote_Data.id == id_input)
            session.execute(stmt)
            session.commit()
            return True
        else:
            return False

    except SQLAlchemyError as e:
        session.rollback()
        return str(e)
    finally:
        session.close()

