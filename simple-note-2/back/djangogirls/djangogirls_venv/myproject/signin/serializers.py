from rest_framework import serializers
from .models import Signin


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Signin
        fields = "__all__"  # 所有欄位可以這樣寫
