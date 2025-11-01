from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, VencimientoViewSet

router = DefaultRouter()
router.register(r'productos', ProductoViewSet)
router.register(r'vencimientos', VencimientoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]