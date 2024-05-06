from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column
from sqlalchemy import Integer, String, DATETIME, TEXT, BLOB, BOOLEAN
from sqlalchemy.orm import sessionmaker

Base = declarative_base()
engine_url = "mysql+pymysql://root:w83dk4xup6@localhost:3306/simplenote2db"
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

#給username檢查login_status
def check_status(username):
    result = session.query(User_Personal_Info).filter_by(usernames=username).first()
    if result:
        return result.login_status
    else:
        return None

#給user_email查password
def search_password(email):
    result = session.query(User_Personal_Info).filter_by(user_email=email).first()
    if result:
        return result.user_password
    else:
        return None
                


# 插入username,password,user_email到資料庫
def insert_username_password_email(username, password, email):
    new_user = User_Personal_Info(usernames=username, user_password=password, user_email=email, login_status=True)
    session.add(new_user)
    session.commit()

#給username去change 
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


# print(change_login_status("user02"))
