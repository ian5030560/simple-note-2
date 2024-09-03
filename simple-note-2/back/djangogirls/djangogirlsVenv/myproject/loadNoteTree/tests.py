import json
from django.test import TestCase

# Create your tests here.
notesDataID = 1
notesDataName = "abc"
parentId = 2
silblingId = 3
singleNoteData = {"noteId": notesDataID, "noteName": notesDataName, "parentId": parentId, "silblingId": silblingId}
respArray = {"one": singleNoteData}

# a = json.dumps(list(map(list, respArray)))
# b = json.dumps(respArray)
# print(a)
# print(b)
print(respArray)
print(type(respArray))
# print(type(b))