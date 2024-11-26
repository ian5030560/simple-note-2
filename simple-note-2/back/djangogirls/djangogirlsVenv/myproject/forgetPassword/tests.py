from django.test import TestCase
import requests
import datetime

# Create your tests here.
basic_header = {
  'Accept': 'application/json',
  'Content-type': 'application/json',
}

params = {
  'username': 'user1',
  'email': '',
}
BASE_PREFIX = "http://localhost:8000"
req = requests.post(f"{BASE_PREFIX}/forget-password/", headers=basic_header, json=params)
print(req.status_code)