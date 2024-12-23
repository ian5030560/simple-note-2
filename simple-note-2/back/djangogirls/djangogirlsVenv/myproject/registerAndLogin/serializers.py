from rest_framework import serializers

from .models import RegisterAndLogin


class RegisterAndLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegisterAndLogin
        fields = "__all__"  # 所有欄位可以這樣寫
