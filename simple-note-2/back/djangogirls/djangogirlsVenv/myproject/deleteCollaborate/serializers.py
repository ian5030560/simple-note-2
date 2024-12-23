from rest_framework import serializers

from .models import DeleteCollaborate


class DeleteCollaborateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeleteCollaborate
        fields = "__all__"  # 所有欄位可以這樣寫
