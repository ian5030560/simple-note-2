import json
from django.test import TestCase

# Create your tests here.
respArray = []
notesDataID = 1
notesDataName = "abc"
parentId = 2
silblingId = 3
singleNoteData = {"noteId": notesDataID, "noteName": notesDataName, "parentId": parentId, "silblingId": silblingId}
respArray.append(singleNoteData)


a = json.dumps(list(map(list, respArray)))
b = json.dumps(respArray)
print(a)
print(b)