from rest_framework import serializers

from .models import NewCollaborate


class NewCollaborateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewCollaborate
        fields = "__all__"  # 所有欄位可以這樣寫
