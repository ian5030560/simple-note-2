from rest_framework import serializers

from .models import NewMediaFile


class NewMediaFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewMediaFile
        fields = "__all__"  # 所有欄位可以這樣寫
