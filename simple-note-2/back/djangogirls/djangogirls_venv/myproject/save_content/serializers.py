from rest_framework import serializers
from .models import SaveContent


class SaveContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaveContent
        fields = "__all__"  # 所有欄位可以這樣寫
