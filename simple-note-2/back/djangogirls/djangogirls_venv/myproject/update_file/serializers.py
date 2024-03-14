from rest_framework import serializers
from .models import UpdateFile


class UpdateFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UpdateFile
        fields = "__all__"  # 所有欄位可以這樣寫
