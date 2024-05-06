from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column
from sqlalchemy import Integer, String, DATETIME, TEXT ,BLOB,BOOLEAN
from sqlalchemy.orm import sessionmaker

Base = declarative_base()
engine_url = "mysql+pymysql://root:w83dk4xup6@localhost:3306/simplenote2db"
engine = create_engine(engine_url, echo=True)

class User_Personal_Theme_Data(Base):
    __tablename__ = "User_Personal_Theme_Data"
    id = Column(Integer, primary_key=True, autoincrement=True)
    theme_name = Column(String(256))
    color_light_primary = Column(String(256))
    color_light_base_bg = Column(String(256))
    color_dark_primary = Column(String(256))
    color_dark_base_bg = Column(String(256))
    user_id = Column(Integer)
    

def create_session():
    Session = sessionmaker(bind=engine)
    session = Session()
    return session    

session = create_session()
