from rest_framework import serializers
from .models import Signout


class SignoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Signout
        fields = "__all__"  # 所有欄位可以這樣寫
