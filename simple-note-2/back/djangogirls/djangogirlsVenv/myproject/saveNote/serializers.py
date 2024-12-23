from rest_framework import serializers

from .models import SaveNote


class SaveNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaveNote
        fields = "__all__"  # 所有欄位可以這樣寫
