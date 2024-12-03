from sqlalchemy import create_engine, insert, update, delete
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column
from sqlalchemy import Integer, String, DATETIME, TEXT, BLOB, BOOLEAN
from sqlalchemy.orm import sessionmaker,scoped_session
from pprint import pprint
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


class User_Personal_Info(Base):
    __tablename__ = "User_Personal_Info"
    id = Column(Integer, primary_key=True, autoincrement=True)
    profile_photo = Column(TEXT)
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


# def create_session():
#     Session = sessionmaker(bind=engine)
#     session = Session()
    # return session
    
def create_session():
    Session = scoped_session(sessionmaker(bind=engine))
    return Session



# 檢查此組使用者名稱和密碼是否存在
def check_username_password(username, password):
    session = create_session()
    user = (
        session.query(User_Personal_Info)
        .filter_by(usernames=username, user_password=password)
        .first()
    )
    try:
        if user:
            return True
        else:
            return False
    except SQLAlchemyError as e:
        # 回朔防止資料庫損壞
        session.rollback()
        print (str(e))
        return False
    finally:
        session.close()    


# 檢查是否有相同的使用者名稱
def check_username(username):
    session = create_session()
    result = session.query(User_Personal_Info).filter_by(usernames=username).first()
    try:
        if result:
            return True
        else:
            return False
    except SQLAlchemyError as e:
        # 回朔防止資料庫損壞
        session.rollback()
        print (str(e))
        return False
    finally:
        session.close()    


# 檢查是否有相同的email
def check_email(user_email):
    session = create_session()
    result = session.query(User_Personal_Info).filter_by(user_email=user_email).first()
    try:
        if result:
            return True
        else:
            return False
    except SQLAlchemyError as e:
        # 回朔防止資料庫損壞
        session.rollback()
        print (str(e))
        return False
    finally:
        session.close()    


# 給username檢查login_status
def check_status(username):
    session = create_session()
    result = session.query(User_Personal_Info).filter_by(usernames=username).first()
    try:
        if result:
            return result.login_status
        else:
            return None
    except SQLAlchemyError as e:
        # 回朔防止資料庫損壞
        session.rollback()
        print (str(e))
        return False
    finally:
        session.close()    


# check User_Personal_Info by usernames
def check_user_personal_info(usernames):
    session = create_session()
    user = session.query(User_Personal_Info).filter_by(usernames=usernames).first()
    try:
        if user:
            return {
                "id": user.id,
                "image": user.profile_photo,
                "themeId": user.theme_id,
                "username": user.usernames,
                "user_email": user.user_email,
                "password": user.user_password,
            }
        else:
            return False
    except SQLAlchemyError as e:
        # 回朔防止資料庫損壞
        session.rollback()
        print (str(e))
        return False
    finally:
        session.close()    



# check profile photo by username
def check_profile_photo_by_username(usernames_input):
    session = create_session()
    result = session.query(User_Personal_Info).filter_by(usernames=usernames_input).first()
    try:
        if result:
            return result.profile_photo
        else:
            return False
    except SQLAlchemyError as e:
        # 回朔防止資料庫損壞
        session.rollback()
        print (str(e))
        return False
    finally:
        session.close()    


# 給user_email查password
def search_password(email):
    session = create_session()
    result = session.query(User_Personal_Info).filter_by(user_email=email).first()
    try:
        if result:
            return result.user_password
        else:
            return None
    except SQLAlchemyError as e:
        # 回朔防止資料庫損壞
        session.rollback()
        print (str(e))
        return False
    finally:
        session.close()

# 插入username,password,user_email到資料庫
def insert_username_password_email(username, password, email):
    session = create_session()
    new_user = User_Personal_Info(
        usernames=username, user_password=password, user_email=email, login_status=True
    )
    session.add(new_user)
    session.commit()
    return True


# insert_profile_photo_by_username
def insert_profile_photo_by_username(usernames_input, profile_photo_input):
    session = create_session()
    try:
        new_profile_photo = User_Personal_Info(
            usernames=usernames_input, profile_photo=profile_photo_input
        )
        session.add(new_profile_photo)
        session.commit()
        return True
    except SQLAlchemyError as e:
        print(e)
        return False
    finally:
        session.close()   
    

# update_profile_photo_by_username
def update_profile_photo_by_username(usernames_input, profile_photo_input):
    session = create_session()
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
        print(e)
        # 回朔防止資料庫損壞
        session.rollback()
        return False
    finally:
        session.close()   


# update_user_email_by_username
def update_user_email_by_username(usernames_input, user_email_input):
    session = create_session()
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
    finally:
        session.close()   
# 給username更新user_password
def update_user_password_by_usernames(usernames_input, user_password_input):
    session = create_session()
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
    finally:
        session.close()

# 給username更新theme_id
def update_user_theme_id_by_usernames(usernames_input:str, theme_id_input :str | None) -> bool:
    session = create_session()
    stmt = (
        update(User_Personal_Info)
        .where(User_Personal_Info.usernames == usernames_input)
        .values(theme_id=theme_id_input)
    )
    try:
        session.execute(stmt)
        session.commit()
        return True
    except SQLAlchemyError as e:
        # 回朔防止資料庫損壞
        session.rollback()
        return str(e)
    finally:
        session.close()           

# 給username更新login_status
def update_user_login_status_by_usernames(usernames_input, login_status_input):
    session = create_session()
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
    finally:
        session.close()       
        


# 給username去change login_status
def change_login_status(username):
    session = create_session()
    user = session.query(User_Personal_Info).filter_by(usernames=username).first()
    try:
        if user:
            # 更新login_status True改False,False改True
            if user.login_status == True:
                user.login_status = False
            else:
                user.login_status = True

            session.commit()
            return user.login_status
        else:
            return None
    except SQLAlchemyError as e:
        # 回朔防止資料庫損壞
        session.rollback()
        return str(e)
    finally:
        session.close()    


# print(check_profile_photo_by_username("user01"))
