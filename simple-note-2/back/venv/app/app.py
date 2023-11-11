from flask import Flask
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

@app.route("/")
def index():
    return "Hello"

# open venv mode and type "flask run" in terminal to execute