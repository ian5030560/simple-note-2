from sqlalchemy import create_engine, insert
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column
from sqlalchemy import Integer, String, DATETIME, TEXT ,BLOB,BOOLEAN
from sqlalchemy.orm import sessionmaker
from User_Personal_Info import User_Personal_Info
from sqlalchemy.exc import SQLAlchemyError

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

#insert_theme_name_by_username
def insert_theme_name_by_username(usernames_input,theme_name_input):
    user_id_query = (
        session.query(User_Personal_Info.id)
        .filter((User_Personal_Info.usernames == usernames_input))
        .first()
    )
    try:
        existing_data = (
            session.query(User_Personal_Theme_Data)
            .filter(
                User_Personal_Theme_Data.user_id == user_id_query[0],
                User_Personal_Theme_Data.theme_name == theme_name_input
            )
            .first()
        )
        if existing_data:
            return False
        stmt = insert(User_Personal_Theme_Data).values(
            user_id=user_id_query[0],
            theme_name = theme_name_input
        )
        session.execute(stmt)
        session.commit()
        return True

    except SQLAlchemyError as e:
        session.rollback()
        return str(e)
    

print(insert_theme_name_by_username("user01","green"))
