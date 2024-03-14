from rest_framework import serializers
from .models import ViewFile


class ViewFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ViewFile
        fields = "__all__"  # 所有欄位可以這樣寫
