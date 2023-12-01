from rest_framework import serializers
from .models import ForgetPassword


class ForgetPasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForgetPassword
        fields = "__all__"  # 所有欄位可以這樣寫
