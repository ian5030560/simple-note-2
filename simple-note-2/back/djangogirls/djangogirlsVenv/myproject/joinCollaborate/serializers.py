from rest_framework import serializers
from .models import JoinCollaborate


class JoinCollaborateSerializer(serializers.ModelSerializer):
    class Meta:
        model = JoinCollaborate
        fields = "__all__"  # 所有欄位可以這樣寫
