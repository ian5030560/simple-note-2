from rest_framework import serializers

from .models import GetTheme


class GetThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GetTheme
        fields = "__all__"  # 所有欄位可以這樣寫
