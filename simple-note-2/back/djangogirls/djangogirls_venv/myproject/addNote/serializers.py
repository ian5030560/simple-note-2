from rest_framework import serializers
from .models import AddNote


class AddNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddNote
        fields = "__all__"  # 所有欄位可以這樣寫
