from rest_framework import serializers
from .models import AddContent


class AddContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddContent
        fields = "__all__"  # 所有欄位可以這樣寫
