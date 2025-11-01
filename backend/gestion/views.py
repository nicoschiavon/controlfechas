from rest_framework import viewsets
from .models import Producto, Vencimiento
from .serializers import ProductoSerializer, VencimientoSerializer
from datetime import date, timedelta
from rest_framework.response import Response
from rest_framework.decorators import action

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

class VencimientoViewSet(viewsets.ModelViewSet):
    queryset = Vencimiento.objects.all()
    serializer_class = VencimientoSerializer

    def get_removal_date(self, vencimiento_obj):
        if vencimiento_obj.tipo == 'Lácteo':
            return vencimiento_obj.fecha_vencimiento - timedelta(days=30)
        elif vencimiento_obj.tipo == 'Carne':
            return vencimiento_obj.fecha_vencimiento - timedelta(days=15)
        elif vencimiento_obj.tipo == 'Crema':
            return vencimiento_obj.fecha_vencimiento - timedelta(days=10)
        return vencimiento_obj.fecha_vencimiento # Default to expiration date if type not matched

    def get_priority_status(self, removal_date):
        today = date.today()
        days_until_removal = (removal_date - today).days

        if days_until_removal <= 0:
            return 'Rojo'  # Urgent: On or after removal date
        elif 1 <= days_until_removal <= 10:
            return 'Amarillo' # Warning: 1 to 10 days before removal
        else:
            return 'Verde' # OK: More than 10 days before removal

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        removal_date = self.get_removal_date(instance)
        priority_status = self.get_priority_status(removal_date)
        data['fecha_retiro'] = removal_date
        data['estado_prioridad'] = priority_status
        return Response(data)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            data = serializer.data
            for item in data:
                # Use scanning_producto__scanning to query by the primary key of Producto
                instance = Vencimiento.objects.get(pk=item['id'])
                removal_date = self.get_removal_date(instance)
                priority_status = self.get_priority_status(removal_date)
                item['fecha_retiro'] = removal_date
                item['estado_prioridad'] = priority_status
            return self.get_paginated_response(data)

        serializer = self.get_serializer(queryset, many=True)
        data = serializer.data
        for item in data:
            instance = Vencimiento.objects.get(pk=item['id'])
            removal_date = self.get_removal_date(instance)
            priority_status = self.get_priority_status(removal_date)
            item['fecha_retiro'] = removal_date
            item['estado_prioridad'] = priority_status
        return Response(data)

    @action(detail=False, methods=['get'])
    def priority_list(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        
        # Annotate each Vencimiento with its removal date and priority status
        results = []
        for vencimiento in queryset:
            removal_date = self.get_removal_date(vencimiento)
            priority_status = self.get_priority_status(removal_date)
            results.append({
                'id': vencimiento.id,
                'scanning_producto_scanning': vencimiento.scanning_producto.scanning,
                'scanning_producto_nombre': vencimiento.scanning_producto.nombre,
                'scanning_producto_tipo': vencimiento.scanning_producto.tipo,
                'fecha_vencimiento': vencimiento.fecha_vencimiento,
                'lote': vencimiento.lote,
                'cantidad': vencimiento.cantidad,
                'fecha_retiro': removal_date,
                'estado_prioridad': priority_status
            })

        # Sort by removal date (earliest first)
        results.sort(key=lambda x: x['fecha_retiro'])

        # Apply pagination if needed
        page = self.paginate_queryset(results)
        if page is not None:
            return self.get_paginated_response(page)
        
        return Response(results)