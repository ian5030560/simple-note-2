from rest_framework import serializers

from .models import NewTheme


class NewThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewTheme
        fields = "__all__"  # 所有欄位可以這樣寫
