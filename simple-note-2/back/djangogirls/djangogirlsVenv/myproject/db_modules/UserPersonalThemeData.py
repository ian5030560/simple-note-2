from sqlalchemy import and_, create_engine, insert, update, delete
from sqlalchemy import Column
from sqlalchemy import Integer, String, DATETIME, TEXT, BLOB, BOOLEAN
from sqlalchemy.orm import sessionmaker, scoped_session, declarative_base
from .UserPersonalInfo import User_Personal_Info
from sqlalchemy.exc import SQLAlchemyError
import os
from .Common import engine

Base = declarative_base()
# engine_url = os.environ.get("env")
# # engine_url = "mysql+pymysql://root@localhost/simplenote2db"
# engine_url = "mysql+pymysql://root:ucdw6eak@localhost:3306/simplenote2db"
# # engine_url = "mysql+pymysql://root:root@0.tcp.jp.ngrok.io:11051/simplenote2db"
# # engine_url = "mysql+pymysql://root:niko1024@localhost:3306/simplenote2db"
# engine = create_engine(engine_url, echo=True)


class User_Personal_Theme_Data(Base):
    __tablename__ = "User_Personal_Theme_Data"
    id = Column(Integer, primary_key=True, autoincrement=True)
    theme_name = Column(String(256))
    color_light_primary = Column(String(256))
    color_light_base_bg = Column(String(256))
    color_dark_primary = Column(String(256))
    color_dark_base_bg = Column(String(256))
    user_id = Column(Integer)


# def create_session():
#     Session = sessionmaker(bind=engine)
#     session = Session()
# return session


def create_session():
    Session = scoped_session(sessionmaker(bind=engine))
    return Session


# check_theme_name
def check_theme_name(
    usernames_input,
    theme_name_input,
):
    session = create_session()
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


# Return all theme data by username
def check_all_theme_data(usernames_input) -> list[tuple[int, str, str, str, str, str, str]]:
    session = create_session()
    try:
        # 查詢 user_id
        user_id_query = (
            session.query(User_Personal_Info.id)
            .filter(User_Personal_Info.usernames == usernames_input)
            .first()
        )

        # 如果 user_id_query 是 None，直接返回空列表
        if not user_id_query:
            return []

        # 查詢與 user_id 對應的所有主題資料
        result = (
            session.query(
                User_Personal_Theme_Data.id, 
                User_Personal_Theme_Data.theme_name,
                User_Personal_Theme_Data.color_light_primary,
                User_Personal_Theme_Data.color_light_base_bg,
                User_Personal_Theme_Data.color_dark_primary,
                User_Personal_Theme_Data.color_dark_base_bg,
            )
            .filter(User_Personal_Theme_Data.user_id == user_id_query[0])
            .all()
        )
        return result  # 返回主題資料列表
    except SQLAlchemyError as e:
        #print(e)
        return False
    finally:
        # 確保 session 被正確關閉
        session.close()


# Delete one theme data by theme id(database 的 id)
def delete_one_theme_data(theme_id_input):
    session = create_session()
    try:
        stmt = delete(User_Personal_Theme_Data).where(
            User_Personal_Theme_Data.id == theme_id_input
        )
        session.execute(stmt)
        session.commit()
        return True
    except SQLAlchemyError as e:
        session.rollback()
        return str(e)
    finally:
        session.close()


# update_theme_name_by_username
def update_theme_name(usernames_input, old_theme_name_input, new_theme_name_input):
    session = create_session()
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


# update theme data by username and theme name
def update_themeData_by_usernames(
    usernames_input,
    theme_name_input,
    color_light_primary_input,
    color_light_base_bg_input,
    color_dark_primary_input,
    color_dark_base_bg_input,
):
    session = create_session()
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
    session = create_session()
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
    session = create_session()
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


#print(delete_one_theme_data("3"))
