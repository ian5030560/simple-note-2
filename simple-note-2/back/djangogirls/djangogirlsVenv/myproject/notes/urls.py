from django.urls import path
from rest_framework.routers import SimpleRouter
from .views import NoteViewSet

router = SimpleRouter() # 创建 SimpleRouter() 对象
router.register('notes', NoteViewSet, basename="notes") # 注册路由
urlpatterns = router.urls # 将路由加入到 urls 中