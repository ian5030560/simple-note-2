from rest_framework import serializers
from .models import ViewMediaFile


class ViewMediaFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ViewMediaFile
        fields = "__all__"  # 所有欄位可以這樣寫
