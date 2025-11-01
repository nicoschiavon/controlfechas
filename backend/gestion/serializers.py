from rest_framework import serializers
from .models import Producto, Vencimiento

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

class VencimientoSerializer(serializers.ModelSerializer):
    scanning_producto_nombre = serializers.ReadOnlyField(source='scanning_producto.nombre')
    scanning_producto_tipo = serializers.ReadOnlyField(source='scanning_producto.tipo')

    class Meta:
        model = Vencimiento
        fields = '__all__'