from rest_framework import serializers
from .models import Logout


class LogoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Logout
        fields = "__all__"  # 所有欄位可以這樣寫
