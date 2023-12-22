from rest_framework import serializers
from .models import LoadContent


class LoadContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoadContent
        fields = "__all__"  # 所有欄位可以這樣寫
