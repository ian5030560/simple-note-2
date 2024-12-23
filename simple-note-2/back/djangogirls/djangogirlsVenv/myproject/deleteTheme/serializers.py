from rest_framework import serializers

from .models import DeleteTheme


class DeleteThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeleteTheme
        fields = "__all__"  # 所有欄位可以這樣寫
