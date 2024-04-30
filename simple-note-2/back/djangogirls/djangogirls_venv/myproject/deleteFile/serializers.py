from rest_framework import serializers
from .models import DeleteFile


class DeleteFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeleteFile
        fields = "__all__"  # 所有欄位可以這樣寫
