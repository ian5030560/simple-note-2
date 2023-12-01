from rest_framework import serializers
from .models import SigninStatus


class SigninStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = SigninStatus
        fields = "__all__"  # 所有欄位可以這樣寫
