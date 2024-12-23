"""note的權限設定:(notes)"""

from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import Note
from .serializers import NoteSerializer


class NoteViewSet(viewsets.ModelViewSet):
    """Note View 權限 Set。"""

    serializer_class = NoteSerializer
    permission_classess = [IsAuthenticated]

    def get_permissions(self):
        """只有 GET 方法是 AllowAny 權限，其他方法需要 IsAuthenticated 權限。"""
        if self.request.method == "GET":
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """確保用戶只能看到自己的 Note 數據。"""
        user = self.request.user
        if user.is_authenticated:
            return Note.objects.filter(owner=user)
        raise PermissionDenied()

    def perform_create(self, serializer):
        """設定當前用戶為 Note 對象的所有者"""
        serializer.save(owner=self.request.user)
