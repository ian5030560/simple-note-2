from rest_framework import serializers
from .models import LoadNoteTree


class LoadNoteTreeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoadNoteTree
        fields = "__all__"  # 所有欄位可以這樣寫
