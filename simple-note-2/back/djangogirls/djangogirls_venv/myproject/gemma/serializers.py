from rest_framework import serializers
from .models import Gemma


class GemmaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gemma
        fields = "__all__"  # 所有欄位可以這樣寫
