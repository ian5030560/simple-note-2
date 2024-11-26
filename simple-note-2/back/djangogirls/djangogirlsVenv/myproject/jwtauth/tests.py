import datetime
from django.test import TestCase
import requests
# Create your tests here.
basic_header = {
  'Accept': 'application/json',
  'Content-type': 'application/json',
}

# test1: get_notes_res (should return 200 because setting: AllowedAny)
get_notes_res = requests.get('http://localhost:8000/api/notes/', headers = basic_header)
print('get_notes_res', get_notes_res.status_code)
print('-----')

# test2: post_notes_res (should return 403 because setting: IsAuthenticated)
user_params = {
  'owner': 1,
  'title': 'test_post_notes',
  'content': 'test_post_notes',
}
post_notes_res = requests.post('http://localhost:8000/api/notes/', json = user_params, headers = basic_header)
print('post_notes_res', post_notes_res.status_code)
print('-----')

# test3: post_register_user_res (should return 403 because setting: IsAuthenticated)
new_user = {
  'username': 'newuser',
  'password': 'testuser',
  'password2': 'testuser',
  'email': 'newuser@gmail.com'
}
post_register_user_res = requests.post('http://localhost:8000/api/jwtauth/register/', json = new_user, headers = basic_header )
print('post_register_user_res', post_register_user_res.status_code)
print('-----')

# test4: post_retrieve_token_res (should return 200 if the login user is available)
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

# test5: post_notes_res (should return 201 because being authorized)
with_token_header = {
  'Accept': 'application/json',
  'Content-type': 'application/json',
  'Authorization': 'Bearer ' + res.get('access')
}
user_params = {
  'owner': 1,
  'title': 'test_post_notes',
  'content': 'test_post_notes',
}
post_notes_res = requests.post('http://localhost:8000/api/notes/', json = user_params, headers = with_token_header)
print('post_notes_res', post_notes_res.status_code)
print('-----')

print('wait for more than 1 minute')
import time
time.sleep(60)

# test6: post_notes_res (should return 403 because access token expired)
post_notes_res = requests.post('http://localhost:8000/api/notes/', json = user_params, headers = with_token_header)
current_time = datetime.datetime.now()
print('current time', current_time)
print('post_notes_res', post_notes_res.status_code)
print('-----')

# test7: get_notes_res (should return 200 because setting: AllowedAny)
get_notes_res = requests.get('http://localhost:8000/api/notes/', headers = basic_header)
print('get_notes_res', get_notes_res.status_code)
print('-----')

# test8: post_refresh_token_res (should return 200 if refresh token is available)
refreshParams = {
  'refresh': res.get('refresh'),
}
post_refresh_token_res = requests.post('http://localhost:8000/api/jwtauth/refresh/', json = refreshParams, headers = basic_header)
print('post_refresh_token_res', post_refresh_token_res.status_code)
refreshRes = post_refresh_token_res.json();
print('new access token', refreshRes.get('access'))
print('-----')

# test9: post_notes_res (should return 201 because being authorized)
with_refresh_token_header = {
  'Accept': 'application/json',
  'Content-type': 'application/json',
  'Authorization': 'Bearer ' + refreshRes.get('access')
}
post_notes_res = requests.post('http://localhost:8000/api/notes/', json = user_params, headers = with_refresh_token_header)
print('post_notes_res', post_notes_res.status_code)
print('-----')

# test10: post_register_user_res (should return 201 because being authorized)
new_user = {
  'username': 'newuser',
  'password': 'testuser',
  'password2': 'testuser',
  'email': 'newuser@gmail.com'
}
post_register_user_res = requests.post('http://localhost:8000/api/jwtauth/register/', json = new_user, headers = with_refresh_token_header )
print('post_register_user_res', post_register_user_res.status_code)
print('-----')