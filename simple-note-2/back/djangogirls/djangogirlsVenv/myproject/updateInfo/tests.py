from django.test import TestCase
import requests
import datetime

# Create your tests here.
basic_header = {
  'Accept': 'application/json',
  'Content-type': 'application/json',
}

userParams = {
  'username': 'user1',
  'password': 'testuser',
}
post_retrieve_token_res = requests.post('http://localhost:8000/api/jwtauth/token/', json = userParams, headers = basic_header)
res = post_retrieve_token_res.json()
current_time = datetime.datetime.now()
print('current time', current_time)
print('post_retrieve_token', post_retrieve_token_res.status_code)
print('tokens', res)
print('-----')

header = {
    'Authorization': 'Bearer ' + res.get('access')
}
header.update(basic_header)

params = {
  'username': 'user1',
  "password": 123456789
}
BASE_PREFIX = "http://localhost:8000"
req = requests.post(f"{BASE_PREFIX}/info/update/", headers=header, json=params)
print(req.status_code)

params = {
  'username': 'user1',
  'theme': {'id': 1, 'name': "dark"}
}
req = requests.post(f"{BASE_PREFIX}/info/update/", headers=header, json=params)
print(req.status_code)