# notes/serializers.py

from rest_framework import serializers

from .models import Note


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ("id", "title", "content")  # 删除 owner 字段
        model = Note
