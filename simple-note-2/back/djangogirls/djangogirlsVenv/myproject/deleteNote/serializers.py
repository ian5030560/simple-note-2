from rest_framework import serializers

from .models import DeleteNote


class DeleteNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeleteNote
        fields = "__all__"  # 所有欄位可以這樣寫
