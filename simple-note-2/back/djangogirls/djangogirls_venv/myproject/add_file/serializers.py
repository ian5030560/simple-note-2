from rest_framework import serializers
from .models import AddFile


class AddFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddFile
        fields = "__all__"  # 所有欄位可以這樣寫
