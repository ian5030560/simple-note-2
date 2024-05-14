from sqlalchemy import create_engine, insert, update, delete
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column
from sqlalchemy import Integer, String, DATETIME, TEXT, BLOB, BOOLEAN
from sqlalchemy.orm import sessionmaker
from pprint import pprint
from sqlalchemy.exc import SQLAlchemyError
import os

Base = declarative_base()
engine_url = os.environ.get("env")
engine = create_engine(engine_url, echo=True)


class User_Personal_Info(Base):
    __tablename__ = "User_Personal_Info"
    id = Column(Integer, primary_key=True, autoincrement=True)
    profile_photo = Column(BLOB)
    theme_id = Column(Integer)
    usernames = Column(String(256))
    user_email = Column(String(256))
    user_password = Column(String(256))
    login_status = Column(BOOLEAN)

    def __init__(
        self,
        id=None,
        profile_photo=None,
        theme_id=None,
        usernames=None,
        user_email=None,
        user_password=None,
        login_status=False,
    ):
        self.id = id
        self.profile_photo = profile_photo
        self.theme_id = theme_id
        self.usernames = usernames
        self.user_email = user_email
        self.user_password = user_password
        self.login_status = login_status


def create_session():
    Session = sessionmaker(bind=engine)
    session = Session()
    return session


session = create_session()


# 檢查此組使用者名稱和密碼是否存在
def check_username_password(username, password):
    user = (
        session.query(User_Personal_Info)
        .filter_by(usernames=username, user_password=password)
        .first()
    )
    if user:
        return True
    else:
        return False


# 檢查是否有相同的使用者名稱
def check_username(username):
    result = session.query(User_Personal_Info).filter_by(usernames=username).first()
    if result:
        return True
    else:
        return False


# 檢查是否有相同的email
def check_email(user_email):
    result = session.query(User_Personal_Info).filter_by(user_email=user_email).first()
    if result:
        return True
    else:
        return False


# 給username檢查login_status
def check_status(username):
    result = session.query(User_Personal_Info).filter_by(usernames=username).first()
    if result:
        return result.login_status
    else:
        return None


# check User_Personal_Info by usernames
def check_user_personal_info(usernames):
    user = session.query(User_Personal_Info).filter_by(usernames=usernames).first()
    if user:
        return {
            "id": user.id,
            "profile_photo": user.profile_photo,
            "theme_id": user.theme_id,
            "usernames": user.usernames,
            "user_email": user.user_email,
            "user_password": user.user_password,
            "login_status": user.login_status
        }
    else:
        return False



# check profile photo by username
def check_profile_photo_by_username(usernames_input):
    result = session.query(User_Personal_Info).filter_by(usernames=usernames_input).first()
    if result:
        return result.profile_photo
    else:
        return False


# 給user_email查password
def search_password(email):
    result = session.query(User_Personal_Info).filter_by(user_email=email).first()
    if result:
        return result.user_password
    else:
        return None


# 插入username,password,user_email到資料庫
def insert_username_password_email(username, password, email):
    new_user = User_Personal_Info(
        usernames=username, user_password=password, user_email=email, login_status=True
    )
    session.add(new_user)
    session.commit()
    return True


# insert_profile_photo_by_username
def insert_profile_photo_by_username(usernames_input, profile_photo_input):
    new_profile_photo = User_Personal_Info(
        usernames=usernames_input, profile_photo=profile_photo_input
    )
    session.add(new_profile_photo)
    session.commit()
    return True


# update_profile_photo_by_username
def update_profile_photo_by_username(usernames_input, profile_photo_input):
    stmt = (
        update(User_Personal_Info)
        .where(User_Personal_Info.usernames == usernames_input)
        .values(profile_photo=profile_photo_input)
    )
    try:
        session.execute(stmt)
        session.commit()
        return True
    except SQLAlchemyError as e:
        # 回朔防止資料庫損壞
        session.rollback()
        return str(e)


# update_user_email_by_username
def update_user_email_by_username(usernames_input, user_email_input):
    stmt = (
        update(User_Personal_Info)
        .where(User_Personal_Info.usernames == usernames_input)
        .values(user_email=user_email_input)
    )
    try:
        session.execute(stmt)
        session.commit()
        return True
    except SQLAlchemyError as e:
        # 回朔防止資料庫損壞
        session.rollback()
        return str(e)
# 給username更新user_password
def update_user_password_by_usernames(usernames_input, user_password_input):
    stmt = (
        update(User_Personal_Info)
        .where(User_Personal_Info.usernames == usernames_input)
        .values(user_password=user_password_input)
    )
    try:
        session.execute(stmt)
        session.commit()
        return True
    except SQLAlchemyError as e:
        # 回朔防止資料庫損壞
        session.rollback()
        return str(e)

# 給username更新login_status
def update_user_login_status_by_usernames(usernames_input, login_status_input):
    stmt = (
        update(User_Personal_Info)
        .where(User_Personal_Info.usernames == usernames_input)
        .values(login_status=login_status_input)
    )
    try:
        session.execute(stmt)
        session.commit()
        return True
    except SQLAlchemyError as e:
        # 回朔防止資料庫損壞
        session.rollback()
        return str(e)    
        


# 給username去change login_status
def change_login_status(username):
    user = session.query(User_Personal_Info).filter_by(usernames=username).first()
    if user:
        # 更新login_status True改Fasle,Fasle改True
        if user.login_status == True:
            user.login_status = False
        else:
            user.login_status = True

        session.commit()
        return user.login_status
    else:
        return None


pprint(update_user_login_status_by_usernames("user01",0))
