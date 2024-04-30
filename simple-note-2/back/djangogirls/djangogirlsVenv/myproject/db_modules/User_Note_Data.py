from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column
from sqlalchemy import Integer, String, DATETIME, TEXT ,BLOB
from sqlalchemy.orm import sessionmaker

Base = declarative_base()
engine_url = "mysql+pymysql://root:w83dk4xup6@localhost:3306/simplenote2db"
engine = create_engine(engine_url, echo=True)

class User_Note_Data(Base):
    __tablename__ = "User_Note_Data"
    id = Column(Integer, primary_key=True, autoincrement=True)
    note_name = Column(String(256))
    content = Column(TEXT)
    updated_time = Column(TEXT)
    user_id = Column(Integer)
    
Session = sessionmaker(bind=engine)
session = Session()


def create_session():
    Session = sessionmaker(bind=engine)
    session = Session()

    return session    