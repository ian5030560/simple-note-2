import codecs
from django.test import TestCase

# Create your tests here.
string = "hello world"
b = string.encode("utf-8")
a = codecs.encode(string)

print(type(a), a)
print(type(b), b)

b = b.decode("utf-8")
print(a)