from rest_framework import serializers

from .models import NewNote


class NewNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewNote
        fields = "__all__"  # 所有欄位可以這樣寫
