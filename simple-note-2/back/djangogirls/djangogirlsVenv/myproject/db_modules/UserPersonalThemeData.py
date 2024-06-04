from sqlalchemy import and_, create_engine, insert, update
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column
from sqlalchemy import Integer, String, DATETIME, TEXT, BLOB, BOOLEAN
from sqlalchemy.orm import sessionmaker
from .UserPersonalInfo import User_Personal_Info
from sqlalchemy.exc import SQLAlchemyError
import os

Base = declarative_base()
# engine_url = os.environ.get("env")
engine_url = "mysql+pymysql://root@localhost/simplenote2db"
# engine_url = "mysql+pymysql://root:ucdw6eak@localhost:3306/simplenote2db"
engine_url = "mysql+pymysql://root:root@0.tcp.jp.ngrok.io:11051/simplenote2db"
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


# check_theme_name
def check_theme_name(usernames_input, theme_name_input):
    user_id_query = (
        session.query(User_Personal_Info.id)
        .filter((User_Personal_Info.usernames == usernames_input))
        .first()
    )
    result = (
        session.query(User_Personal_Theme_Data)
        .filter_by(user_id=user_id_query[0], theme_name=theme_name_input)
        .first()
    )
    session.close()
    if result:
        return True
    else:
        return False


# update_theme_name_by_username
def update_theme_name(usernames_input, old_theme_name_input, new_theme_name_input):
    user_id_query = (
        session.query(User_Personal_Info.id)
        .filter((User_Personal_Info.usernames == usernames_input))
        .first()
    )
    try:
        stmt = (
            update(User_Personal_Theme_Data)
            .where(
                and_(
                    User_Personal_Theme_Data.user_id == user_id_query[0],
                    User_Personal_Theme_Data.theme_name == old_theme_name_input,
                )
            )
            .values(theme_name=new_theme_name_input)
        )
        session.execute(stmt)
        session.commit()
        return True

    except SQLAlchemyError as e:
        session.rollback()
        print(e)
        return False
    finally:
        session.close()
        
#update theme data by username and theme name
def update_themeData_by_usernames(usernames_input,theme_name_input,color_light_primary_input,color_light_base_bg_input,color_dark_primary_input,color_dark_base_bg_input):
    user_id_query = (
        session.query(User_Personal_Info.id)
        .filter((User_Personal_Info.usernames == usernames_input))
        .first()
    )
    try:
        stmt = (
            update(User_Personal_Theme_Data)
            .where(
                and_(
                    User_Personal_Theme_Data.user_id == user_id_query[0],
                    User_Personal_Theme_Data.theme_name == theme_name_input,
                )
            )
            .values(
                color_light_primary=color_light_primary_input,
                color_light_base_bg=color_light_base_bg_input,
                color_dark_primary=color_dark_primary_input,
                color_dark_base_bg=color_dark_base_bg_input,
            )
        )
        session.execute(stmt)
        session.commit()
        return True
    except SQLAlchemyError as e:
        session.rollback()
        print(e)
        return False
    finally:
        session.close()
    

# insert_theme_name_by_username
def insert_theme_name_by_username(usernames_input, theme_name_input):
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
                User_Personal_Theme_Data.theme_name == theme_name_input,
            )
            .first()
        )
        if existing_data:
            return False
        stmt = insert(User_Personal_Theme_Data).values(
            user_id=user_id_query[0], theme_name=theme_name_input
        )
        session.execute(stmt)
        session.commit()
        return True

    except SQLAlchemyError as e:
        session.rollback()
        print(e)
        return False
    finally:
        session.close()


def insert_themeData_by_usernames(
    usernames_input,
    theme_name_input,
    color_light_primary_input,
    color_light_base_bg_input,
    color_dark_primary_input,
    color_dark_base_bg_input,
):
    user_id_query = (
        session.query(User_Personal_Info.id)
        .filter((User_Personal_Info.usernames == usernames_input))
        .first()
    )
    stmt = insert(User_Personal_Theme_Data).values(
        user_id=user_id_query[0],
        theme_name=theme_name_input,
        color_light_primary=color_light_primary_input,
        color_light_base_bg=color_light_base_bg_input,
        color_dark_primary=color_dark_primary_input,
        color_dark_base_bg=color_dark_base_bg_input,
    )
    try:
        session.execute(stmt)
        session.commit()
        return True

    except SQLAlchemyError as e:
        session.rollback()
        return str(e)
    finally:
        session.close()


# print(update_themeData_by_usernames("user01","light",5,5,5,5))
