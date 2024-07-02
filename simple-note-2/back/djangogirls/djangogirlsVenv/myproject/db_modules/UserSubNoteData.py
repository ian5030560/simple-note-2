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