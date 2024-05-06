from sqlalchemy import and_, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column
from sqlalchemy import Integer, String, DATETIME, TEXT ,BLOB
from sqlalchemy.orm import sessionmaker
from User_Note_Data import User_Note_Data
from User_Personal_Info import User_Personal_Info

Base = declarative_base()
engine_url = "mysql+pymysql://root:w83dk4xup6@localhost:3306/simplenote2db"
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

#給username,note_name return對應的content_blob and mimetype
def check_content_blob_mimetype(username, note_name):
    user_id_query = session.query(User_Personal_Info.id).filter(User_Personal_Info.usernames == username).first()
    note_id_query = session.query(User_Note_Data.id).filter(and_(User_Note_Data.user_id == user_id_query[0], User_Note_Data.note_name == note_name)).first()
    result = session.query(User_File_Data.content_blob,User_File_Data.content_mimetype).filter(User_File_Data.note_id == note_id_query[0]).all()
    return result


print (check_content_blob_mimetype("user01","note1"))