from rest_framework import serializers
from .models import Breeze


class BreezeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Breeze
        fields = "__all__"  # 所有欄位可以這樣寫
