from rest_framework import serializers

from .models import GetNote


class GetNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = GetNote
        fields = "__all__"  # 所有欄位可以這樣寫
