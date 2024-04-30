from rest_framework import serializers
from .models import UpdateMediaFile


class UpdateMediaFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UpdateMediaFile
        fields = "__all__"  # 所有欄位可以這樣寫
