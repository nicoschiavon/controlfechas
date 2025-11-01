from django.db import models

class Producto(models.Model):
    TIPO_CHOICES = [
        ('Lácteo', 'Lácteo'),
        ('Carne', 'Carne'),
        ('Crema', 'Crema'),
    ]
    scanning = models.CharField(max_length=100, unique=True, primary_key=True)
    nombre = models.CharField(max_length=100)
    tipo = models.CharField(max_length=50, choices=TIPO_CHOICES)

    def __str__(self):
        return f"{self.nombre} ({self.scanning})"

class Vencimiento(models.Model):
    scanning_producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    fecha_vencimiento = models.DateField()
    cantidad = models.IntegerField()
    lote = models.CharField(max_length=100)
    tipo = models.CharField(max_length=50, choices=Producto.TIPO_CHOICES) # Should be consistent with Product type

    def __str__(self):
        return f"{self.scanning_producto.nombre} - Lote: {self.lote} - Vence: {self.fecha_vencimiento}"