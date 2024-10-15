from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base

# engine_url = "mysql+pymysql://root:root@0.tcp.jp.ngrok.io:11051/simplenote2db"
# engine_url = "mysql+pymysql://root:ucdw6eak@localhost:3306/simplenote2db"
# engine_url = "mysql+pymysql://root@localhost:3306/simplenote2db"
engine_url = "mysql+pymysql://root:root@localhost:3306/simplenote2db"
engine = create_engine(engine_url, echo=True) 