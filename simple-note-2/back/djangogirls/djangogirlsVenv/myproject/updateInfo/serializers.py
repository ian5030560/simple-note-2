from rest_framework import serializers

from .models import UpdateInfo


class UpdateInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UpdateInfo
        fields = "__all__"  # 所有欄位可以這樣寫
