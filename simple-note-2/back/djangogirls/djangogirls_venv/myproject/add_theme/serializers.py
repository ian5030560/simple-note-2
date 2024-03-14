from rest_framework import serializers
from .models import AddTheme


class AddThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddTheme
        fields = "__all__"  # 所有欄位可以這樣寫
