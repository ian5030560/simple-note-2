# notes/views.py

from rest_framework import viewsets
from .models import Note
from .serializers import NoteSerializer
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated, AllowAny

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classess = [IsAuthenticated]
    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    # 确保用户只能看到自己的 Note 数据。
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Note.objects.filter(owner=user)
        raise PermissionDenied()

    # 设置当前用户为 Note 对象的所有者
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)