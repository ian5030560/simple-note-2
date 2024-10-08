from django.test import TestCase

# Create your tests here.
a = [('user18',), ('user18',)]
b = 'user18'

# Convert string b to a tuple
b_tuple = (b,)

if b_tuple in a:
    print("in")

