from rest_framework import serializers

from .models import GetInfo


class GetInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GetInfo
        fields = "__all__"  # 所有欄位可以這樣寫
